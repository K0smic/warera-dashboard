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

export function getCompanies(input: RequestBody<'/company.getCompanies'>) {
	return trpcFetch<
		RequestBody<'/company.getCompanies'>,
		paths['/company.getCompanies']['post']['responses']['200']
	>('company.getCompanies', input);
}
