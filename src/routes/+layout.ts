import type { PageLoad } from './$types';

export const prerender = true;
export const ssr = false;

import { configsState } from '$lib/stores/configs.svelte';
import { createCountries } from '$lib/stores/countries.svelte';

const countriesState = createCountries();

export const load: PageLoad = async ({ fetch }: { fetch: typeof globalThis.fetch }) => {
	if (!configsState.configs) {
		await configsState.loadConfigs(fetch);
	}
	if (!countriesState.countries) {
		await countriesState.loadCountries(fetch);
	}
	if (!countriesState.regions) {
		await countriesState.loadRegions(fetch);
	}

	return;
};
