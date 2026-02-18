import type { PageLoad } from './$types';
import {
	getCompany,
	getRegion,
	getCountry,
	getWageStats,
	getUpgradeByTypeAndEntity,
	getRecommendedRegionIdsByItemCode
} from '$lib/services';
import { getProductionBonus } from '$lib/services';

export const load: PageLoad = async ({ fetch, params }) => {
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
	const availableProductionBonuses = await getRecommendedRegionIdsByItemCode(
		{ itemCode: company.itemCode },
		fetch
	);

	return {
		company,
		activeProductionBonus,
		availableProductionBonuses,
		storageUpgrade,
		engineUpgrade,
		wageStats
	};
};
