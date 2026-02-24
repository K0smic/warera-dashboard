import type { PageLoad } from './$types';
import { createGameConfigs } from '$lib/stores/configs.svelte';
import {
	batchFetch
	// getCompany,
	// getProductionBonus,
	// getRegion,
	// getCountry,
	// getWageStats,
	// getUpgradeByTypeAndEntity,
	// getRecommendedRegionIdsByItemCode,
	// getTopOrders,
	// getWorkers
} from '$lib/services';

const configsState = createGameConfigs();

export const load: PageLoad = async ({ fetch, params }) => {
	const concreteCode: string = 'concrete';
	const steelCode: string = 'steel';
	const limit: number = 5;

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
			{ path: 'company.getById', input: { companyId: params.companyId } },
			{ path: 'worker.getWorkers', input: { companyId: params.companyId } },
			{ path: 'company.getProductionBonus', input: { companyId: params.companyId } },
			{
				path: 'upgrade.getUpgradeByTypeAndEntity',
				input: { upgradeType: 'storage', companyId: params.companyId }
			},
			{
				path: 'upgrade.getUpgradeByTypeAndEntity',
				input: { upgradeType: 'automatedEngine', companyId: params.companyId }
			},
			{ path: 'workOffer.getWageStats', input: {} },
			{
				path: 'tradingOrder.getTopOrders',
				input: { itemCode: concreteCode, limit }
			},
			{
				path: 'tradingOrder.getTopOrders',
				input: { itemCode: steelCode, limit }
			}
		],
		fetch
	);
	// await Promise.all([
	// 	getCompany({ companyId: params.companyId }, fetch),
	// 	getWorkers({ companyId: params.companyId }, fetch),
	// 	getProductionBonus({ companyId: params.companyId }, fetch),
	// 	getUpgradeByTypeAndEntity({ upgradeType: 'storage', companyId: params.companyId }, fetch),
	// 	getUpgradeByTypeAndEntity(
	// 		{ upgradeType: 'automatedEngine', companyId: params.companyId },
	// 		fetch
	// 	),
	// 	getWageStats({}, fetch)
	// ]);
	const productionNeedsConfig = configsState.configs.items[company.itemCode].productionNeeds;

	// Get production needs item codes and prepare batch requests
	const productionNeedsKeys = productionNeedsConfig ? Object.keys(productionNeedsConfig) : [];
	const productionNeedsRequests = productionNeedsKeys.map((itemCode) => ({
		path: 'tradingOrder.getTopOrders',
		input: { itemCode, limit }
	}));

	const [availableProductionBonuses, companyOrders, ...productionNeedsOrders] = await batchFetch(
		[
			{
				path: 'company.getRecommendedRegionIdsByItemCode',
				input: { itemCode: company.itemCode }
			},
			{
				path: 'tradingOrder.getTopOrders',
				input: { itemCode: company.itemCode, limit }
			},
			...productionNeedsRequests
		],
		fetch
	);

	// Build production needs data with cost and quantity
	const productionNeeds = productionNeedsKeys.map((itemCode, index) => ({
		itemCode,
		cost: productionNeedsOrders[index]?.sellOrders[0]?.price ?? 0,
		quantity: productionNeedsConfig[itemCode]
	}));

	return {
		company,
		workers: workers.workers,
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
