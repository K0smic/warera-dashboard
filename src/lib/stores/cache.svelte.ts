/**
 * Stale-while-revalidate cache backed by Svelte 5 runes.
 *
 * The cache is a module-level singleton — it persists across navigations
 * for the lifetime of the browser session, which is exactly what you want
 * on adapter-static where every route change would otherwise re-fetch.
 *
 * Usage:
 *   queryCache.set('companies:u123', companies, 60000);
 *   if (!queryCache.isStale('companies:u123')) {
 *     return { companies: queryCache.get('companies:u123') };
 *   }
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CacheEntry<T = unknown> {
	data: T;
	fetchedAt: number;
	staleAfterMs: number;
}

interface QueryCacheStore {
	/** Return the cached value, or undefined if the key is not present. */
	get<T>(key: string): T | undefined;
	/** Store a value. Default TTL is 60 seconds. */
	set<T>(key: string, data: T, staleAfterMs?: number): void;
	/** True when the entry is missing or older than its TTL. */
	isStale(key: string): boolean;
	/**
	 * Remove all keys that start with `prefix`.
	 * Useful after a mutation: invalidatePrefix('companies:') clears every
	 * per-user companies cache in one call.
	 */
	invalidatePrefix(prefix: string): void;
	/** Remove a single key. */
	invalidate(key: string): void;
	/** Remove all entries. */
	clear(): void;
	/** Read-only snapshot — useful for debugging in devtools. */
	readonly size: number;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

function createQueryCache(): QueryCacheStore {
	// The Map itself is the reactive root.
	// Because Map mutations are not tracked by Svelte's proxy, we hold a
	// counter that we increment on every write so that derived state and
	// $derived blocks that read `version` re-run when the cache changes.
	let entries = $state(new Map<string, CacheEntry>());
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let _version = $state(0);

	function bump() {
		_version++;
	}

	return {
		get size() {
			// Reading _version makes this reactive.
			void _version;
			return entries.size;
		},

		get<T>(key: string): T | undefined {
			void _version;
			return entries.get(key)?.data as T | undefined;
		},

		set<T>(key: string, data: T, staleAfterMs = 60000): void {
			entries.set(key, { data, fetchedAt: Date.now(), staleAfterMs });
			bump();
		},

		isStale(key: string): boolean {
			void _version;
			const entry = entries.get(key);
			if (!entry) return true;
			return Date.now() - entry.fetchedAt > entry.staleAfterMs;
		},

		invalidate(key: string): void {
			if (entries.delete(key)) bump();
		},

		invalidatePrefix(prefix: string): void {
			let deleted = false;
			for (const key of entries.keys()) {
				if (key.startsWith(prefix)) {
					entries.delete(key);
					deleted = true;
				}
			}
			if (deleted) bump();
		},

		clear(): void {
			entries.clear();
			bump();
		}
	};
}

// ---------------------------------------------------------------------------
// Singleton export
// ---------------------------------------------------------------------------

export const queryCache = createQueryCache();
