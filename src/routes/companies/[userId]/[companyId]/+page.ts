import type { PageLoad } from './$types';
import {
	getCompany,
	getRegion,
	getCountry,
	getWageStats,
	getUpgradeByTypeAndEntity,
	getRecommendedRegionIdsByItemCode,
	getTopOrders
} from '$lib/services';
import { getProductionBonus } from '$lib/services';

export const load: PageLoad = async ({ fetch, params }) => {
	const concreteCode: string = 'concrete';
	const steelCode: string = 'steel';
	const limit: number = 5;

	const [company, activeProductionBonus, storageUpgrade, engineUpgrade, wageStats] =
		await Promise.all([
			getCompany({ companyId: params.companyId }, fetch),
			getProductionBonus({ companyId: params.companyId }, fetch),
			getUpgradeByTypeAndEntity({ upgradeType: 'storage', companyId: params.companyId }, fetch),
			getUpgradeByTypeAndEntity(
				{ upgradeType: 'automatedEngine', companyId: params.companyId },
				fetch
			),
			getWageStats({}, fetch)
		]);
	const [availableProductionBonuses, concreteOrders, steelOrders, companyOrders] =
		await Promise.all([
			await getRecommendedRegionIdsByItemCode({ itemCode: company.itemCode }, fetch),
			await getTopOrders({ itemCode: concreteCode, limit }, fetch),
			await getTopOrders({ itemCode: steelCode, limit }, fetch),
			await getTopOrders({ itemCode: company.itemCode, limit }, fetch)
		]);

	return {
		company,
		activeProductionBonus,
		availableProductionBonuses,
		storageUpgrade,
		engineUpgrade,
		wageStats,
		concreteOrders,
		steelOrders,
		companyOrders
	};
};
