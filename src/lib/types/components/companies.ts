import type {
	CompanyResponse,
	ProductionBonusResponse,
	RegionData,
	GameConfigProdItemsMap
} from '../api/schemas';

export type CompanyWithBonus = CompanyResponse & { productionBonus: ProductionBonusResponse };

export type BestBonusRegions = {
	[K in keyof GameConfigProdItemsMap]: RegionData[];
};
