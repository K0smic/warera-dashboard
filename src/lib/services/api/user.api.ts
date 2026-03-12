// src/lib/api/user.api.ts
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

export function getUserLite(
	input: RequestBody<'/user.getUserLite'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch<RequestBody<'/user.getUserLite'>, responses['schemas']['UserLiteResponse']>(
		'user.getUserLite',
		input,
		fetchFn
	);
}

//TODO: add responses['schemas']['UsersByCountryResponse'] type, now is not used
export function getUsersByCountry(
	input: RequestBody<'/user.getUsersByCountry'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch<
		RequestBody<'/user.getUsersByCountry'>,
		paths['/user.getUsersByCountry']['get']['responses']['200']
	>('user.getUsersByCountry', input, fetchFn);
}
