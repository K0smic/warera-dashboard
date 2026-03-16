export interface RegionDeposit {
	type: string;
	startsAt: string;
	endsAt: string;
	bonusPercent: number;
}

export interface RegionDatesInfo {
	lastOwnershipChangeAt?: string;
}

export interface RegionStatsInfo {
	investedMoney: number;
}

export interface RegionUpgradeConstruction {
	user: string;
	construction: number;
	constructionAt: string;
}

export interface RegionUpgradeData {
	level: number;
	constructionPoints: number;
	investedMoney: number;

	constructionStartedAt: string;
	constructionEndedAt: string;

	isUnderConstruction: boolean | null;

	lastConstructions: RegionUpgradeConstruction[];

	status: 'active' | 'disabled' | 'pending';
	statusChangedAt?: string;
}

export interface RegionUpgradesV2 {
	upgrades: Record<string, RegionUpgradeData>;
	activeConstructionCount?: number;
}

export interface RegionBattleSide {
	region?: string;
	country: string;

	wonRoundsCount: number;
	damages: number;
	hitCount: number;

	countryOrders: string[];
	muOrders: string[];

	moneyPer1kDamages?: number;
	moneyPool?: number;
}

export interface RegionActiveBattle {
	_id: string;
	war: string;
	type: 'war' | 'resistance';

	attacker: RegionBattleSide;
	defender: RegionBattleSide;

	stats: {
		hitCount: number;
	};

	rounds: string[];
	roundsHistory: unknown[];

	currentRound: string;
	roundsToWin: number;

	isActive: boolean;

	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface RegionResponse {
	_id: string;
	code: string;
	name: string;

	country: string;
	initialCountry: string;

	neighbors: string[];

	mainCity: string;
	position: [number, number];

	biome: string;
	climate: string;

	development: number;
	baseDevelopment: number;

	stats: RegionStatsInfo;
	dates: RegionDatesInfo;

	upgradesV2: RegionUpgradesV2;

	isCapital: boolean;
	isLinkedToCapital: boolean;

	countryCode: string;

	resistance: number;
	resistanceMax: number;

	activeUpgradeLevels: Record<string, number>;

	strategicResource?: string;
	deposit?: RegionDeposit;

	hasCoast?: boolean;

	activeBattle?: RegionActiveBattle;

	lastResistanceContributionAt?: string;
	lastRevoltEndedAt?: string;

	__v: number;
}

export interface RegionData {
	regionId: string;
	bonus: number;
	depositBonus: number;
	ethicDepositBonus: number;
	strategicBonus: number;
	ethicSpecializationBonus: number;
	taxPercent: number;
}

export interface RecommendedRegionIdsByItemCodeResponse {
	data: RegionData[];
}

export type AllRegionsResponse = { [key: string]: RegionResponse };
