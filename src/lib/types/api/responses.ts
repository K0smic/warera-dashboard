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
		UserLite: {
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
			lastOwnershipChangeAt: string;
		};
		RegionStatsInfo: {
			investedMoney: number;
		};
		RegionUpgradesV2: {
			upgrades: Record<string, unknown>;
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
			hasCoast: boolean;
			resistanceMax: number;
			deposit?: responses['schemas']['RegionDeposit'];
		};
		CountryTaxes: {
			income: number;
			market: number;
			selfWork: number;
		};
		CountryUnrest: {
			barMax: number;
			bar: number;
			lastContributionAt: string;
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
			weeklyCountryDamagesPerCitizen: responses['schemas']['RankingEntry'];
			countryDevelopment: responses['schemas']['RankingEntry'];
			countryActivePopulation: responses['schemas']['RankingEntry'];
			countryWealth: responses['schemas']['RankingEntry'];
			countryBounty: responses['schemas']['RankingEntry'];
			countryProductionBonus: responses['schemas']['RankingEntry'];
		};
		ProductionBonus: {
			strategicBonus: number;
			depositBonus: number;
			ethicSpecializationBonus: number;
			ethicDepositBonus: number;
			total: number;
		};
		WageStats: {
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
			strategicResources: responses['schemas']['CountryStrategicResources'];
			rankings: responses['schemas']['CountryRankings'];
			currentBattleOrder: string;
			updatedAt: string;
			development: number;
			discordUrl: string;
			specializedItem: string;
			rulingParty: string;
			pinnedArticle: string;
		};
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
		WorkersByCompany: {
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
		WorkersByUser: {
			type: 'user';
			workersPerCompany: responses['schemas']['WorkersPerCompanyItem'][];
		};
	};
	responses: never;
	parameters: never;
	requestBodies: never;
	headers: never;
	pathItems: never;
}
