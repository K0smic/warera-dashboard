export interface Skill {
	level: number;
	total: number;

	value?: number;
	ammoPercent?: number;
	buffsPercent?: number;
	debuffsPercent?: number;
	militaryRankPercent?: number;

	weapon?: number | null;
	equipment?: number | null;
	limited?: number | null;

	currentBarValue?: number;
	hourlyBarRegen?: number;
}
