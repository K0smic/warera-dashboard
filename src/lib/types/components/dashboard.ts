import type { WorkerData } from '$lib/types/api/schemas/worker';
import type { UserLiteResponse } from '$lib/types/api/schemas/user';
import type {
	CompanyResponse,
	ProductionBonusResponse,
	UpgradeByTypeResponse,
	WageStatsResponse
} from '$lib/types/api/schemas/company';
import type { TopOrdersResponse } from '$lib/types/api/schemas/market';
import type { RegionData } from '$lib/types/api/schemas/region';

// ---------------------------------------------------------------------------
// Display helpers
// ---------------------------------------------------------------------------

/** A labelled bonus row for the performance card. */
export interface BonusLabel {
	label: string;
	value: number;
}

/** Formatted time window for the active region deposit. */
export interface DepositInfo {
	startsAt: string | null;
	endsAt: string | null;
}

// ---------------------------------------------------------------------------
// Production
// ---------------------------------------------------------------------------

/** A production-input requirement with its current market prices. */
export interface ProductionNeed {
	itemCode: string;
	quantity: number;
	/** Best buy-order price at load time. */
	buy: number;
	/** Best sell-order price at load time. */
	sell: number;
}

// ---------------------------------------------------------------------------
// Workers
// ---------------------------------------------------------------------------

/** Worker record enriched with the resolved user profile. */
export type WorkerWithUserData = WorkerData & {
	userData: UserLiteResponse;
};

// ---------------------------------------------------------------------------
// Page data
// ---------------------------------------------------------------------------

/**
 * Shape of the data object returned by the company-dashboard route load
 * function (`src/routes/companies/[userId]/[companyId]/+page.ts`).
 *
 * Used to type the `data` prop of the `CompanyDashboard` organism so that
 * the organism is decoupled from SvelteKit's auto-generated `$types`.
 */
export interface CompanyDashboardData {
	company: CompanyResponse;
	workers: WorkerWithUserData[];
	activeProductionBonus: ProductionBonusResponse;
	/** Sorted list of recommended regions with their production bonuses for the company's item. */
	availableProductionBonuses: RegionData[];
	storageUpgrade: UpgradeByTypeResponse;
	engineUpgrade: UpgradeByTypeResponse;
	wageStats: WageStatsResponse;
	concreteOrders: TopOrdersResponse;
	steelOrders: TopOrdersResponse;
	companyOrders: TopOrdersResponse;
	productionNeeds: ProductionNeed[];
}
