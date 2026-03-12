export interface responses {
	schemas: {
		CompanyResponse: {
			_id: string;
			user: string;
			region: string;
			itemCode: string;
			isFull: boolean;
			name: string;
			concreteInvested: number;
			production: number;
			activeUpgradeLevels: {
				storage: number;
				automatedEngine: number;
				breakRoom?: number;
				[key: string]: number | undefined;
			};
			workerCount: number;
			createdAt: string;
			updatedAt: string;
			__v: number;
			estimatedValue: number;
		};
		CompaniesResponse: {
			items: string[];
		};
		Skill: {
			level: number;
			value?: number;
			ammoPercent?: number;
			buffsPercent?: number;
			debuffsPercent?: number;
			militaryRankPercent?: number;
			weapon?: number | null;
			equipment?: number | null;
			limited?: number | null;
			total: number;
			currentBarValue?: number;
			hourlyBarRegen?: number;
		};
		RankingEntry: {
			value: number;
			rank: number;
			tier: string;
		};
		UserLiteResponse: {
			dates: {
				lastConnectionAt: string;
				lastNotificationsCheckAt: string;
				lastCountryMessageCheckAt: string;
				lastGlobalMessageCheckAt: string;
				lastEventsCheckAt: string;
				lastWorkOfferApplications: string[];
				lastHiresAt: string[];
				lastWorkAt: string;
				lastCompanyJoinedAt: string;
				lastDailyRewardClaimedAt: string;
				lastHelpAskedAt: string;
			};
			infos: {
				banner: string;
			};
			leveling: {
				level: number;
				totalXp: number;
				dailyXpLeft: number;
				availableSkillPoints: number;
				spentSkillPoints: number;
				totalSkillPoints: number;
				freeReset: number;
			};
			_id: string;
			username: string;
			country: string;
			isActive: boolean;
			skills: {
				energy: responses['schemas']['Skill'];
				health: responses['schemas']['Skill'];
				hunger: responses['schemas']['Skill'];
				attack: responses['schemas']['Skill'];
				companies: responses['schemas']['Skill'];
				entrepreneurship: responses['schemas']['Skill'];
				production: responses['schemas']['Skill'];
				criticalChance: responses['schemas']['Skill'];
				criticalDamages: responses['schemas']['Skill'];
				armor: responses['schemas']['Skill'];
				precision: responses['schemas']['Skill'];
				dodge: responses['schemas']['Skill'];
				lootChance: responses['schemas']['Skill'];
				management: responses['schemas']['Skill'];
			};
			militaryRank: number;
			createdAt: string;
			stats: {
				damagesCount: number;
			};
			rankings: {
				userDamages: responses['schemas']['RankingEntry'];
				userWealth: responses['schemas']['RankingEntry'];
				userLevel: responses['schemas']['RankingEntry'];
				userReferrals: responses['schemas']['RankingEntry'];
				userCasesOpened: responses['schemas']['RankingEntry'];
				userBounty: responses['schemas']['RankingEntry'];
			};
			avatarUrl: string;
			mu: string;
		};
		RegionDeposit: {
			type: string;
			startsAt: string;
			endsAt: string;
			bonusPercent: number;
		};
		RegionDatesInfo: {
			lastOwnershipChangeAt?: string;
		};
		RegionStatsInfo: {
			investedMoney: number;
		};
		RegionUpgradesV2: {
			upgrades: Record<string, responses['schemas']['RegionUpgradeData']>;
			activeConstructionCount?: number;
		};
		RegionResponse: {
			stats: responses['schemas']['RegionStatsInfo'];
			dates: responses['schemas']['RegionDatesInfo'];
			_id: string;
			code: string;
			country: string;
			initialCountry: string;
			neighbors: string[];
			isCapital: boolean;
			isLinkedToCapital: boolean;
			upgradesV2: responses['schemas']['RegionUpgradesV2'];
			name: string;
			mainCity: string;
			development: number;
			baseDevelopment: number;
			countryCode: string;
			position: [number, number];
			biome: string;
			climate: string;
			__v: number;
			resistance: number;
			resistanceMax: number;
			hasCoast?: boolean;
			activeUpgradeLevels: Record<string, number>;
			strategicResource?: string;
			deposit?: responses['schemas']['RegionDeposit'];
			lastResistanceContributionAt?: string;
			lastRevoltEndedAt?: string;
			activeBattle?: responses['schemas']['RegionActiveBattle'];
		};

		RegionUpgradeConstruction: {
			user: string;
			construction: number;
			constructionAt: string;
		};

		RegionUpgradeData: {
			level: number;
			constructionPoints: number;
			investedMoney: number;
			constructionStartedAt: string;
			isUnderConstruction: boolean | null;
			lastConstructions: responses['schemas']['RegionUpgradeConstruction'][];
			status: 'active' | 'disabled' | 'pending';
			constructionEndedAt: string;
			statusChangedAt?: string;
		};

		RegionBattleSide: {
			region?: string;
			country: string;
			wonRoundsCount: number;
			countryOrders: string[];
			muOrders: string[];
			damages: number;
			hitCount: number;
			moneyPer1kDamages?: number;
			moneyPool?: number;
		};

		RegionActiveBattle: {
			defender: responses['schemas']['RegionBattleSide'];
			attacker: responses['schemas']['RegionBattleSide'];
			stats: { hitCount: number };
			_id: string;
			war: string;
			type: 'war' | 'resistance';
			rounds: string[];
			roundsHistory: unknown[];
			isActive: boolean;
			roundsToWin: number;
			createdAt: string;
			updatedAt: string;
			__v: number;
			currentRound: string;
		};

		RegionData: {
			regionId: string;
			bonus: number;
			depositBonus: number;
			ethicDepositBonus: number;
			strategicBonus: number;
			ethicSpecializationBonus: number;
			taxPercent: number;
		};

		RecommendedRegionIdsByItemCodeResponse: {
			data: responses['schemas']['RegionData'];
		};

		/** Response of `region.getRegionsObject` — object keyed by region _id. */
		AllRegionsResponse: Record<string, responses['schemas']['RegionResponse']>;

		CountryTaxes: {
			income: number;
			market: number;
			selfWork: number;
		};
		CountryUnrest: {
			barMax: number;
			bar: number;
			lastContributionAt?: string;
		};
		CountryStrategicResourceBonuses: {
			productionPercent: number;
			developmentPercent: number;
		};
		CountryStrategicResources: {
			resources: {
				lithium?: string[];
				rareEarths?: string[];
				diamonds?: string[];
				coal?: string[];
				uranium?: string[];
				gold?: string[];
				[key: string]: string[] | undefined;
			};
			bonuses: responses['schemas']['CountryStrategicResourceBonuses'];
		};
		CountryRankings: {
			countryRegionDiff: responses['schemas']['RankingEntry'];
			countryDamages: responses['schemas']['RankingEntry'];
			weeklyCountryDamages: responses['schemas']['RankingEntry'];
			weeklyCountryDamagesPerCitizen?: responses['schemas']['RankingEntry']; // was required
			countryDevelopment: responses['schemas']['RankingEntry'];
			countryActivePopulation: responses['schemas']['RankingEntry'];
			countryWealth: responses['schemas']['RankingEntry'];
			countryBounty: responses['schemas']['RankingEntry'];
			countryProductionBonus: responses['schemas']['RankingEntry'];
		};
		ProductionBonusResponse: {
			strategicBonus: number;
			depositBonus: number;
			ethicSpecializationBonus: number;
			ethicDepositBonus: number;
			total: number;
		};
		WageStatsResponse: {
			allowedRange: {
				min: number;
				max: number;
				average: number;
			};
			topOffer: number;
			topEligibleOffer: number;
			topEligibleOffers: {
				_id: string;
				company: string;
				user: string;
				region: string;
				quantity: number;
				initialQuantity: number;
				wage: number;
				createdAt: string;
				updatedAt: string;
				__v: number;
			}[];
		};
		CountryResponse: {
			taxes: responses['schemas']['CountryTaxes'];
			unrest: responses['schemas']['CountryUnrest'];
			_id: string;
			name: string;
			code: string;
			money: number;
			orgs: string[];
			allies: string[];
			warsWith: string[];
			scheme: string;
			mapAccent: string;
			__v: number;
			rankings: responses['schemas']['CountryRankings'];
			updatedAt: string;
			development: number;
			strategicResources?: responses['schemas']['CountryStrategicResources'];
			currentBattleOrder?: string;
			discordUrl?: string;
			specializedItem?: string;
			rulingParty?: string | null;
			pinnedArticle?: string;
			enemy?: string | null;
			createdAt?: string;
		};

		AllCountriesResponse: responses['schemas']['CountryResponse'][];

		ProductionBonuses: {
			regionId: string;
			bonus: number;
			depositEndAt?: string;
			itemCode: string;
			depositBonus: number;
			ethicDepositBonus: number;
			strategicBonus: number;
			ethicSpecializationBonus: number;
			taxPercent: number;
		};
		UpgradeByType: {
			_id: string;
			company: string;
			upgradeType: string;
			level: number;
			status: 'active';
			investedMoney: number;
			investedConcrete: number;
			investedSteel: number;
			dependantUsersCount: number;
			createdAt: string;
			updatedAt: string;
			__v: number;
		};
		WorkerData: {
			_id: string;
			user: string;
			company: string;
			employer: string;
			wage: number;
			joinedAt: string;
			fidelity: number;
			lastFidelityIncreaseAt: string;
			createdAt: string;
			updatedAt: string;
			__v: number;
			lockedUntil?: string;
		};
		WorkersByCompanyResponse: {
			type: 'company';
			workers: responses['schemas']['WorkerData'][];
		};
		CompanyInfo: {
			_id: string;
			name: string;
			itemCode: string;
		};
		WorkersPerCompanyItem: {
			company: responses['schemas']['CompanyInfo'];
			workers: responses['schemas']['WorkerData'][];
		};
		WorkersByUserResponse: {
			type: 'user';
			workersPerCompany: responses['schemas']['WorkersPerCompanyItem'][];
		};
		// ─── Skill config ────────────────────────────────────────────────────────────

		/** One row in a skill's level-up table (e.g. `skills.energy["3"]`). */
		GameConfigSkillLevel: {
			/** Stat value unlocked at this level. */
			value: number;
			/** Cumulative skill-point cost to reach this level. */
			totalCost: number;
			/** Incremental cost for this level; absent at level 0. */
			cost?: number;
			/**
			 * `true` only at level 0 for bar-type skills
			 * (energy, health, hunger, production, entrepreneurship).
			 */
			isABar?: boolean;
			/** Minimum player level required to invest in this skill. */
			unlockAtLevel: number;
		};

		/**
		 * Full level-up table for one skill.
		 * Keys are the level as a string: `"0"` … `"10"`.
		 */
		GameConfigSkillTable: Record<string, responses['schemas']['GameConfigSkillLevel']>;

		/** Complete skills configuration block. */
		GameConfigSkills: {
			energy: responses['schemas']['GameConfigSkillTable'];
			health: responses['schemas']['GameConfigSkillTable'];
			hunger: responses['schemas']['GameConfigSkillTable'];
			attack: responses['schemas']['GameConfigSkillTable'];
			companies: responses['schemas']['GameConfigSkillTable'];
			entrepreneurship: responses['schemas']['GameConfigSkillTable'];
			production: responses['schemas']['GameConfigSkillTable'];
			criticalChance: responses['schemas']['GameConfigSkillTable'];
			criticalDamages: responses['schemas']['GameConfigSkillTable'];
			armor: responses['schemas']['GameConfigSkillTable'];
			precision: responses['schemas']['GameConfigSkillTable'];
			dodge: responses['schemas']['GameConfigSkillTable'];
			lootChance: responses['schemas']['GameConfigSkillTable'];
			management: responses['schemas']['GameConfigSkillTable'];
		};

		// ─── Items ───────────────────────────────────────────────────────────────────

		/** Consumable/buff stats that a product can provide on use. */
		GameConfigItemFlatStats: {
			healthRegen?: number;
			percentAttack?: number;
			buffDurationHours?: number;
			debuffDurationHours?: number;
		};

		/** A harvested raw material (limestone, iron, grain, …). */
		GameConfigRawItem: {
			type: 'raw';
			code: string;
			/** @enum {string} */
			rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
			productionPoints: number;
			isDeposit: boolean;
			climates: Array<'moderate' | 'arid' | 'tropical' | 'polar'>;
			isTradable: boolean;
			IconComponent?: { compare: null };
		};

		/** A crafted product derived from raw materials. */
		GameConfigProductItem: {
			type: 'product';
			code: string;
			/** @enum {string} */
			rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
			productionPoints: number;
			productionNeeds?: Record<string, number>;
			flatStats?: responses['schemas']['GameConfigItemFlatStats'];
			isConsumable?: boolean;
			isTradable: boolean;
			/** Equipment usage slot — present on ammo products. */
			usage?: string;
			skinSlot?: string;
			IconComponent?: { compare: null };
		};

		/** A weapon item (knife, gun, rifle, sniper, tank, jet). */
		GameConfigWeaponItem: {
			type: 'weapon';
			code: string;
			usage: 'weapon';
			skinSlot: string;
			/** @enum {string} */
			rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
			IconComponent?: { compare: null };
			/** `[min, max]` inclusive roll range per stat. */
			dynamicStats: {
				attack: [number, number];
				criticalChance: [number, number];
			};
		};

		/** A piece of wearable equipment (helmet, chest, pants, boots, gloves). */
		GameConfigEquipmentItem: {
			type: 'equipment';
			code: string;
			usage: 'helmet' | 'chest' | 'pants' | 'boots' | 'gloves';
			skinSlot: string;
			/** @enum {string} */
			rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
			iconImg: string;
			/** Only the relevant stat for each equipment slot is present. */
			dynamicStats: {
				armor?: [number, number];
				dodge?: [number, number];
				precision?: [number, number];
				criticalDamages?: [number, number];
			};
		};

		/** A loot case (case1, case2). */
		GameConfigCaseItem: {
			type: 'case';
			code: string;
			usage: 'case';
			/** @enum {string} */
			rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
			isTradable: boolean;
		};

		/**
		 * Discriminated union of all item definitions.
		 * Narrow via `type`: `'raw' | 'product' | 'weapon' | 'equipment' | 'case'`.
		 */
		GameConfigItem:
			| responses['schemas']['GameConfigRawItem']
			| responses['schemas']['GameConfigProductItem']
			| responses['schemas']['GameConfigWeaponItem']
			| responses['schemas']['GameConfigEquipmentItem']
			| responses['schemas']['GameConfigCaseItem'];

		// ─── Upgrades ────────────────────────────────────────────────────────────────

		/** Stat bonuses granted by one upgrade level. */
		GameConfigUpgradeLevelStats: {
			/** Attack bonus % (headquarters, base). */
			attackBonus?: number;
			/** Defense bonus % (bunker). */
			defenseBonus?: number;
			/** Resistance decrease value (pacificationCenter). */
			resistanceDecrease?: number;
			/** Maximum MU members (dormitories). */
			members?: number;
			/** Maximum stored production units (storage). */
			maxProduction?: number;
			/** Automated daily production units (automatedEngine). */
			dailyProd?: number;
			/** Maximum hired workers (breakRoom). */
			maxWorkers?: number;
			/** Maximum new hires per day (breakRoom). */
			dailyHires?: number;
		};

		/** One level entry inside an upgrade's level table. */
		GameConfigUpgradeLevel: {
			level: number;
			steelCost: number;
			constructionPointsCost?: number;
			/** Fixed daily maintenance currency cost. */
			maintenanceCost?: number;
			/** Maintenance as a fraction of treasury (dynamic-cost upgrades). */
			maintenanceCostScale?: number;
			/** Floor for `maintenanceCostScale`-based maintenance costs. */
			minimumMaintenanceCost?: number;
			stats: responses['schemas']['GameConfigUpgradeLevelStats'];
		};

		/** Definition of one upgrade type (headquarters, bunker, storage, …). */
		GameConfigUpgradeType: {
			canBeDisabled?: boolean;
			pendingDurationHours?: number;
			canDowngrade?: boolean;
			canBeDestroyed?: boolean;
			/** Keys are the level number as a string: `"1"`, `"2"`, … */
			levels: Record<string, responses['schemas']['GameConfigUpgradeLevel']>;
		};

		/** Complete upgrades configuration block. */
		GameConfigUpgradesConfig: {
			headquarters: responses['schemas']['GameConfigUpgradeType'];
			dormitories: responses['schemas']['GameConfigUpgradeType'];
			bunker: responses['schemas']['GameConfigUpgradeType'];
			pacificationCenter: responses['schemas']['GameConfigUpgradeType'];
			base: responses['schemas']['GameConfigUpgradeType'];
			storage: responses['schemas']['GameConfigUpgradeType'];
			automatedEngine: responses['schemas']['GameConfigUpgradeType'];
			breakRoom: responses['schemas']['GameConfigUpgradeType'];
		};

		// ─── Root GameConfig ─────────────────────────────────────────────────────────

		/** Full static game configuration returned by `gameConfig.getGameConfig`. */
		GameConfigResponse: {
			user: {
				maxHunger: number;
				maxEnergy: number;
				maxConstructionPoints: number;
				dailyXp: number;
				isInactiveAfterDays: number;
				fieldsToPopulate: string;
				dailyReward: { xp: number; money: number; case1: number };
				constructionEnergyCost: number;
				xpPerAction: number;
				energyCostPerAction: number;
				resetSkillsCostPerPoint: number;
				resetSkillDaysCooldown: number;
				takeControlCooldownInDays: number;
				citizenshipDaysCooldown: number;
				canTakeControlAtLevel: number;
				/** Divisor in the hourly regen formula: `statValue / regenDividedBy`. */
				regenDividedBy: number;
				marketMinLevel: number;
				equipmentSets: { nonPremiumMax: number; premiumMax: number };
				donationMinLevel: number;
				chatMinLevel: number;
			};

			skills: responses['schemas']['GameConfigSkills'];

			battle: {
				roundsToWin: number;
				maxRounds: number;
				pointsToWinRound: number;
				/** Damage threshold → tick-point awards. Keys are threshold values as strings. */
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
				propose_alliance: { cost: number; maintenanceCost: number };
				accept_alliance: { cost: number; maintenanceCost: number };
				define_enemy_country: { cost: number; maintenanceCost: number };
				set_color_scheme: { cost: number };
			};

			election: {
				candidateDurationHours: number;
				electionVoteDurationHours: number;
				voteMinLevel: number;
				candidateMinLevel: number;
			};

			/** Badge definitions keyed by badge code. */
			badge: Record<
				string,
				{
					reward: number;
					preserveBetweenReset?: boolean;
					uniqueMetadataKey?: string;
				}
			>;

			/**
			 * Merging cost per rarity tier.
			 * @enum keys — 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic'
			 */
			mergingCost: Record<'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic', number>;

			upgradesConfig: responses['schemas']['GameConfigUpgradesConfig'];

			upgrade: {
				refundPercent: number;
			};

			/** Item definitions keyed by item code. Discriminate on `type` to narrow. */
			items: Record<string, responses['schemas']['GameConfigItem']>;

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
				/** Production bonus multipliers by deposit slot rank ("1", "2", "3"). */
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
					daily: { xp: number; xpWhenFinished: number; cases: number; money: number };
					weekly: { xp: number; xpWhenFinished: number; cases: number; money: number };
					monthly: { xp: number; xpWhenFinished: number; cases: number; money: number };
					starting: { xp: number; xpWhenFinished: number; cases: number; money: number };
				};
				/** Reroll cost by reroll-count index ("0" … "20"). */
				rerollMissionCost: Record<string, number>;
			};
		};
		TopOrdersResponse: {
			buyOrders: responses['schemas']['Order'];
			sellOrders: responses['schemas']['Order'];
		};
		Order: {
			_id: string;
			user: string;
			itemCode: string;
			quantity: number;
			price: number;
			offerAt: string; // ISO date
			type: 'buy' | 'sell';
			__v: number;

			// optional because it appears only in one order
			country?: string;
		};
	};
	responses: never;
	parameters: never;
	requestBodies: never;
	headers: never;
	pathItems: never;
}
