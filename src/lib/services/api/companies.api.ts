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

export function getCompaniesId(
	input: RequestBody<'/company.getCompanies'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch<RequestBody<'/company.getCompanies'>, responses['schemas']['CompaniesResponse']>(
		'company.getCompanies',
		input,
		fetchFn
	);
}

export function getCompany(input: RequestBody<'/company.getById'>, fetchFn: typeof fetch = fetch) {
	return trpcFetch<RequestBody<'/company.getById'>, responses['schemas']['CompanyResponse']>(
		'company.getById',
		input,
		fetchFn
	);
}

export function getProductionBonus(
	input: RequestBody<'/company.getProductionBonus'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch<
		RequestBody<'/company.getProductionBonus'>,
		responses['schemas']['ProductionBonus']
	>('company.getProductionBonus', input, fetchFn);
}

export function getWageStats(
	input: RequestBody<'/workOffer.getWageStats'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch<RequestBody<'/workOffer.getWageStats'>, responses['schemas']['WageStats']>(
		'workOffer.getWageStats',
		input,
		fetchFn
	);
}

export function getUpgradeByTypeAndEntity(
	input: RequestBody<'/upgrade.getUpgradeByTypeAndEntity'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch<
		RequestBody<'/upgrade.getUpgradeByTypeAndEntity'>,
		responses['schemas']['UpgradeByType']
	>('upgrade.getUpgradeByTypeAndEntity', input, fetchFn);
}

export function getRecommendedRegionIdsByItemCode(
	input: RequestBody<'/company.getRecommendedRegionIdsByItemCode'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch<
		RequestBody<'/company.getRecommendedRegionIdsByItemCode'>,
		responses['schemas']['ProductionBonuses']
	>('company.getRecommendedRegionIdsByItemCode', input, fetchFn);
}

export function getWorkers(
	input: RequestBody<'/worker.getWorkers'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch<
		RequestBody<'/worker.getWorkers'>,
		responses['schemas']['WorkersByCompany'] | responses['schemas']['WorkersByUser']
	>('worker.getWorkers', input, fetchFn);
}
