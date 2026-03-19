import type { RankingTier } from './common';

export interface RankingEntry {
	value: number;
	rank: number;
	tier: RankingTier;
}
