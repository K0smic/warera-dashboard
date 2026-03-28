import { error } from '@sveltejs/kit';
import { batchFetch, ApiError } from '$lib/services';
import { getCompaniesId } from '$lib/services';
import { queryCache } from '$lib/stores/cache.svelte';
import { userState } from '$lib/stores/user.svelte';
import { companiesState } from '$lib/stores/companies.svelte';
import { ITEM_CODES } from '$lib/config/items';
import type { PageLoad } from './$types';
import type { CompanyResponse, ProductionBonusResponse } from '$lib/types/api/schemas';
import type { bestBonusRegions, CompanyWithBonus } from '$lib/types/components/companies';

const CACHE_TTL_MS = 60_000;

export const ssr = false;
export const prerender = false;

interface Result {
	companies: CompanyWithBonus[];
}

export const load: PageLoad = async ({ fetch, params, depends }) => {
	const cacheKey: `${string}:${string}` = `companies:${params.userId}`;
	depends(cacheKey);

	if (!queryCache.isStale(cacheKey)) {
		const cached = queryCache.get(cacheKey);
		if (cached) return cached as Result;
	}

	const controller = new AbortController();

	try {
		const { items: ids } = await getCompaniesId(
			{ userId: params.userId },
			fetch,
			controller.signal
		);

		const n = ids.length;

		const allResults = await batchFetch(
			[
				...ids.map((companyId) => ({
					path: 'company.getById' as const,
					input: { companyId }
				})),
				...ids.map((companyId) => ({
					path: 'company.getProductionBonus' as const,
					input: { companyId }
				}))
			],
			fetch,
			controller.signal
		);

		const companies: CompanyWithBonus[] = (allResults.slice(0, n) as CompanyResponse[]).map(
			(company, i) => ({
				...company,
				productionBonus: allResults[n + i] as ProductionBonusResponse
			})
		);

		const result: Result = { companies };

		queryCache.set(cacheKey, result, CACHE_TTL_MS);

		if (params.userId === userState.user?._id) {
			companiesState.loadCompanies(companies);
		}

		return { ...result };
	} catch (e) {
		if (e instanceof DOMException && e.name === 'AbortError') {
			return queryCache.get<Result>(cacheKey) ?? error(503, 'Request cancelled');
		}
		if (e instanceof ApiError) {
			error(e.status === 404 ? 404 : 500, e.message);
		}
		throw e;
	}
};
