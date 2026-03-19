import type { RankingTier } from '../api/schemas';

export interface SkillBarEntry {
	key: string;
	label: string;
	current: number;
	max: number;
	level: number;
	color: string;
}

export interface RankingEntry {
	key: string;
	label: string;
	displayValue: string;
	rank: number;
	tier: RankingTier;
}
