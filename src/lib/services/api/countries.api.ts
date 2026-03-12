import type { paths, responses } from '$lib/types';
import { trpcFetch } from './client';
/* =======================
 * Helpers
 * ======================= */

type RequestBody<P extends keyof paths> = NonNullable<
	paths[P]['get']['requestBody']
>['content']['application/json'];

/* =======================
 * User endpoints
 * ======================= */

export function getCountries(
	input: RequestBody<'/country.getAllCountries'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch<
		RequestBody<'/country.getAllCountries'>,
		responses['schemas']['AllCountriesResponse']
	>('country.getAllCountries', input, fetchFn);
}

export function getRegions(
	input: RequestBody<'/region.getRegionsObject'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch<
		RequestBody<'/region.getRegionsObject'>,
		responses['schemas']['AllRegionsResponse']
	>('region.getRegionsObject', input, fetchFn);
}

export function getCountry(
	input: RequestBody<'/country.getCountryById'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch<RequestBody<'/country.getCountryById'>, responses['schemas']['CountryResponse']>(
		'country.getCountryById',
		input,
		fetchFn
	);
}

export function getRegion(input: RequestBody<'/region.getById'>, fetchFn: typeof fetch = fetch) {
	return trpcFetch<RequestBody<'/region.getById'>, responses['schemas']['RegionResponse']>(
		'region.getById',
		input,
		fetchFn
	);
}
