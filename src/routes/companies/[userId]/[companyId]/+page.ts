import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';
import type { EndpointInput } from '$lib/types/api/registry';
import type { UserLiteResponse, TopOrdersResponse } from '$lib/types/api/schemas';
import { isProductItem } from '$lib/types/api/schemas';

import { batchFetch, ApiError } from '$lib/services';
import { configsState } from '$lib/stores/configs.svelte';
import { queryCache } from '$lib/stores/cache.svelte';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CONCRETE = 'concrete';
const STEEL = 'steel';
const TOP_ORDERS_LIMIT = 5;
const CACHE_TTL_MS = 30000;

// ---------------------------------------------------------------------------
// Local types
// ---------------------------------------------------------------------------

type TopOrdersRequest = {
	path: 'tradingOrder.getTopOrders';
	input: EndpointInput<'tradingOrder.getTopOrders'>;
};

type UserLiteRequest = {
	path: 'user.getUserLite';
	input: EndpointInput<'user.getUserLite'>;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const ssr = false;
export const prerender = false;

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------

export const load: PageLoad = async ({ fetch, params, depends }) => {
	const { companyId } = params;

	const cacheKey = `company-dashboard:${companyId}`;
	depends(cacheKey);

	if (!queryCache.isStale(cacheKey)) {
		const cached = queryCache.get(cacheKey);
		if (cached) return cached;
	}

	const controller = new AbortController();

	try {
		// ── First batch: company core data ───────────────────────────────────
		const [
			company,
			workers,
			activeProductionBonus,
			storageUpgrade,
			engineUpgrade,
			wageStats,
			concreteOrders,
			steelOrders
		] = await batchFetch(
			[
				{ path: 'company.getById', input: { companyId } },
				{ path: 'worker.getWorkers', input: { companyId } },
				{ path: 'company.getProductionBonus', input: { companyId } },
				{
					path: 'upgrade.getUpgradeByTypeAndEntity',
					input: { upgradeType: 'storage', companyId }
				},
				{
					path: 'upgrade.getUpgradeByTypeAndEntity',
					input: { upgradeType: 'automatedEngine', companyId }
				},
				{ path: 'workOffer.getWageStats', input: {} },
				{
					path: 'tradingOrder.getTopOrders',
					input: { itemCode: CONCRETE, limit: TOP_ORDERS_LIMIT }
				},
				{ path: 'tradingOrder.getTopOrders', input: { itemCode: STEEL, limit: TOP_ORDERS_LIMIT } }
			] as const,
			fetch,
			controller.signal
		);

		if (workers.type !== 'company') {
			error(500, 'Unexpected workers response type');
		}

		// ── Production needs config ──────────────────────────────────────────
		const item = configsState.configs?.items[company.itemCode];
		const productionNeedsConfig = item && isProductItem(item) ? item.productionNeeds : {};
		const productionNeedsKeys = productionNeedsConfig ? Object.keys(productionNeedsConfig) : [];

		// ── Second batch: per-worker users + per-production-need orders ──────
		const workerUserRequests: UserLiteRequest[] = workers.workers.map(({ user }) => ({
			path: 'user.getUserLite',
			input: { userId: user }
		}));

		const productionNeedsRequests: TopOrdersRequest[] = productionNeedsKeys.map((itemCode) => ({
			path: 'tradingOrder.getTopOrders',
			input: { itemCode, limit: TOP_ORDERS_LIMIT }
		}));

		const [availableProductionBonuses, companyOrders, ...rest] = await batchFetch(
			[
				{
					path: 'company.getRecommendedRegionIdsByItemCode',
					input: { itemCode: company.itemCode }
				},
				{
					path: 'tradingOrder.getTopOrders',
					input: { itemCode: company.itemCode, limit: TOP_ORDERS_LIMIT }
				},
				...workerUserRequests,
				...productionNeedsRequests
			],
			fetch,
			controller.signal
		);

		// ── Merge rest: [workerUsers..., productionNeedsOrders...] ───────────
		const workerUsers = rest.slice(0, workerUserRequests.length) as UserLiteResponse[];
		const productionNeedsOrders = rest.slice(workerUserRequests.length) as TopOrdersResponse[];

		const workersWithData = workers.workers.map((worker, i) => ({
			...worker,
			userData: workerUsers[i]
		}));

		const productionNeeds = productionNeedsKeys.map((itemCode, i) => ({
			itemCode,
			quantity: productionNeedsConfig ? productionNeedsConfig[itemCode] : {},
			buy: productionNeedsOrders[i]?.buyOrders[0]?.price ?? 0,
			sell: productionNeedsOrders[i]?.sellOrders[0]?.price ?? 0
		}));

		// ── Cache and return ─────────────────────────────────────────────────
		const result = {
			company,
			workers: workersWithData,
			activeProductionBonus,
			availableProductionBonuses,
			storageUpgrade,
			engineUpgrade,
			wageStats,
			concreteOrders,
			steelOrders,
			companyOrders,
			productionNeeds
		};

		queryCache.set(cacheKey, result, CACHE_TTL_MS);

		return result;
	} catch (e) {
		if (e instanceof DOMException && e.name === 'AbortError') {
			return queryCache.get(cacheKey) ?? error(503, 'Request cancelled');
		}

		if (e instanceof ApiError) {
			error(e.status === 404 ? 404 : 500, e.message);
		}

		throw e;
	}
};
