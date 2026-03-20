import { error } from '@sveltejs/kit';

import type { LayoutLoad } from './$types';

import { configsState } from '$lib/stores/configs.svelte';
import { countriesState, regionsState } from '$lib/stores/countries.svelte';
import { queryCache } from '$lib/stores/cache.svelte';
import { ApiError } from '$lib/services';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// Config and geo data changes very rarely — 5 minutes is a safe TTL.
// On hard refresh the cache is empty and all three are fetched in parallel.
const LAYOUT_CACHE_TTL_MS = 5 * 60000;

const CACHE_KEY_CONFIGS = 'layout:configs';
const CACHE_KEY_COUNTRIES = 'layout:countries';
const CACHE_KEY_REGIONS = 'layout:regions';

export const prerender = true;
export const ssr = false;

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------

export const load: LayoutLoad = async ({ fetch, depends }) => {
	// Registering these keys allows any child route to call
	// invalidate('layout:configs') etc. to force a refresh if needed.
	depends(CACHE_KEY_CONFIGS);
	depends(CACHE_KEY_COUNTRIES);
	depends(CACHE_KEY_REGIONS);

	const promises: Promise<void>[] = [];

	// Each resource is loaded only when its store is empty OR its cache entry
	// has gone stale. The store-level guard (`!configsState.configs`) handles
	// the in-memory case; the cache TTL handles the time-based staleness case.
	if (!configsState.configs || queryCache.isStale(CACHE_KEY_CONFIGS)) {
		promises.push(
			configsState.loadConfigs(fetch).then(() => {
				queryCache.set(CACHE_KEY_CONFIGS, true, LAYOUT_CACHE_TTL_MS);
			})
		);
	}

	if (!countriesState.countries || queryCache.isStale(CACHE_KEY_COUNTRIES)) {
		promises.push(
			countriesState.loadCountries(fetch).then(() => {
				queryCache.set(CACHE_KEY_COUNTRIES, true, LAYOUT_CACHE_TTL_MS);
			})
		);
	}

	if (!regionsState.regions || queryCache.isStale(CACHE_KEY_REGIONS)) {
		promises.push(
			regionsState.loadRegions(fetch).then(() => {
				queryCache.set(CACHE_KEY_REGIONS, true, LAYOUT_CACHE_TTL_MS);
			})
		);
	}

	try {
		await Promise.all(promises);
	} catch (e) {
		if (e instanceof ApiError) {
			error(e.status === 404 ? 404 : 500, e.message);
		}
		throw e;
	}

	return;
};
