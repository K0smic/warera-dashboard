import type { PageLoad } from './$types';
import type { EndpointInput } from '$lib/types/api/registry';
import type { UserLiteResponse } from '$lib/types/api/schemas';
import type { TopOrdersResponse } from '$lib/types/api/schemas';
import { error } from '@sveltejs/kit';
import { configsState } from '$lib/stores/configs.svelte';
import { batchFetch } from '$lib/services';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CONCRETE = 'concrete';
const STEEL = 'steel';
const TOP_ORDERS_LIMIT = 5;

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
// Load
// ---------------------------------------------------------------------------

export const load: PageLoad = async ({ fetch, params }) => {
	const { companyId } = params;

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
			{ path: 'upgrade.getUpgradeByTypeAndEntity', input: { upgradeType: 'storage', companyId } },
			{
				path: 'upgrade.getUpgradeByTypeAndEntity',
				input: { upgradeType: 'automatedEngine', companyId }
			},
			{ path: 'workOffer.getWageStats', input: {} },
			{ path: 'tradingOrder.getTopOrders', input: { itemCode: CONCRETE, limit: TOP_ORDERS_LIMIT } },
			{ path: 'tradingOrder.getTopOrders', input: { itemCode: STEEL, limit: TOP_ORDERS_LIMIT } }
		] as const,
		fetch
	);

	if (workers.type !== 'company') {
		error(500, 'Unexpected workers response type');
	}

	// --- Production needs ---

	const productionNeedsConfig = configsState.configs.items[company.itemCode]?.productionNeeds ?? {};
	const productionNeedsKeys = Object.keys(productionNeedsConfig);

	// --- Second batch: per-worker users + per-production-need orders ---

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
			{ path: 'company.getRecommendedRegionIdsByItemCode', input: { itemCode: company.itemCode } },
			{
				path: 'tradingOrder.getTopOrders',
				input: { itemCode: company.itemCode, limit: TOP_ORDERS_LIMIT }
			},
			...workerUserRequests,
			...productionNeedsRequests
		],
		fetch
	);

	// `rest` layout: [workerUsers..., productionNeedsOrders...]
	const workerUsers = rest.slice(0, workerUserRequests.length) as UserLiteResponse[];
	const productionNeedsOrders = rest.slice(workerUserRequests.length) as TopOrdersResponse[];

	const workersWithData = workers.workers.map((worker, i) => ({
		...worker,
		userData: workerUsers[i]
	}));

	const productionNeeds = productionNeedsKeys.map((itemCode, i) => ({
		itemCode,
		quantity: productionNeedsConfig[itemCode],
		buy: productionNeedsOrders[i]?.buyOrders[0]?.price ?? 0,
		sell: productionNeedsOrders[i]?.sellOrders[0]?.price ?? 0
	}));

	return {
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
};
