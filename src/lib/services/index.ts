// Client base
export { trpcFetch } from './api/client';

// User API
export { getUserLite, getUsersByCountry } from './api/user.api';
export {
	getCompaniesId,
	getCompany,
	getProductionBonus,
	getWageStats,
	getUpgradeByTypeAndEntity,
	getRecommendedRegionIdsByItemCode
} from './api/companies.api';
export { getCountry, getRegion } from './api/country.api';
export { getGameConfig } from './api/configs.api';

export type * from './api/types/paths.types';
export type * from './api/types/res.types';
export type * from './api/types/ops.types';
