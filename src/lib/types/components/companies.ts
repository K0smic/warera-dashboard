import type {
	CompanyResponse,
	ProductionBonusResponse,
	RegionData,
	GameConfigProdItemsMap
} from '../api/schemas';

export type CompanyWithBonus = CompanyResponse & { productionBonus: ProductionBonusResponse };

export type bestBonusRegions = {
	[K in keyof GameConfigProdItemsMap]: RegionData[];
};
