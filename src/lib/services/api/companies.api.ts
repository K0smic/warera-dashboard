import { trpcFetch } from './client';
import type { EndpointInput } from '$lib/types';

/* =======================
 * Company endpoints
 * ======================= */

export function getCompaniesId(
	input: EndpointInput<'company.getCompanies'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch('company.getCompanies', input, fetchFn);
}

export function getCompany(input: EndpointInput<'company.getById'>, fetchFn: typeof fetch = fetch) {
	return trpcFetch('company.getById', input, fetchFn);
}

export function getProductionBonus(
	input: EndpointInput<'company.getProductionBonus'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch('company.getProductionBonus', input, fetchFn);
}

export function getRecommendedRegionIdsByItemCode(
	input: EndpointInput<'company.getRecommendedRegionIdsByItemCode'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch('company.getRecommendedRegionIdsByItemCode', input, fetchFn);
}

/* =======================
 * Work offer endpoints
 * ======================= */

export function getWageStats(
	input: EndpointInput<'workOffer.getWageStats'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch('workOffer.getWageStats', input, fetchFn);
}

/* =======================
 * Upgrade endpoints
 * ======================= */

export function getUpgradeByTypeAndEntity(
	input: EndpointInput<'upgrade.getUpgradeByTypeAndEntity'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch('upgrade.getUpgradeByTypeAndEntity', input, fetchFn);
}

/* =======================
 * Worker endpoints
 * ======================= */

export function getWorkers(
	input: EndpointInput<'worker.getWorkers'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch('worker.getWorkers', input, fetchFn);
}
