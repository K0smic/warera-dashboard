import { invalidate } from '$app/navigation';
import { queryCache } from '$lib/stores/cache.svelte';

/**
 * Polls a SvelteKit dependency key on a fixed interval.
 *
 * Each tick evicts the SWR cache entry then calls `invalidate()`, forcing the
 * load function to hit the network instead of returning cached data.
 * The interval is paused while the tab is hidden and resumed on visibility.
 *
 * `key` must return the same string passed to `depends()` in `+page.ts`.
 *
 * @example
 * // +page.ts
 * depends(`companies:${params.userId}`);
 *
 * // +page.svelte
 * usePolling(() => `companies:${page.params.userId}`);
 */
export function usePolling(keys: string | string[], intervalMs = 60000): void {
	$effect(() => {
		// Resolved eagerly so Svelte tracks it as a reactive dependency —
		// if the key changes the effect restarts with the new value.
		const resolvedKeys = Array.isArray(keys) ? keys : [keys];

		let timerId: ReturnType<typeof setInterval>;

		const start = (): void => {
			timerId = setInterval(tick, intervalMs);
		};

		const stop = (): void => {
			clearInterval(timerId);
		};

		const tick = (): void => {
			// Evict first — otherwise the load short-circuits via SWR.
			resolvedKeys.forEach((k) => {
				queryCache.invalidate(k);
				invalidate(k);
			});
		};

		const onVisibilityChange = (): void => {
			document.hidden ? stop() : start();
		};

		document.addEventListener('visibilitychange', onVisibilityChange);
		start();

		return () => {
			stop();
			document.removeEventListener('visibilitychange', onVisibilityChange);
		};
	});
}
