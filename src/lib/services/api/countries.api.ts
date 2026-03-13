import { trpcFetch } from './client';
import type { EndpointInput } from '$lib/types/api/registry';

/* =======================
 * User endpoints
 * ======================= */

export function getCountries(
	input: EndpointInput<'country.getAllCountries'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch('country.getAllCountries', input, fetchFn);
}

export function getRegions(
	input: EndpointInput<'region.getRegionsObject'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch('region.getRegionsObject', input, fetchFn);
}

export function getCountry(
	input: EndpointInput<'country.getCountryById'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch('country.getCountryById', input, fetchFn);
}

export function getRegion(input: EndpointInput<'region.getById'>, fetchFn: typeof fetch = fetch) {
	return trpcFetch('region.getById', input, fetchFn);
}
