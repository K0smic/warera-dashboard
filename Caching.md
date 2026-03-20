# Caching & Polling Architecture

## Overview

This project runs on `adapter-static` (GitHub Pages). There is no server, no SSE, no WebSockets.
Every route change re-runs the `load` function in the browser. Without a cache layer, every
navigation would hit the network even for data fetched seconds ago.

The architecture is built on three pieces:

1. **`queryCache`** — module-level SWR cache backed by Svelte 5 runes.
2. **`batchFetch`** — in-flight dedup wrapper around `trpcBatchFetch`.
3. **`usePolling`** — `$effect`-based interval that forces a refresh on a fixed schedule.

---

## Files

```
lib/
  services/
    api/
      utils/
        use-polling.svelte.ts     # polling rune
      client.ts                   # trpcFetch, trpcBatchFetch, ApiError, withRetry
      batch-fetch.ts              # batchFetch with in-flight dedup, re-exports ApiError
  stores/
    cache.svelte.ts       # SWR cache singleton
```

---

## `queryCache` — `lib/stores/cache.svelte.ts`

Module-level singleton. Persists across navigations for the lifetime of the browser session.

### API

```ts
queryCache.get<T>(key: string): T | undefined
queryCache.set<T>(key: string, data: T, staleAfterMs?: number): void  // default 60000
queryCache.isStale(key: string): boolean        // true if missing or TTL expired
queryCache.invalidate(key: string): void        // remove single key
queryCache.invalidatePrefix(prefix: string): void  // remove all keys with prefix
queryCache.clear(): void
queryCache.size: number
```

### How it works

- Backed by a `Map<string, CacheEntry>` held in `$state`.
- A `_version` counter is incremented on every write. Every read method reads `_version`
  so that `$derived` blocks that call `queryCache.get()` re-run when the cache changes.
- `isStale` returns `true` both when the key is missing and when `Date.now() - fetchedAt > staleAfterMs`.

### TTL conventions

| Data                                 | TTL   | Reason                              |
| ------------------------------------ | ----- | ----------------------------------- |
| Company dashboard                    | 30 s  | Financial data, prices change often |
| Companies list                       | 60 s  | Less volatile                       |
| Layout (configs, countries, regions) | 5 min | Near-static, rarely changes         |

---

## `batchFetch` — `lib/services/api/batch-fetch.ts`

Wraps `trpcBatchFetch` with an in-flight dedup map.

### In-flight dedup

```ts
const inFlight = new Map<string, Promise<unknown>>();
```

Key is built by serialising every `path:input` pair in the request array:

```ts
const key = requests.map((r) => `${r.path}:${JSON.stringify(r.input)}`).join('|');
```

If two concurrent callers send the same batch (e.g. two components mounting simultaneously),
they share one HTTP request. The entry is deleted in `.finally()` so the next call after
settlement always goes to the network.

### Signature

```ts
batchFetch(
  requests: ReadonlyArray<{ path, input }>,
  fetchFn?: typeof fetch,       // pass SvelteKit's fetch inside load functions
  signal?: AbortSignal
): Promise<TypedTuple>
```

---

## `trpcFetch` / `trpcBatchFetch` — `lib/services/api/client.ts`

### `ApiError`

```ts
class ApiError extends Error {
  status: number   // HTTP status code
  body: string     // raw response body
  path: string     // tRPC path(s)
  isClientError: boolean  // true for 4xx except 429
}
```

Use `instanceof ApiError` in `load` functions to map to SvelteKit's `error()`:

```ts
if (e instanceof ApiError) {
  error(e.status === 404 ? 404 : 500, e.message);
}
```

### Retry (`withRetry`)

- Max 3 attempts, exponential backoff: 200 ms → 400 ms → 800 ms.
- Retries only on statuses: `429, 502, 503, 504`.
- Any other `ApiError` bubbles up immediately (no point retrying a 401 or 400).
- If `signal` is aborted during the backoff delay the `AbortError` is thrown immediately
  without waiting for the full delay.

---

## `usePolling` — `lib/services/api/utils/use-polling.svelte.ts`

### What it does

Each tick:

1. Calls `queryCache.invalidate(key)` — evicts the SWR entry so the load function
   hits the network instead of returning cached data.
2. Calls SvelteKit's `invalidate(key)` — re-runs every `load` that called `depends(key)`.

Without step 1, `invalidate` re-runs the load but the load reads a fresh cache entry
and returns immediately without fetching. Both steps are always required.

### Visibility gating

The interval is paused while `document.hidden` is true and resumed on `visibilitychange`.
This avoids wasting API rate-limit budget when the tab is in the background.

### Reactive key

`key` is a getter `() => string`, not a plain string. It is evaluated in the `$effect` body
so Svelte tracks it as a reactive dependency. If the value changes (e.g. the user navigates
to a different `companyId`), the effect tears down the old interval and starts a new one.

### Signature

```ts
usePolling(key: () => string, intervalMs?: number): void  // default 60000
```

Must be called at the **top level** of a `<script>` block — never inside a handler or
conditional. The file must have the `.svelte.ts` extension.

---

## Pattern — `load` function

Every `load` function that uses the cache follows this structure:

```ts
export const load: PageLoad = async ({ fetch, params, depends }) => {
  const cacheKey = `resource:${params.id}`;
  depends(cacheKey);  // must match the string passed to invalidate()

  // 1. Return cached data if still fresh.
  if (!queryCache.isStale(cacheKey)) {
    const cached = queryCache.get(cacheKey);
    if (cached) return cached;
  }

  // 2. Fetch with AbortController.
  const controller = new AbortController();

  try {
    const data = await batchFetch([...], fetch, controller.signal);

    // 3. Cache the result.
    queryCache.set(cacheKey, data, TTL_MS);
    return data;

  } catch (e) {
    // Navigation cancelled — return stale cache or let SvelteKit handle it.
    if (e instanceof DOMException && e.name === 'AbortError') {
      return queryCache.get(cacheKey) ?? error(503, 'Request cancelled');
    }
    if (e instanceof ApiError) {
      error(e.status === 404 ? 404 : 500, e.message);
    }
    throw e;
  }
};
```

### `AbortController`

- Ties every `fetch` call to the navigation lifetime.
- If the user navigates away mid-fetch, SvelteKit discards the load and the pending
  HTTP requests are cancelled immediately.
- Do **not** use `AbortController` in `+layout.ts` — aborting layout fetches would
  leave global stores (configs, regions) in an uninitialised state for the whole session.

---

## Pattern — `+page.svelte` with polling

```svelte
<script lang="ts">
	import { page } from '$app/state';
	import { usePolling } from '$lib/utils/use-polling.svelte';

	let { data } = $props();

	// Key must be identical to the one passed to depends() in +page.ts.
	usePolling(() => `resource:${page.params.id}`);
</script>
```

Always derive the key from `page.params` (via `$app/state`), not from `data` properties.
`data` fields may be undefined on first render; `page.params` is always populated.

---

## Pattern — `+layout.svelte` with polling

`+layout.svelte` is mounted once and never unmounted during client-side navigation,
so intervals registered here live for the entire session.

```svelte
<script lang="ts">
	import { usePolling } from '$lib/utils/use-polling.svelte';

	let { children } = $props();

	usePolling(['layout:configs', 'layout:countries', 'layout:regions'], 5 * 60000);
</script>

{@render children()}
```

---

## Key rules

- **`depends(key)` and `invalidate(key)` must use the exact same string.** A mismatch
  causes `invalidate` to fire silently with no effect — the load never re-runs.
- **Always evict the cache before calling `invalidate`.** The order is
  `queryCache.invalidate` → `invalidate`. Reversed order has no effect.
- **Never call `usePolling` inside a handler or conditional.** `$effect` must run
  during component initialisation.
- **Never use `AbortController` in layout load functions.** Only use it in page-level
  load functions that can safely be discarded mid-navigation.
- **Mutations should call `queryCache.invalidate(key)` + `invalidate(key)`** after
  the API call completes, so the next render reflects the updated state immediately.
