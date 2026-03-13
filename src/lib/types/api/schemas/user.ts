import type { RankingEntry } from './ranking';
import type { Skill } from './skill';

export interface UserDates {
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
}

export interface UserLeveling {
	level: number;
	totalXp: number;
	dailyXpLeft: number;
	availableSkillPoints: number;
	spentSkillPoints: number;
	totalSkillPoints: number;
	freeReset: number;
}

export interface UserStats {
	damagesCount: number;
}

export interface UserSkills {
	energy: Skill;
	health: Skill;
	hunger: Skill;
	attack: Skill;
	companies: Skill;
	entrepreneurship: Skill;
	production: Skill;
	criticalChance: Skill;
	criticalDamages: Skill;
	armor: Skill;
	precision: Skill;
	dodge: Skill;
	lootChance: Skill;
	management: Skill;
}

export interface UserRankings {
	userDamages: RankingEntry;
	userWealth: RankingEntry;
	userLevel: RankingEntry;
	userReferrals: RankingEntry;
	userCasesOpened: RankingEntry;
	userBounty: RankingEntry;
}

export interface UserLiteResponse {
	_id: string;
	username: string;
	country: string;

	isActive: boolean;
	militaryRank: number;

	avatarUrl: string;
	mu: string;

	dates: UserDates;
	leveling: UserLeveling;
	stats: UserStats;

	rankings: UserRankings;
	skills: UserSkills;

	infos: {
		banner: string;
	};

	createdAt: string;
}
