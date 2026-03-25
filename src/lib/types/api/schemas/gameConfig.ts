import type { Rarity } from './common';

export interface GameConfigSkillLevel {
	value: number;
	totalCost: number;
	cost?: number;
	isABar?: boolean;
	unlockAtLevel: number;
}

export interface GameConfigSkillTable {
	levels: { [key: number]: GameConfigSkillLevel };
}

export interface GameConfigSkills {
	energy: GameConfigSkillTable;
	health: GameConfigSkillTable;
	hunger: GameConfigSkillTable;
	attack: GameConfigSkillTable;
	companies: GameConfigSkillTable;
	entrepreneurship: GameConfigSkillTable;
	production: GameConfigSkillTable;
	criticalChance: GameConfigSkillTable;
	criticalDamages: GameConfigSkillTable;
	armor: GameConfigSkillTable;
	precision: GameConfigSkillTable;
	dodge: GameConfigSkillTable;
	lootChance: GameConfigSkillTable;
	management: GameConfigSkillTable;
}

export interface GameConfigItemFlatStats {
	healthRegen?: number;
	percentAttack?: number;
	buffDurationHours?: number;
	debuffDurationHours?: number;
}

export type GameConfigProductibleItem = GameConfigRawItem | GameConfigProductItem;

// export function isProductibleItem(item: GameConfigItem): item is GameConfigProductibleItem {
// 	return item.type === 'raw' || item.type === 'product';
// }

// export function isRawItem(item: GameConfigItem): item is GameConfigRawItem {
// 	return item.type === 'raw';
// }

// export function isProductItem(item: GameConfigItem): item is GameConfigProductItem {
// 	return item.type === 'product';
// }

export interface GameConfigRawItem {
	type: 'raw';
	code: 'limestone' | 'grain' | 'livestock' | 'fish' | 'iron' | 'coca' | 'lead' | 'petroleum';
	rarity: Rarity;
	productionPoints: number;
	isDeposit: boolean;
	climates: Array<'moderate' | 'arid' | 'tropical' | 'polar'>;
	isTradable: boolean;
	IconComponent?: { compare: null };
}

export interface GameConfigProductItem {
	type: 'product';
	code:
		| 'concrete'
		| 'steel'
		| 'bread'
		| 'steak'
		| 'cookedFish'
		| 'lightAmmo'
		| 'ammo'
		| 'cocain'
		| 'oil'
		| 'heavyAmmo';
	rarity: Rarity;
	productionPoints: number;
	productionNeeds?: { [key: string]: number };
	flatStats?: GameConfigItemFlatStats;
	isConsumable?: boolean;
	isTradable: boolean;
	usage?: string;
	skinSlot?: string;
	IconComponent?: { compare: null };
}

export interface GameConfigWeaponItem {
	type: 'weapon';
	code: 'knife' | 'gun' | 'rifle' | 'sniper' | 'tank' | 'jet';
	usage: 'weapon';
	skinSlot: string;
	rarity: Rarity;
	IconComponent?: { compare: null };
	dynamicStats: {
		attack: [number, number];
		criticalChance: [number, number];
	};
}

export interface GameConfigEquipmentItem {
	type: 'equipment';
	code:
		| 'helmet1'
		| 'helmet2'
		| 'helmet3'
		| 'helmet4'
		| 'helmet5'
		| 'helmet6'
		| 'chest1'
		| 'chest2'
		| 'chest3'
		| 'chest4'
		| 'chest5'
		| 'chest6'
		| 'boots1'
		| 'boots2'
		| 'boots3'
		| 'boots4'
		| 'boots5'
		| 'boots6'
		| 'gloves1'
		| 'gloves2'
		| 'gloves3'
		| 'gloves4'
		| 'gloves5'
		| 'gloves6'
		| 'pants1'
		| 'pants2'
		| 'pants3'
		| 'pants4'
		| 'pants5'
		| 'pants6';
	usage: 'helmet' | 'chest' | 'pants' | 'boots' | 'gloves';
	skinSlot: string;
	rarity: Rarity;
	iconImg: string;
	dynamicStats: {
		armor?: [number, number];
		dodge?: [number, number];
		precision?: [number, number];
		criticalDamages?: [number, number];
	};
}

export interface GameConfigCaseItem {
	type: 'case';
	code: string;
	usage: 'case';
	rarity: Rarity;
	isTradable: boolean;
}

export type GameConfigItem =
	| GameConfigRawItem
	| GameConfigProductItem
	| GameConfigWeaponItem
	| GameConfigEquipmentItem
	| GameConfigCaseItem;

export type GameConfigItemsMap = {
	[K in GameConfigItem['code']]: GameConfigItem;
};

export type GameConfigProdItemsMap = {
	[K in GameConfigProductibleItem['code']]: GameConfigProductibleItem;
};

export interface GameConfigUpgradeLevelStats {
	attackBonus?: number;
	defenseBonus?: number;
	resistanceDecrease?: number;
	members?: number;
	maxProduction?: number;
	dailyProd?: number;
	maxWorkers?: number;
	dailyHires?: number;
}

export interface GameConfigUpgradeLevel {
	level: number;
	steelCost: number;
	constructionPointsCost?: number;
	maintenanceCost?: number;
	maintenanceCostScale?: number;
	minimumMaintenanceCost?: number;
	stats: GameConfigUpgradeLevelStats;
}

export interface GameConfigUpgradeType {
	canBeDisabled?: boolean;
	pendingDurationHours?: number;
	canDowngrade?: boolean;
	canBeDestroyed?: boolean;
	levels: { [key: number]: GameConfigUpgradeLevel };
}

export interface GameConfigUpgradesConfig {
	headquarters: GameConfigUpgradeType;
	dormitories: GameConfigUpgradeType;
	bunker: GameConfigUpgradeType;
	pacificationCenter: GameConfigUpgradeType;
	base: GameConfigUpgradeType;
	storage: GameConfigUpgradeType;
	automatedEngine: GameConfigUpgradeType;
	breakRoom: GameConfigUpgradeType;
}

export interface GameConfigResponse {
	user: {
		maxHunger: number;
		maxEnergy: number;
		maxConstructionPoints: number;
		dailyXp: number;
		isInactiveAfterDays: number;
		fieldsToPopulate: string;
		dailyReward: {
			xp: number;
			money: number;
			case1: number;
		};
		constructionEnergyCost: number;
		xpPerAction: number;
		energyCostPerAction: number;
		resetSkillsCostPerPoint: number;
		resetSkillDaysCooldown: number;
		takeControlCooldownInDays: number;
		citizenshipDaysCooldown: number;
		canTakeControlAtLevel: number;
		regenDividedBy: number;
		marketMinLevel: number;
		equipmentSets: {
			nonPremiumMax: number;
			premiumMax: number;
		};
		donationMinLevel: number;
		chatMinLevel: number;
	};

	skills: { [key: string]: GameConfigSkills };

	battle: {
		roundsToWin: number;
		maxRounds: number;
		pointsToWinRound: number;
		tickPoints: Record<string, number>;
		healthCost: number;
		countryOrderBonusPercent: number;
		muOrderBonusPercent: number;
		allianceDamagesBonusPercent: number;
		enemyDamagesBonusPercent: number;
		regionNotLinkedToCapitalMalusPercent: number;
		lostAttackingRegionMalusPercent: number;
		setCountryOrderMoneyCost: number;
		setMuOrderMoneyCost: number;
		setOrderMoneyCost: number;
		patrioticBonusPercent: number;
		occupyingYourRegionsMalusPercent: number;
		hitFor1CaseInPool: number;
		casesPer1kDamagesInPool: number;
	};

	org: {
		constructionCost: number;
		moveCost: number;
	};

	company: {
		constructionCostIncreasePerCompany: number;
		moveCost: number;
		changeItemCost: number;
		depositResourceBonus: number;
		destructionValuePercent: number;
	};

	worker: {
		maxFidelity: number;
		fidelityProductionBonusPercent: number;
	};

	mu: {
		constructionCost: number;
		moveCost: number;
		destructionValuePercent: number;
		maxOwnedMus: number;
		helpCooldownHours: number;
		healthPerHelp: number;
		helpValue: number;
	};

	law: {
		abusiveLawPossibleVotersNeeded: number;
		abusiveLawsCooldownInDays: number;
		lawVotesDurationHours: number;
		votersRatioNeeded: number;

		propose_alliance: {
			cost: number;
			maintenanceCost: number;
		};

		accept_alliance: {
			cost: number;
			maintenanceCost: number;
		};

		define_enemy_country: {
			cost: number;
			maintenanceCost: number;
		};

		set_color_scheme: {
			cost: number;
		};
	};

	election: {
		candidateDurationHours: number;
		electionVoteDurationHours: number;
		voteMinLevel: number;
		candidateMinLevel: number;
	};

	badge: Record<
		string,
		{
			reward: number;
			preserveBetweenReset?: boolean;
			uniqueMetadataKey?: string;
		}
	>;

	mergingCost: Record<Rarity, number>;

	upgradesConfig: GameConfigUpgradesConfig;

	upgrade: {
		refundPercent: number;
	};

	items: GameConfigItemsMap;

	referral: {
		levelNeededForBadge: number;
		moneyForBeingReferred: number;
		lifeTimeBadgeMoneySharePercent: number;
		canSetReferrerBeforeOrAtLevel: number;
	};

	region: {
		maxResistance: number;
		minDailyResistance: number;
		maxDailyResistance: number;
		transferDaysCooldown: number;
		regionNotLinkedToCapitalMalusDevelopmentPercent: number;
		resourcesBonus: Record<string, number>;
		depleteHourlyPercent: number;
		increaseResistanceCost: number;
		decreaseResistanceCost: number;
		increaseBy: number;
		decreaseBy: number;
		resistanceBarMultiplier: number;
		resistanceDecayPercent: number;
		resistanceGrowthPercentMin: number;
		resistanceGrowthPercentMax: number;
		resistancePassiveGrowthPercent: number;
		resistanceContributionCost: number;
		resistanceContributionValue: number;
		resistanceContributionMinLevel: number;
		resistanceCitizenBonus: number;
		resistanceBattleStartCostMultiplier: number;
		resistanceForeignGovCostMultiplier: number;
		resistanceBattleCooldownHours: number;
		resistanceContributionCooldownAfterRevoltHours: number;
		resistanceCitizenBonusPercent: number;
		resistanceAllyBonusPercent: number;
	};

	unrest: {
		barMultiplier: number;
		decayPercentMin: number;
		decayPercentMax: number;
		contributionCost: number;
		contributionValue: number;
		contributionMinLevel: number;
		battleStartCost: number;
		battleCooldownHours: number;
		bordersOpenDays: number;
		nominationPeriodHours: number;
		contributionCooldownAfterRevolutionHours: number;
	};

	party: {
		createCost: number;
	};

	newspaper: {
		tipValue: number;
		publishCost: number;
		createArticleMinLevel: number;
		tipMinLevel: number;
	};

	country: {
		maxTaxAmount: number;
		hijackedTaxPercentPerResistance: number;
	};

	citizenshipApplication: {
		autoApprovalMaxPopulation: number;
		autoApprovalEnabled: boolean;
	};

	government: {
		resistanceIncreasedCooldownInHours: number;
		resistanceDecreasedCooldownInHours: number;
	};

	mission: {
		reward: {
			daily: {
				xp: number;
				xpWhenFinished: number;
				cases: number;
				money: number;
			};
			weekly: {
				xp: number;
				xpWhenFinished: number;
				cases: number;
				money: number;
			};
			monthly: {
				xp: number;
				xpWhenFinished: number;
				cases: number;
				money: number;
			};
			starting: {
				xp: number;
				xpWhenFinished: number;
				cases: number;
				money: number;
			};
		};

		rerollMissionCost: Record<string, number>;
	};
}
