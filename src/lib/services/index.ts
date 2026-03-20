// Client base
export { trpcFetch, ApiError } from './api/client';
export { batchFetch } from './api/batch.api';

// User API
export { getUserLite, getUsersByCountry } from './api/user.api';
export {
	getCompaniesId,
	getCompany,
	getProductionBonus,
	getWageStats,
	getUpgradeByTypeAndEntity,
	getRecommendedRegionIdsByItemCode,
	getWorkers
} from './api/companies.api';
export { getCountries, getCountry, getRegions, getRegion } from './api/countries.api';
export { getGameConfig } from './api/configs.api';
export { getTopOrders } from './api/trading.api';

export { usePolling } from './api/utils/use-polling.svelte';
