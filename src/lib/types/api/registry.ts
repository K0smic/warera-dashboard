import type {
	CompanyResponse,
	CompaniesResponse,
	ProductionBonusResponse,
	UpgradeByTypeResponse,
	WageStatsResponse
} from './schemas/company';

import type {
	RegionResponse,
	AllRegionsResponse,
	RecommendedRegionIdsByItemCodeResponse
} from './schemas/region';

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
type ISODate = string;

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
		input: { userId?: string; orgId?: string } & PaginatedInput;
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
		output: RecommendedRegionIdsByItemCodeResponse;
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
		output: unknown; // expand when schema is available
	};
	'workOffer.getWorkOffersPaginated': {
		input: {
			userId?: string;
			regionId?: string;
			energy?: number;
			production?: number;
			citizenship?: string;
		} & PaginatedInput;
		output: unknown; // expand when schema is available
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
		output: unknown; // expand when schema is available
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
		output: unknown; // expand when schema is available
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
		output: unknown; // expand when schema is available
	};
	'battle.getLiveBattleData': {
		input: { battleId: string; roundNumber?: number };
		output: unknown; // expand when schema is available
	};

	// --- Game config ---
	'gameConfig.getGameConfig': {
		input: Record<string, never>;
		output: GameConfigResponse;
	};
	'gameConfig.getDates': {
		input: Record<string, never>;
		output: unknown; // expand when schema is available
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
		output: unknown; // expand when schema is available
	};

	// --- Articles ---
	'article.getArticleById': {
		input: { articleId: string };
		output: unknown; // expand when schema is available
	};
	'article.getArticlesPaginated': {
		input: {
			type: 'daily' | 'weekly' | 'top' | 'my' | 'subscriptions' | 'last';
			userId?: string;
			categories?: string[];
			languages?: string[];
		} & PaginatedInput;
		output: unknown; // expand when schema is available
	};

	// --- Search ---
	'search.searchAnything': {
		input: { searchText: string };
		output: unknown; // expand when schema is available
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
		output: unknown; // expand when schema is available
	};
	'mu.getManyPaginated': {
		input: {
			memberId?: string;
			userId?: string;
			orgId?: string;
			search?: string;
		} & PaginatedInput;
		output: unknown; // expand when schema is available
	};

	// --- Transactions ---
	'transaction.getPaginatedTransactions': {
		input: {
			userId?: string;
			muId?: string;
			countryId?: string;
			partyId?: string;
			itemCode?: string;
			transactionType?:
				| 'applicationFee'
				| 'trading'
				| 'itemMarket'
				| 'wage'
				| 'donation'
				| 'articleTip'
				| 'openCase'
				| 'craftItem'
				| 'dismantleItem'
				| Array<
						| 'applicationFee'
						| 'trading'
						| 'itemMarket'
						| 'wage'
						| 'donation'
						| 'articleTip'
						| 'openCase'
						| 'craftItem'
						| 'dismantleItem'
				  >;
		} & PaginatedInput;
		output: unknown; // expand when schema is available
	};
}

// ---------------------------------------------------------------------------
// Utility types (use these everywhere in services/)
// ---------------------------------------------------------------------------

/** All valid endpoint paths */
export type EndpointPath = keyof ApiRegistry;

/** Input type for a given endpoint */
export type EndpointInput<P extends EndpointPath> = ApiRegistry[P]['input'];

/** Output type for a given endpoint */
export type EndpointOutput<P extends EndpointPath> = ApiRegistry[P]['output'];

/**
 * Infers the output tuple for a batchFetch call from an array of endpoint paths.
 *
 * @example
 * type Result = BatchOutput<['company.getById', 'region.getById']>
 * // → [CompanyResponse, RegionResponse]
 */
export type BatchOutput<Paths extends readonly EndpointPath[]> = {
	[K in keyof Paths]: Paths[K] extends EndpointPath ? EndpointOutput<Paths[K]> : never;
};
