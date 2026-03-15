import type { LayoutLoad } from './$types';

export const prerender = true;
export const ssr = false;

import { configsState } from '$lib/stores/configs.svelte';
import { countriesState, regionsState } from '$lib/stores/countries.svelte';

export const load: LayoutLoad = async ({ fetch }) => {
	const promises = [];
	if (!configsState.configs) promises.push(configsState.loadConfigs(fetch));
	if (!countriesState.countries) promises.push(countriesState.loadCountries(fetch));
	if (!regionsState.regions) promises.push(regionsState.loadRegions(fetch));
	await Promise.all(promises);

	return;
};
