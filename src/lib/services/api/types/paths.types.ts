import type { operations } from './ops.types';

// Premium required:
// work.getStatsByWorkerAndCompany
// work.getStatsByCompany
// work.getStatsByWorker
// work.getStatsByUserId

export interface paths {
	'/company.getById': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get company by ID
		 * @description Retrieves detailed information about a specific company
		 */
		get: operations['company.getById'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/company.getCompanies': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get companies with pagination
		 * @description Retrieves a paginated list of companies with optional filtering
		 */
		get: operations['company.getCompanies'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/company.getRecommendedRegionIdsByItemCode': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get best company bonuses data
		 * @description Retrieves best possible company region by bonuses
		 */
		get: operations['company.getRecommendedRegionIdsByItemCode'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/country.getCountryById': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get country by ID
		 * @description Retrieves detailed information about a specific country
		 */
		get: operations['country.getCountryById'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/country.getAllCountries': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get all countries
		 * @description Retrieves a list of all available countries
		 */
		get: operations['country.getAllCountries'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/event.getEventsPaginated': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get paginated events
		 * @description Retrieves a paginated list of events with optional country and event type filters
		 */
		get: operations['event.getEventsPaginated'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/government.getByCountryId': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get government by country ID
		 * @description Retrieves government information for a specific country
		 */
		get: operations['government.getByCountryId'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/region.getById': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get region by ID
		 * @description Retrieves detailed information about a specific region
		 */
		get: operations['region.getById'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/region.getRegionsObject': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get all regions
		 * @description Retrieves a complete object containing all available regions
		 */
		get: operations['region.getRegionsObject'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/battle.getById': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get battle by ID
		 * @description Retrieves detailed information about a specific battle
		 */
		get: operations['battle.getById'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/battle.getLiveBattleData': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get live battle data
		 * @description Retrieves real-time battle data including current round information
		 */
		get: operations['battle.getLiveBattleData'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/battle.getBattles': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get battles
		 * @description Retrieves a list of battles
		 */
		get: operations['battle.getBattles'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/round.getById': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get round by ID
		 * @description Retrieves detailed information about a specific battle round
		 */
		get: operations['round.getById'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/round.getLastHits': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get last hits in round
		 * @description Retrieves the most recent hits/damages in a specific battle round
		 */
		get: operations['round.getLastHits'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/battleRanking.getRanking': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get battle rankings
		 * @description Retrieves damage, ground, or money rankings for users or countries in battles, rounds, or wars
		 */
		get: operations['battleRanking.getRanking'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/itemTrading.getPrices': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get item prices
		 * @description Retrieves current market prices for all tradeable items
		 */
		get: operations['itemTrading.getPrices'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/tradingOrder.getTopOrders': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get best orders for an item
		 * @description Retrieves the best orders for an item
		 */
		get: operations['tradingOrder.getTopOrders'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/itemOffer.getById': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get item offer by ID
		 * @description Retrieves detailed information about a specific item offer
		 */
		get: operations['itemOffer.getById'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/workOffer.getById': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get work offer by ID
		 * @description Retrieves detailed information about a specific work offer
		 */
		get: operations['workOffer.getById'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/workOffer.getWageStats': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get wages
		 * @description Retrieves wages stats, not premium
		 */
		get: operations['workOffer.getWageStats'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/workOffer.getWorkOfferByCompanyId': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get work offer by company ID
		 * @description Retrieves work offer for a specific company
		 */
		get: operations['workOffer.getWorkOfferByCompanyId'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/workOffer.getWorkOffersPaginated': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get paginated work offers
		 * @description Retrieves a paginated list of work offers with optional user and region filtering
		 */
		get: operations['workOffer.getWorkOffersPaginated'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/ranking.getRanking': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get ranking data
		 * @description Retrieves ranking data for the specified ranking type and optional year-week filter
		 */
		get: operations['ranking.getRanking'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/search.searchAnything': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Global search
		 * @description Performs a global search across users, countries, regions, military units, parties, and other entities
		 */
		get: operations['search.searchAnything'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/gameConfig.getDates': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get game dates
		 * @description Retrieves game-related dates and timings
		 */
		get: operations['gameConfig.getDates'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/gameConfig.getGameConfig': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get game configuration
		 * @description Retrieves static game configuration
		 */
		get: operations['gameConfig.getGameConfig'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/user.getUserLite': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get user profile (lite)
		 * @description Retrieves basic public information about a user including username, skills, and rankings
		 */
		get: operations['user.getUserLite'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/user.getUsersByCountry': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get users by country
		 * @description Retrieves a list of users by country
		 */
		get: operations['user.getUsersByCountry'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/article.getArticleById': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get article by ID
		 * @description Retrieves detailed information about a specific article
		 */
		get: operations['article.getArticleById'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/article.getArticleLiteById': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get article lite by ID
		 * @description Retrieves only the title and basic stats of an article without counting as a view
		 */
		get: operations['article.getArticleLiteById'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/article.getArticlesPaginated': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get paginated articles
		 * @description Retrieves a paginated list of articles
		 */
		get: operations['article.getArticlesPaginated'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/mu.getById': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get military unit by ID
		 * @description Retrieves detailed information about a specific military unit
		 */
		get: operations['mu.getById'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/mu.getManyPaginated': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get military units (paginated)
		 * @description Retrieves a paginated list of military units with optional filters
		 */
		get: operations['mu.getManyPaginated'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/transaction.getPaginatedTransactions': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get paginated transactions
		 * @description Retrieves a paginated list of transactions
		 */
		get: operations['transaction.getPaginatedTransactions'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/upgrade.getUpgradeByTypeAndEntity': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get upgrade by type and entity
		 * @description Retrieves upgrade information for a specific upgrade type and entity (region, company, or military unit)
		 */
		get: operations['upgrade.getUpgradeByTypeAndEntity'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/worker.getWorkers': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get workers
		 * @description Get workers for a company or user
		 */
		get: operations['worker.getWorkers'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/worker.getTotalWorkersCount': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get total workers count
		 * @description Get total workers count for a user
		 */
		get: operations['worker.getTotalWorkersCount'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/company.getProductionBonus': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get all company bonuses
		 * @description Get all company bonuses
		 */
		get: operations['company.getProductionBonus'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/company.getCompaniesCount': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get total companies count
		 * @description Get total companies count
		 */
		get: operations['company.getCompaniesCount'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
	'/company.getActiveCompaniesCount ': {
		parameters: {
			query?: never;
			header?: never;
			path?: never;
			cookie?: never;
		};
		post?: never;
		put?: never;
		/**
		 * Get total active companies count
		 * @description Get total active companies count
		 */
		get: operations['company.getActiveCompaniesCount'];
		delete?: never;
		options?: never;
		head?: never;
		patch?: never;
		trace?: never;
	};
}
export type webhooks = Record<string, never>;
export type $defs = Record<string, never>;
