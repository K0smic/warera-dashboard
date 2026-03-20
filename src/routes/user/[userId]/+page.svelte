<script lang="ts">
	import { userState } from '$lib/stores/user.svelte';
	import { configsState } from '$lib/stores/configs.svelte';
	import { countriesState } from '$lib/stores/countries.svelte';
	import * as Card from '$lib/components/atoms/card/index';
	import { Badge } from '$lib/components/atoms/badge/index';
	import { Separator } from '$lib/components/atoms/separator/index';
	import { Progress } from '$lib/components/atoms/progress';
	import MdiEarth from '~icons/mdi/earth';
	import type { GameConfigSkills, GameConfigSkillTable } from '$lib/types/api/schemas';
	import type { RankingTier } from '$lib/types/api/schemas';
	import type { SkillBarEntry, RankingEntry } from '$lib/types/components/user';
	import { camelCaseToNormalText } from '$lib/utils';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	$inspect(data.user);

	// ── Helpers ────────────────────────────────────────────────────────────────

	/** Max value for a skill at level 10 from the skills config */
	function skillMax(skillKey: keyof GameConfigSkills): number {
		return (
			(configsState.configs?.skills?.[skillKey] as GameConfigSkillTable | undefined)?.levels['10']
				?.value ?? 1
		);
	}

	/** Format large numbers: 189 109 → "189k", 1 200 000 → "1.2M". */
	function fmt(n: number): string {
		if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
		if (n >= 1_000) return Math.round(n / 1_000) + 'k';
		return n.toLocaleString();
	}

	/** ISO date → "Jan 5, 2024". */
	function fmtDate(iso: string): string {
		return new Date(iso).toLocaleDateString();
	}

	// ── Tier badge CSS classes ─────────────────────────────────────────────────

	const TIER_CLASSES: Record<string, string> = {
		diamond: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
		platinum: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
		gold: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
		silver: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
		bronze: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any

	// ── Resource bars (regenerating skills with current fill) ──────────────────

	const resourceBars = $derived.by<SkillBarEntry[]>(() => {
		const s = data.user.skills;
		if (!s) return [];
		return [
			{
				key: 'health',
				label: 'Health',
				current: Math.round(s.health.currentBarValue ?? 0),
				max: s.health.total,
				level: s.health.level,
				color: '#1D9E75'
			},
			{
				key: 'hunger',
				label: 'Hunger',
				current: Math.round(s.hunger.currentBarValue ?? 0),
				max: s.hunger.total,
				level: s.hunger.level,
				color: '#EF9F27'
			},
			{
				key: 'energy',
				label: 'Energy',
				current: Math.round(s.energy.currentBarValue ?? 0),
				max: s.energy.total,
				level: s.energy.level,
				color: '#378ADD'
			},
			{
				key: 'entrepreneurship',
				label: 'Entrepreneurship',
				current: Math.round(s.entrepreneurship.currentBarValue ?? 0),
				max: s.entrepreneurship.total,
				level: s.entrepreneurship.level,
				color: '#D85A30'
			}
		];
	});

	// ── Combat skills (stat totals with progress toward max) ──────────────────

	const combatSkills = $derived.by<SkillBarEntry[]>(() => {
		const s = data.user.skills;
		if (!s) return [];
		return [
			{
				key: 'attack',
				label: 'Attack',
				current: s.attack.total,
				max: skillMax('attack'),
				level: s.attack.level,
				color: '#E24B4A'
			},
			{
				key: 'precision',
				label: 'Precision',
				current: s.precision.total,
				max: skillMax('precision'),
				level: s.precision.level,
				color: '#378ADD'
			},
			{
				key: 'criticalChance',
				label: 'Crit chance',
				current: s.criticalChance.total,
				max: skillMax('criticalChance'),
				level: s.criticalChance.level,
				color: '#D85A30'
			},
			{
				key: 'criticalDamages',
				label: 'Crit damage',
				current: s.criticalDamages.total,
				max: skillMax('criticalDamages'),
				level: s.criticalDamages.level,
				color: '#E24B4A'
			},
			{
				key: 'armor',
				label: 'Armor',
				current: s.armor.total,
				max: skillMax('armor'),
				level: s.armor.level,
				color: '#7F77DD'
			},
			{
				key: 'dodge',
				label: 'Dodge',
				current: s.dodge.total,
				max: skillMax('dodge'),
				level: s.dodge.level,
				color: '#1D9E75'
			},
			{
				key: 'lootChance',
				label: 'Loot chance',
				current: s.lootChance.total,
				max: skillMax('lootChance'),
				level: s.lootChance.level,
				color: '#1D9E75'
			}
		];
	});

	// ── Economy skills ─────────────────────────────────────────────────────────

	const economySkills = $derived.by<SkillBarEntry[]>(() => {
		const s = data.user.skills;
		if (!s) return [];
		return [
			{
				key: 'energy',
				label: 'Energy',
				current: s.energy.total,
				max: skillMax('energy'),
				level: s.energy.level,
				color: '#378ADD'
			},
			{
				key: 'production',
				label: 'Production',
				current: s.production.total,
				max: skillMax('production'),
				level: s.production.level,
				color: '#EF9F27'
			},
			{
				key: 'companies',
				label: 'Companies',
				current: s.companies.total,
				max: skillMax('companies'),
				level: s.companies.level,
				color: '#7F77DD'
			},
			{
				key: 'entrepreneurship',
				label: 'Entrepreneurship',
				current: s.entrepreneurship.total,
				max: skillMax('entrepreneurship'),
				level: s.entrepreneurship.level,
				color: '#D85A30'
			},
			{
				key: 'management',
				label: 'Management',
				current: s.management.total,
				max: skillMax('management'),
				level: s.management.level,
				color: '#7F77DD'
			}
		];
	});

	// ── Rankings ───────────────────────────────────────────────────────────────

	const rankings = $derived.by<RankingEntry[]>(() => {
		const r = data.user.rankings;
		if (!r) return [];

		const rows: RankingEntry[] = [
			{
				key: 'userDamages',
				label: 'Total damages',
				displayValue: fmt(r.userDamages.value),
				rank: r.userDamages.rank,
				tier: r.userDamages.tier as RankingTier
			},
			{
				key: 'userWealth',
				label: 'Wealth',
				displayValue: r.userWealth.value.toFixed(0),
				rank: r.userWealth.rank,
				tier: r.userWealth.tier as RankingTier
			},
			{
				key: 'userLevel',
				label: 'Level',
				displayValue: r.userLevel.value.toLocaleString() + ' XP',
				rank: r.userLevel.rank,
				tier: r.userLevel.tier as RankingTier
			},
			{
				key: 'userBounty',
				label: 'Bounty',
				displayValue: r.userBounty.value.toFixed(2),
				rank: r.userBounty.rank,
				tier: r.userBounty.tier as RankingTier
			}
		];

		if (r.weeklyUserDamages) {
			rows.splice(1, 0, {
				key: 'weeklyUserDamages',
				label: 'Weekly damages',
				displayValue: fmt(r.weeklyUserDamages.value),
				rank: r.weeklyUserDamages.rank,
				tier: r.weeklyUserDamages.tier as RankingTier
			});
		}

		return rows;
	});

	// ── Derived profile data ───────────────────────────────────────────────────

	const countryName = $derived(countriesState.getCountryById(data.user.country)?.name ?? '');
</script>

{#if data.user}
	{@const user = data.user}
	{@const lv = user.leveling}

	<div class="flex flex-col gap-4 p-4 md:gap-6 md:p-6">
		<!-- ── Profile header ───────────────────────────────────────────────────── -->
		<Card.Root class="overflow-hidden">
			<Card.Content class="">
				<div class="flex flex-col gap-4 sm:items-start sm:gap-6 xl:flex-row">
					<div class="flex flex-1 flex-row gap-4">
						<!-- Avatar -->
						<div class="relative shrink-0">
							<img
								src={user.avatarUrl}
								alt={user.username}
								loading="lazy"
								class="h-20 w-20 rounded-xl border-2 border-border object-cover shadow-sm"
							/>
							{#if user.isActive}
								<span
									class="absolute right-1 bottom-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-emerald-500"
									title="Active"
								></span>
							{/if}
						</div>

						<!-- Identity -->
						<div class="flex min-w-0 flex-1 flex-col gap-2">
							<div class="flex flex-wrap items-center gap-2">
								<h1 class="truncate text-xl font-semibold text-foreground">{user.username}</h1>
								<Badge variant="default" class="shrink-0 rounded-sm font-bold">Lv. {lv.level}</Badge
								>
								<Badge variant="secondary" class="shrink-0 rounded-sm"
									>Rank #{user.militaryRank}</Badge
								>
							</div>

							<p class="text-xs text-muted-foreground">Member since {fmtDate(user.createdAt)}</p>
							{#if countryName}
								<p class="flex items-center gap-1 text-sm text-muted-foreground">
									<MdiEarth class="h-4 w-4 shrink-0" />{countryName}
								</p>
							{/if}
						</div>
					</div>
					<!-- Quick stats -->
					<div
						class="grid-cols-auto grid w-full flex-1 items-center gap-3 text-center sm:grid-cols-4"
					>
						{#each [{ label: 'Total XP', value: lv.totalXp.toLocaleString() }, { label: 'Damages', value: fmt(user.stats.damagesCount) }, { label: 'Skill pts', value: lv.availableSkillPoints, maxValue: lv.totalSkillPoints }, { label: 'Daily XP left', value: lv.dailyXpLeft, maxValue: `${configsState.configs?.user?.dailyXp ?? '—'}` }] as stat}
							<div class="rounded-lg bg-muted/50 px-3 py-2">
								<p class="text-sm text-muted-foreground">
									{stat.label}
								</p>
								<p class="mt-0.5 text-base font-bold text-foreground tabular-nums">
									<span class="text-xl">{stat.value}</span>{#if stat.maxValue}<span class="text-xs"
											>/{stat.maxValue}</span
										>
									{/if}
								</p>
							</div>
						{/each}
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<!-- Resource bars row -->
		<div class="grid gap-4 lg:grid-cols-4">
			{#each resourceBars as bar}
				<Card.Root class="flex flex-col gap-1">
					<Card.Header class="">
						<Card.Title
							class="flex items-center gap-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase"
						>
							{bar.label}
						</Card.Title>
					</Card.Header>
					<Card.Content class="flex flex-col gap-1">
						<div class=" gap-3 sm:grid-cols-4">
							<div class="flex flex-col gap-1.5">
								<div class="flex items-center justify-end">
									<span class="text-xs text-muted-foreground tabular-nums">
										{bar.current}/{bar.max}
									</span>
								</div>
								<div class="h-2 w-full overflow-hidden rounded-full bg-muted">
									<Progress value={bar.current} max={bar.max} />
									<!-- <div
										class="h-full rounded-full transition-all duration-300"
										style="width: {bar.max > 0
											? Math.min(100, Math.round((bar.current / bar.max) * 100))
											: 0}%; background-color: {bar.color};"
									></div> -->
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>

		<!-- ── Skills + Rankings grid ─────────────────────────────────────────── -->
		<div class="grid gap-4 lg:grid-cols-3">
			<!-- Combat skills -->
			<Card.Root>
				<Card.Header class="">
					<Card.Title
						class="flex items-center gap-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase"
					>
						Combat
					</Card.Title>
				</Card.Header>
				<Card.Content class="flex flex-col gap-1">
					{#each combatSkills as skill, i}
						{@render skillRow(skill)}
						{#if i < combatSkills.length - 1}
							<Separator class="my-0.5 opacity-40" />
						{/if}
					{/each}
				</Card.Content>
			</Card.Root>

			<!-- Economy skills -->
			<Card.Root>
				<Card.Header class="">
					<Card.Title
						class="flex items-center gap-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase"
					>
						Economy
					</Card.Title>
				</Card.Header>
				<Card.Content class="flex flex-col gap-1">
					{#each economySkills as skill, i}
						{@render skillRow(skill)}
						{#if i < economySkills.length - 1}
							<Separator class="my-0.5 opacity-40" />
						{/if}
					{/each}
				</Card.Content>
			</Card.Root>

			<!-- Rankings -->
			<Card.Root>
				<Card.Header class="">
					<Card.Title
						class="flex items-center gap-2 text-sm font-semibold tracking-wider text-muted-foreground uppercase"
					>
						Rankings
					</Card.Title>
				</Card.Header>
				<Card.Content class="flex flex-col">
					{#each rankings as entry, i}
						<div
							class="flex items-center justify-between py-3"
							class:border-b={i < rankings.length - 1}
						>
							<div>
								<div class="flex flex-row gap-1">
									<span class="text-sm font-medium text-foreground">{entry.label}</span>
								</div>
								<p class="text-xs text-muted-foreground tabular-nums">{entry.displayValue}</p>
							</div>
							<div class="relative flex items-center gap-2">
								<span class="text-sm font-semibold text-foreground tabular-nums">
									#{entry.rank.toLocaleString()}
								</span>
								<span
									class="h-3.5 w-3.5 rounded-full border-2 border-foreground/50 {TIER_CLASSES[
										entry.tier
									] ?? ''}"
									title={camelCaseToNormalText(entry.tier)}
								></span>
							</div>
						</div>
					{/each}
				</Card.Content>
			</Card.Root>
		</div>
	</div>
{:else}
	<div class="flex flex-1 items-center justify-center p-10">
		<div class="text-center">
			<p class="text-lg font-medium text-muted-foreground">No profile loaded</p>
			<p class="mt-1 text-sm text-muted-foreground">
				Enter your user ID in the sidebar to get started.
			</p>
		</div>
	</div>
{/if}

<!-- ── Skill row snippet ────────────────────────────────────────────────────── -->

{#snippet skillRow(skill: SkillBarEntry)}
	<div class="flex flex-col gap-1.5">
		<div class="flex items-center justify-between">
			<span class="text-sm font-medium text-foreground">{skill.label}</span>
			<div>
				<span class="text-xs text-muted-foreground tabular-nums">
					{skill.current}/{skill.max}
				</span>
				<!-- <span class="w-20 shrink-0 text-right text-xs font-medium text-foreground tabular-nums">
				{skill.current}<span class="text-muted-foreground">/{skill.max}</span>
			</span> -->
				<span class="w-7 shrink-0 text-right text-[11px] text-muted-foreground">
					Lv{skill.level}
				</span>
			</div>
		</div>
		<!-- <span class="w-24 shrink-0 text-xs text-muted-foreground">{skill.label}</span> -->
		<Progress class="h-1.5 " value={skill.current} max={skill.max} />

		<!-- <div
				class="h-full rounded-full transition-all duration-300"
				style="width: {skill.max > 0
					? Math.min(100, Math.round((skill.current / skill.max) * 100))
					: 0}%; background-color: {skill.color};"
			></div> -->
	</div>
{/snippet}
