import type { paths, responses } from '$lib/services/index';
import { trpcFetch } from './client';
/* =======================
 * Helpers
 * ======================= */

type RequestBody<P extends keyof paths> = NonNullable<
	paths[P]['post']['requestBody']
>['content']['application/json'];

/* =======================
 * User endpoints
 * ======================= */

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
