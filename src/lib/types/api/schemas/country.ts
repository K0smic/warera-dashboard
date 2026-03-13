import type { RankingEntry } from './ranking';

export interface CountryTaxes {
	income: number;
	market: number;
	selfWork: number;
}

export interface CountryUnrest {
	barMax: number;
	bar: number;
	lastContributionAt?: string;
}

export interface CountryStrategicResourceBonuses {
	productionPercent: number;
	developmentPercent: number;
}

export interface CountryStrategicResources {
	resources: Record<string, string[] | undefined>;
	bonuses: CountryStrategicResourceBonuses;
}

export interface CountryRankings {
	countryRegionDiff: RankingEntry;
	countryDamages: RankingEntry;
	weeklyCountryDamages: RankingEntry;
	weeklyCountryDamagesPerCitizen?: RankingEntry;
	countryDevelopment: RankingEntry;
	countryActivePopulation: RankingEntry;
	countryWealth: RankingEntry;
	countryBounty: RankingEntry;
	countryProductionBonus: RankingEntry;
}

export interface CountryResponse {
	_id: string;
	name: string;
	code: string;

	money: number;

	orgs: string[];
	allies: string[];
	warsWith: string[];

	scheme: string;
	mapAccent: string;

	development: number;

	taxes: CountryTaxes;
	unrest: CountryUnrest;

	rankings: CountryRankings;

	strategicResources?: CountryStrategicResources;

	currentBattleOrder?: string;
	discordUrl?: string;

	specializedItem?: string;
	rulingParty?: string | null;

	pinnedArticle?: string;
	enemy?: string | null;

	createdAt?: string;
	updatedAt: string;

	__v: number;
}

export type AllCountriesResponse = CountryResponse[];
