import type {
	CompanyResponse,
	CompaniesResponse,
	ProductionBonusResponse,
	UpgradeByTypeResponse,
	WageStatsResponse
} from './schemas/company';

import type { RegionResponse, AllRegionsResponse, RegionData } from './schemas/region';

import type { WorkersByCompanyResponse, WorkersByUserResponse } from './schemas/worker';
import type { CountryResponse, AllCountriesResponse } from './schemas/country';

import type { UserLiteResponse } from './schemas/user';
import type { GameConfigResponse } from './schemas/gameConfig';
import type { TopOrdersResponse } from './schemas/market';
import type { RankingEntry } from './schemas/ranking';

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------

type Cursor = string;

type PaginatedInput = {
	cursor?: Cursor;
	limit?: number;
};

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

/**
 * Central map of every tRPC endpoint to its typed input and output.
 *
 * Usage:
 *   EndpointInput<'company.getById'>   → { companyId: string }
 *   EndpointOutput<'company.getById'>  → CompanyResponse
 */
export interface ApiRegistry {
	// --- Company ---
	'company.getById': {
		input: { companyId: string };
		output: CompanyResponse;
	};
	'company.getCompanies': {
		input: {
			userId?: string;
			orgId?: string;
			perPage?: number;
			direction?: string;
		} & PaginatedInput;
		output: CompaniesResponse;
	};
	'company.getProductionBonus': {
		input: { companyId: string };
		output: ProductionBonusResponse;
	};
	'company.getCompaniesCount': {
		input: { companyId: string };
		output: number;
	};
	'company.getActiveCompaniesCount': {
		input: { companyId: string };
		output: number;
	};
	'company.getRecommendedRegionIdsByItemCode': {
		input: { itemCode: string };
		/**
		 * tRPC unwraps the response envelope — the actual value is the array,
		 * not the `{ data: RegionData[] }` wrapper.
		 */
		output: RegionData[];
	};

	// --- Region ---
	'region.getById': {
		input: { regionId: string };
		output: RegionResponse;
	};
	'region.getRegionsObject': {
		input: Record<string, never>;
		output: AllRegionsResponse;
	};

	// --- Country ---
	'country.getCountryById': {
		input: { countryId: string };
		output: CountryResponse;
	};
	'country.getAllCountries': {
		input: Record<string, never>;
		output: AllCountriesResponse;
	};

	// --- User ---
	'user.getUserLite': {
		input: { userId: string };
		output: UserLiteResponse;
	};
	'user.getUsersByCountry': {
		input: { countryId: string } & PaginatedInput;
		output: UserLiteResponse[];
	};

	// --- Work offers ---
	'workOffer.getWageStats': {
		input: Record<string, never>;
		output: WageStatsResponse;
	};
	'workOffer.getWorkOfferByCompanyId': {
		input: { companyId: string };
		output: unknown;
	};
	'workOffer.getWorkOffersPaginated': {
		input: {
			userId?: string;
			regionId?: string;
			energy?: number;
			production?: number;
			citizenship?: string;
		} & PaginatedInput;
		output: unknown;
	};

	// --- Workers ---
	'worker.getWorkers': {
		input: { companyId: string } | { userId: string };
		output: WorkersByCompanyResponse | WorkersByUserResponse;
	};
	'worker.getTotalWorkersCount': {
		input: { userId: string };
		output: number;
	};

	// --- Trading ---
	'tradingOrder.getTopOrders': {
		input: { itemCode: string; limit?: number };
		output: TopOrdersResponse;
	};
	'itemTrading.getPrices': {
		input: Record<string, never>;
		output: unknown;
	};

	// --- Ranking ---
	'ranking.getRanking': {
		input: {
			rankingType:
				| 'weeklyCountryDamages'
				| 'weeklyCountryDamagesPerCitizen'
				| 'countryRegionDiff'
				| 'countryDevelopment'
				| 'countryActivePopulation'
				| 'countryDamages'
				| 'countryWealth'
				| 'countryProductionBonus'
				| 'countryBounty'
				| 'weeklyUserDamages'
				| 'userDamages'
				| 'userWealth'
				| 'userLevel'
				| 'userReferrals'
				| 'userSubscribers'
				| 'userTerrain'
				| 'userPremiumMonths'
				| 'userPremiumGifts'
				| 'userCasesOpened'
				| 'userGemsPurchased'
				| 'userBounty'
				| 'muWeeklyDamages'
				| 'muDamages'
				| 'muTerrain'
				| 'muWealth'
				| 'muBounty';
		};
		output: RankingEntry[];
	};

	// --- Battle ---
	'battle.getById': {
		input: { battleId: string };
		output: unknown;
	};
	'battle.getBattles': {
		input: {
			isActive?: boolean;
			direction?: 'forward' | 'backward';
			filter?: 'all' | 'yourCountry' | 'yourEnemies';
			defenderRegionId?: string;
			warId?: string;
			countryId?: string;
		} & PaginatedInput;
		output: unknown;
	};
	'battle.getLiveBattleData': {
		input: { battleId: string; roundNumber?: number };
		output: unknown;
	};

	// --- Game config ---
	'gameConfig.getGameConfig': {
		input: Record<string, never>;
		output: GameConfigResponse;
	};
	'gameConfig.getDates': {
		input: Record<string, never>;
		output: unknown;
	};

	// --- Events ---
	'event.getEventsPaginated': {
		input: {
			countryId?: string;
			eventTypes?: Array<
				| 'warDeclared'
				| 'peace_agreement'
				| 'battleOpened'
				| 'battleEnded'
				| 'newPresident'
				| 'regionTransfer'
				| 'peaceMade'
				| 'countryMoneyTransfer'
				| 'depositDiscovered'
				| 'depositDepleted'
				| 'systemRevolt'
				| 'bankruptcy'
				| 'allianceFormed'
				| 'allianceBroken'
				| 'regionLiberated'
				| 'strategicResourcesReshuffled'
				| 'resistanceIncreased'
				| 'resistanceDecreased'
				| 'revolutionStarted'
				| 'revolutionEnded'
				| 'financedRevolt'
			>;
		} & PaginatedInput;
		output: unknown;
	};

	// --- Articles ---
	'article.getArticleById': {
		input: { articleId: string };
		output: unknown;
	};
	'article.getArticlesPaginated': {
		input: {
			type: 'daily' | 'weekly' | 'top' | 'my' | 'subscriptions' | 'last';
			userId?: string;
			categories?: string[];
			languages?: string[];
		} & PaginatedInput;
		output: unknown;
	};

	// --- Search ---
	'search.searchAnything': {
		input: { searchText: string };
		output: unknown;
	};

	// --- Upgrade ---
	'upgrade.getUpgradeByTypeAndEntity': {
		input: {
			upgradeType:
				| 'bunker'
				| 'base'
				| 'pacificationCenter'
				| 'storage'
				| 'automatedEngine'
				| 'breakRoom'
				| 'headquarters'
				| 'dormitories';
			regionId?: string;
			companyId?: string;
			muId?: string;
		};
		output: UpgradeByTypeResponse;
	};

	// --- Military units ---
	'mu.getById': {
		input: { muId: string };
		output: unknown;
	};
	'mu.getManyPaginated': {
		input: {
			memberId?: string;
			userId?: string;
			orgId?: string;
			search?: string;
		} & PaginatedInput;
		output: unknown;
	};

	// --- Transactions ---
	'transaction.getPaginatedTransactions': {
		input: {
			userId?: string;
			muId?: string;
			countryId?: string;
			partyId?: string;
			itemCode?: string;
		} & PaginatedInput;
		output: unknown;
	};
}

// ---------------------------------------------------------------------------
// Utility types
// ---------------------------------------------------------------------------

export type EndpointPath = keyof ApiRegistry;
export type EndpointInput<P extends EndpointPath> = ApiRegistry[P]['input'];
export type EndpointOutput<P extends EndpointPath> = ApiRegistry[P]['output'];

export type BatchRequest<P extends EndpointPath> = {
	path: P;
	input: EndpointInput<P>;
};

export type BatchResult<Requests extends ReadonlyArray<BatchRequest<EndpointPath>>> = BatchOutput<{
	[K in keyof Requests]: Requests[K]['path'];
}>;

export type BatchOutput<Paths extends ReadonlyArray<EndpointPath>> = {
	[K in keyof Paths]: Paths[K] extends EndpointPath ? EndpointOutput<Paths[K]> : never;
};
