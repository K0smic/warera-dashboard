// src/lib/api/user.api.ts
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

export function getUserLite(
	input: RequestBody<'/user.getUserLite'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch<RequestBody<'/user.getUserLite'>, responses['schemas']['UserLite']>(
		'user.getUserLite',
		input,
		fetchFn
	);
}

export function getUsersByCountry(
	input: RequestBody<'/user.getUsersByCountry'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch<
		RequestBody<'/user.getUsersByCountry'>,
		paths['/user.getUsersByCountry']['post']['responses']['200']
	>('user.getUsersByCountry', input, fetchFn);
}
