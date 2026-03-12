import type { responses } from './responses';

export interface operations {
	'company.getById': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/** @description The unique identifier of the company */
					companyId: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					'application/json': responses['schemas']['CompanyResponse'];
				};
			};
		};
	};
	'company.getRecommendedRegionIdsByItemCode': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/** @description The item code */
					itemCode: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					'application/json': responses['schemas']['RecommendedRegionIdsByItemCodeResponse'];
				};
			};
		};
	};
	'company.getProductionBonus': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/** @description The unique identifier of the company */
					companyId: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					'application/json': responses['schemas']['ProductionBonusResponse'];
				};
			};
		};
	};
	'company.getCompaniesCount': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/** @description The unique identifier of the company */
					companyId: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					'application/json': number;
				};
			};
		};
	};
	'company.getActiveCompaniesCount': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/** @description The unique identifier of the company */
					companyId: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					'application/json': number;
				};
			};
		};
	};
	'company.getCompanies': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/** @description Filter companies by user ID */
					userId?: string;
					/** @description Filter companies by organization ID */
					orgId?: string;
					/**
					 * @description Number of companies per page (1-100)
					 * @default 10
					 */
					perPage?: number;
					/** @description Pagination cursor for next page */
					cursor?: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					'application/json': responses['schemas']['CompaniesResponse'];
				};
			};
		};
	};
	'country.getCountryById': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/** @description The unique identifier of the country */
					countryId: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					'application/json': responses['schemas']['CountryResponse'];
				};
			};
		};
	};
	'country.getAllCountries': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': responses['schemas']['AllCountriesResponse'];
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'event.getEventsPaginated': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/**
					 * @description The limit of events to get
					 * @default 10
					 */
					limit?: number;
					/** @description The cursor to get the next events */
					cursor?: string;
					/** @description Filter events by country ID */
					countryId?: string;
					/** @description Filter events by event types */
					eventTypes?: (
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
					)[];
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'government.getByCountryId': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/** @description The unique identifier of the country */
					countryId: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'region.getById': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/** @description The unique identifier of the region */
					regionId: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					'application/json': responses['schemas']['RegionResponse'];
				};
			};
		};
	};
	'region.getRegionsObject': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': responses['schemas']['AllRegionsResponse'];
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'battle.getById': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/** @description The unique identifier of the battle */
					battleId: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'battle.getLiveBattleData': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/** @description The unique identifier of the battle */
					battleId: string;
					/** @description Optional specific round number to retrieve */
					roundNumber?: number;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'battle.getBattles': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/** @description Whether to get active battles */
					isActive?: boolean;
					/**
					 * @description The limit of battles to get
					 * @default 10
					 */
					limit?: number;
					/** @description The cursor to get the next battles */
					cursor?: string;
					/**
					 * @description The direction to get the battles
					 * @enum {string}
					 */
					direction?: 'forward' | 'backward';
					/**
					 * @description Filter type for battles
					 * @enum {string}
					 */
					filter?: 'all' | 'yourCountry' | 'yourEnemies';
					/** @description Filter battles by defender region ID */
					defenderRegionId?: string;
					/** @description Filter battles by war ID */
					warId?: string;
					/** @description Filter battles by country ID */
					countryId?: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'round.getById': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/** @description The unique identifier of the round */
					roundId: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'round.getLastHits': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/** @description The unique identifier of the round */
					roundId: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'battleRanking.getRanking': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/** @description Optional battle ID to filter rankings */
					battleId?: string;
					/** @description Optional round ID to filter rankings */
					roundId?: string;
					/** @description Optional war ID to filter rankings */
					warId?: string;
					/**
					 * @description Type of ranking data to retrieve (damage, ground points, or money)
					 * @enum {string}
					 */
					dataType: 'damage' | 'points' | 'money';
					/**
					 * @description Whether to rank by user or country
					 * @enum {string}
					 */
					type: 'user' | 'country' | 'mu';
					/**
					 * @description Which side of the battle to rank
					 * @enum {string}
					 */
					side: 'attacker' | 'defender';
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'itemTrading.getPrices': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': Record<string, never>;
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'tradingOrder.getTopOrders': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/** @description The item code to get orders for */
					itemCode: string;
					/**
					 * @description The limit of orders to get
					 * @default 10
					 */
					limit?: number;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: { 'application/json': responses['schemas']['TopOrdersResponse'] };
			};
		};
	};
	'itemOffer.getById': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					itemOfferId: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'workOffer.getById': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					workOfferId: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'workOffer.getWageStats': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					'application/json': responses['schemas']['WageStatsResponse'];
				};
			};
		};
	};
	'workOffer.getWorkOfferByCompanyId': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					companyId: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'workOffer.getWorkOffersPaginated': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					userId?: string;
					regionId?: string;
					cursor?: string;
					/** @default 10 */
					limit?: number;
					energy?: number;
					production?: number;
					citizenship?: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'ranking.getRanking': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/**
					 * @description The type of ranking to retrieve
					 * @enum {string}
					 */
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
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'search.searchAnything': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/** @description The search query string */
					searchText: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'gameConfig.getDates': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': Record<string, never>;
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'gameConfig.getGameConfig': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': responses['schemas']['GameConfigResponse'];
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'user.getUserLite': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/** @description The unique identifier of the user */
					userId: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					'application/json': responses['schemas']['UserLiteResponse'];
				};
			};
		};
	};
	'user.getUsersByCountry': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					countryId: string;
					/** @default 10 */
					limit?: number;
					cursor?: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'article.getArticleById': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/** @description The ID of the article to get */
					articleId: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'article.getArticleLiteById': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/** @description The ID of the article to get */
					articleId: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'article.getArticlesPaginated': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/**
					 * @description The type of articles to get
					 * @enum {string}
					 */
					type: 'daily' | 'weekly' | 'top' | 'my' | 'subscriptions' | 'last';
					/**
					 * @description The limit of articles to get
					 * @default 10
					 */
					limit?: number;
					cursor?: string;
					/** @description The user ID to get articles for */
					userId?: string;
					/** @description The categories to get articles for */
					categories?: string[];
					/** @description The languages to get articles for */
					languages?: string[];
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'mu.getById': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					muId: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'mu.getManyPaginated': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/** @default 20 */
					limit?: number;
					cursor?: string;
					memberId?: string;
					userId?: string;
					orgId?: string;
					search?: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'transaction.getPaginatedTransactions': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/**
					 * @description The limit of transactions to get
					 * @default 10
					 */
					limit?: number;
					/** @description The cursor to get the next transactions */
					cursor?: string;
					/** @description The user ID to get transactions for */
					userId?: string;
					/** @description The MU ID to get transactions for */
					muId?: string;
					/** @description The country ID to get transactions for */
					countryId?: string;
					/** @description The party ID to get transactions for */
					partyId?: string;
					/** @description The item code to get transactions for */
					itemCode?: string;
					/** @description The type of transactions to get */
					transactionType?:
						| (
								| 'applicationFee'
								| 'trading'
								| 'itemMarket'
								| 'wage'
								| 'donation'
								| 'articleTip'
								| 'openCase'
								| 'craftItem'
								| 'dismantleItem'
						  )
						| (
								| 'applicationFee'
								| 'trading'
								| 'itemMarket'
								| 'wage'
								| 'donation'
								| 'articleTip'
								| 'openCase'
								| 'craftItem'
								| 'dismantleItem'
						  )[];
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'upgrade.getUpgradeByTypeAndEntity': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					/**
					 * @description The upgrade type to get
					 * @enum {string}
					 */
					upgradeType:
						| 'bunker'
						| 'base'
						| 'pacificationCenter'
						| 'storage'
						| 'automatedEngine'
						| 'breakRoom'
						| 'headquarters'
						| 'dormitories';
					/** @description The region ID to get upgrade for */
					regionId?: string;
					/** @description The company ID to get upgrade for */
					companyId?: string;
					/** @description The military unit ID to get upgrade for */
					muId?: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
	'worker.getWorkers': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					companyId?: string;
					userId?: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content: {
					'application/json':
						| responses['schemas']['WorkersByCompanyResponse']
						| responses['schemas']['WorkersByUserResponse'];
				};
			};
		};
	};
	'worker.getTotalWorkersCount': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		requestBody?: {
			content: {
				'application/json': {
					userId: string;
				};
			};
		};
		responses: {
			200: {
				headers: {
					[name: string]: unknown;
				};
				content?: never;
			};
		};
	};
}
