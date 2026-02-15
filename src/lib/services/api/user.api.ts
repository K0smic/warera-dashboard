// src/lib/api/user.api.ts
import type { paths } from '$lib/services/api/types';
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

export function getUserLite(input: RequestBody<'/user.getUserLite'>) {
	return trpcFetch<
		RequestBody<'/user.getUserLite'>,
		paths['/user.getUserLite']['post']['responses']['200']
	>('user.getUserLite', input);
}

export function getUsersByCountry(input: RequestBody<'/user.getUsersByCountry'>) {
	return trpcFetch<
		RequestBody<'/user.getUsersByCountry'>,
		paths['/user.getUsersByCountry']['post']['responses']['200']
	>('user.getUsersByCountry', input);
}
