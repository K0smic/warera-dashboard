import { trpcFetch } from './client';
import type { EndpointInput } from '$lib/types';

/* =======================
 * Company endpoints
 * ======================= */

export function getCompaniesId(
	input: EndpointInput<'company.getCompanies'>,
	fetchFn: typeof fetch = fetch,
	signal?: AbortSignal
) {
	// Add perPage to input
	const defaultedInput = {
		perPage: 12,
		...input
	};

	return trpcFetch('company.getCompanies', defaultedInput, fetchFn, signal);
}

export function getCompany(
	input: EndpointInput<'company.getById'>,
	fetchFn: typeof fetch = fetch,
	signal?: AbortSignal
) {
	return trpcFetch('company.getById', input, fetchFn, signal);
}

export function getProductionBonus(
	input: EndpointInput<'company.getProductionBonus'>,
	fetchFn: typeof fetch = fetch,
	signal?: AbortSignal
) {
	return trpcFetch('company.getProductionBonus', input, fetchFn, signal);
}

export function getRecommendedRegionIdsByItemCode(
	input: EndpointInput<'company.getRecommendedRegionIdsByItemCode'>,
	fetchFn: typeof fetch = fetch,
	signal?: AbortSignal
) {
	return trpcFetch('company.getRecommendedRegionIdsByItemCode', input, fetchFn, signal);
}

/* =======================
 * Work offer endpoints
 * ======================= */

export function getWageStats(
	input: EndpointInput<'workOffer.getWageStats'>,
	fetchFn: typeof fetch = fetch,
	signal?: AbortSignal
) {
	return trpcFetch('workOffer.getWageStats', input, fetchFn, signal);
}

/* =======================
 * Upgrade endpoints
 * ======================= */

export function getUpgradeByTypeAndEntity(
	input: EndpointInput<'upgrade.getUpgradeByTypeAndEntity'>,
	fetchFn: typeof fetch = fetch,
	signal?: AbortSignal
) {
	return trpcFetch('upgrade.getUpgradeByTypeAndEntity', input, fetchFn, signal);
}

/* =======================
 * Worker endpoints
 * ======================= */

export function getWorkers(
	input: EndpointInput<'worker.getWorkers'>,
	fetchFn: typeof fetch = fetch,
	signal?: AbortSignal
) {
	return trpcFetch('worker.getWorkers', input, fetchFn, signal);
}
