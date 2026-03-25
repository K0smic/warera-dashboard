<script lang="ts">
	import { getContext } from 'svelte';
	import { WORKER_INFO_CTX, type WorkerInfoContext } from '$lib/types';

	import * as Card from '$lib/components/atoms/card';
	import { Badge } from '$lib/components/atoms/badge';

	import { configsState } from '$lib/stores/configs.svelte';

	let workersInfos = getContext<WorkerInfoContext>(WORKER_INFO_CTX);

	interface Props {
		engineLevel: number;
		storageLevel: number;
		breakRoomLevel: number | undefined;
		engineUpgrade: any;
		storageUpgrade: any;
		productionPoints: number;
		inputPrice?: number;
		outputBestSellPrice: number;
		outputBestBuyPrice: number;
		outputMarketSpread?: number;
		steelPrice: number;
		baselineSteelPrice?: number;
		totalBonus?: number;
	}

	let {
		engineLevel,
		storageLevel,
		breakRoomLevel,
		engineUpgrade,
		storageUpgrade,
		productionPoints = 1,
		inputPrice = 0,
		outputBestSellPrice,
		outputBestBuyPrice,
		outputMarketSpread,
		steelPrice,
		baselineSteelPrice = 0,
		totalBonus = 0
	}: Props = $props();

	// TODO: Remove test
	baselineSteelPrice = 1.6666;
	let wage = 0.14;

	// --- Horizon toggle ---
	const horizons = [
		{ label: '7d', days: 7 },
		{ label: '1mo', days: 30 },
		{ label: '1yr', days: 365 }
	] as const;
	type HorizonDays = 7 | 30 | 365;
	let selectedHorizon = $state<HorizonDays>(365);

	// --- Config helpers ---
	const getLevel = (upgradeKey: 'storage' | 'automatedEngine', level: number) =>
		configsState.upgradesConfig(upgradeKey)?.levels[level];

	const getNextUpgradeSteelCost = (
		upgradeKey: 'storage' | 'automatedEngine',
		currentLevel: number
	): number => getLevel(upgradeKey, currentLevel + 1)?.steelCost ?? 0;

	const calculateTotalSteelInvested = (
		upgradeKey: 'storage' | 'automatedEngine',
		currentLevel: number
	): number => {
		const levels = configsState.upgradesConfig(upgradeKey)?.levels ?? {};
		return Object.entries(levels)
			.filter(([l]) => Number(l) <= currentLevel)
			.reduce((total, [, cfg]) => total + ((cfg as any).steelCost ?? 0), 0);
	};

	// --- Bonus multiplier ---
	// Applies to raw dailyProd from configs: effectiveDailyProd = dailyProd × (1 + totalBonus / 100)
	const bonusMultiplier = $derived(1 + totalBonus / 100);

	const applyBonus = (rawProd: number) => rawProd * bonusMultiplier;

	// --- Net margin per unit of output ---
	// const netMarginPerUnit = $derived(outputBestSellPrice - inputPrice * productionPoints);
	// const netMarginPerUnit = $derived(outputBestSellPrice - inputPrice * productionPoints);
	const netMarginPerUnit = $derived(wage * productionPoints);

	// --- Discount rate from steel price volatility ---
	const discountRate = $derived(
		Math.min(0.4, Math.max(0.05, Math.abs(steelPrice - baselineSteelPrice) / baselineSteelPrice))
	);

	// --- DCF core ---
	function calcDcf(
		investmentCost: number,
		dailyCashFlow: number,
		rate: number,
		maxPeriods: number
	): { npv: number; paybackDays: number | null } {
		if (dailyCashFlow <= 0 || investmentCost <= 0) {
			return { npv: -investmentCost, paybackDays: null };
		}
		let cumulative = 0;
		let paybackDays: number | null = null;
		for (let t = 1; t <= maxPeriods; t++) {
			cumulative += dailyCashFlow / Math.pow(1 + rate, t);
			if (paybackDays === null && cumulative >= investmentCost) {
				paybackDays = t;
			}
		}
		return { npv: cumulative - investmentCost, paybackDays };
	}

	// --- Engine DCF ---
	// Raw prod delta from configs, then boosted by totalBonus
	// marginalDailyFlow = (outputSellPrice - inputPrice) × (nextEffectiveProd - currentEffectiveProd)
	const engineDcf = $derived(
		(() => {
			const rawCurrentProd = getLevel('automatedEngine', engineLevel)?.stats?.dailyProd ?? 0;
			const rawNextProd = getLevel('automatedEngine', engineLevel + 1)?.stats?.dailyProd ?? 0;

			const currentDailyProd = applyBonus(rawCurrentProd);
			const nextDailyProd = applyBonus(rawNextProd);
			const prodDelta = nextDailyProd - currentDailyProd;

			const marginalDailyFlow = netMarginPerUnit * prodDelta;
			const investmentCost = getNextUpgradeSteelCost('automatedEngine', engineLevel) * steelPrice;
			const totalInvested = calculateTotalSteelInvested('automatedEngine', engineLevel);

			const byHorizon = Object.fromEntries(
				horizons.map(({ days }) => [
					days,
					calcDcf(investmentCost, marginalDailyFlow, discountRate, days)
				])
			) as Record<HorizonDays, { npv: number; paybackDays: number | null }>;

			return {
				byHorizon,
				investmentCost,
				marginalDailyFlow,
				totalSteelInvested: totalInvested,
				currentDailyProd,
				nextDailyProd,
				prodDelta,
				nextSteelCost: getNextUpgradeSteelCost('automatedEngine', engineLevel)
			};
		})()
	);

	// --- Storage DCF ---
	// Uses bonus-adjusted hourlyProd to correctly model blockage with the real effective production rate
	// --- Storage — no DCF, only capacity & blockage analysis ---
	const storageStats = $derived(
		(() => {
			const currentMax = getLevel('storage', storageLevel)?.stats?.maxProduction ?? 0;
			const nextMax = getLevel('storage', storageLevel + 1)?.stats?.maxProduction ?? 0;
			const extraCapacity = nextMax - currentMax;

			const rawDailyProd = getLevel('automatedEngine', engineLevel)?.stats?.dailyProd ?? 0;
			const effectiveDailyProd = applyBonus(rawDailyProd);
			const engineHourlyProd = effectiveDailyProd / 24;

			const workerDailyProd = $derived(workersInfos.totalDailyProduction ?? 0);
			const workerHourlyProd = workerDailyProd / 24;

			const combinedHourlyProd = engineHourlyProd + workerHourlyProd;

			function hoursToFill(maxProd: number, hourly: number): number {
				return hourly > 0 ? maxProd / hourly : Infinity;
			}

			// Engine only (baseline)
			const hoursToFillCurrentEngine = hoursToFill(currentMax, engineHourlyProd);
			const hoursToFillNextEngine = hoursToFill(nextMax, engineHourlyProd);

			// Engine + workers (worst-case fill rate scenario)
			const hoursToFillCurrentCombined = hoursToFill(currentMax, combinedHourlyProd);
			const hoursToFillNextCombined = hoursToFill(nextMax, combinedHourlyProd);

			const isBlockedEngine = hoursToFillCurrentEngine < 24;
			const isBlockedCombined = hoursToFillCurrentCombined < 24;

			const blockedHoursEngine = isBlockedEngine ? Math.max(0, 24 - hoursToFillCurrentEngine) : 0;
			const blockedUnitsPerdayEngine = engineHourlyProd * blockedHoursEngine;

			const blockedHoursCombined = isBlockedCombined
				? Math.max(0, 24 - hoursToFillCurrentCombined)
				: 0;
			const blockedUnitsPerDayCombined = combinedHourlyProd * blockedHoursCombined;

			const stillBlockedAfterEngine = hoursToFillNextEngine < 24;
			const blockedHoursAfterEngine = stillBlockedAfterEngine
				? Math.max(0, 24 - hoursToFillNextEngine)
				: 0;
			const blockedUnitsAfterEngine = engineHourlyProd * blockedHoursAfterEngine;

			const stillBlockedAfterCombined = hoursToFillNextCombined < 24;
			const blockedHoursAfterCombined = stillBlockedAfterCombined
				? Math.max(0, 24 - hoursToFillNextCombined)
				: 0;
			const blockedUnitsAfterCombined = combinedHourlyProd * blockedHoursAfterCombined;

			const nextSteelCost = getNextUpgradeSteelCost('storage', storageLevel);
			const investmentCost = nextSteelCost * steelPrice;
			const totalInvested = calculateTotalSteelInvested('storage', storageLevel);

			return {
				currentMax,
				nextMax,
				extraCapacity,
				// Engine only
				engineHourlyProd,
				effectiveDailyProd,
				hoursToFillCurrentEngine,
				hoursToFillNextEngine,
				isBlockedEngine,
				blockedHoursEngine,
				blockedUnitsPerdayEngine,
				stillBlockedAfterEngine,
				blockedHoursAfterEngine,
				blockedUnitsAfterEngine,
				// Workers
				workerDailyProd,
				workerHourlyProd,
				// Combined
				combinedHourlyProd,
				hoursToFillCurrentCombined,
				hoursToFillNextCombined,
				isBlockedCombined,
				blockedHoursCombined,
				blockedUnitsPerDayCombined,
				stillBlockedAfterCombined,
				blockedHoursAfterCombined,
				blockedUnitsAfterCombined,
				// Cost
				nextSteelCost,
				investmentCost,
				totalInvested
			};
		})()
	);

	// --- UI helpers ---
	function fmtCurrency(n: number) {
		return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
	}

	function npvLabel(npv: number) {
		if (npv > 0) return 'Profitable';
		if (npv === 0) return 'Break-even';
		return 'Underwater';
	}

	function npvVariant(npv: number): 'default' | 'destructive' | 'secondary' {
		if (npv > 0) return 'default';
		if (npv === 0) return 'secondary';
		return 'destructive';
	}

	function paybackProgress(paybackDays: number | null, horizon: number): number {
		if (paybackDays === null) return 0;
		return Math.max(2, Math.min(100, ((horizon - paybackDays) / horizon) * 100));
	}

	const engineUpgradeEntry = $derived({
		name: 'Engine',
		level: engineLevel,
		dcf: engineDcf,
		subtitle: `+${fmtCurrency(engineDcf.prodDelta)} units/day`,
		detail: `${fmtCurrency(engineDcf.currentDailyProd)} → ${fmtCurrency(engineDcf.nextDailyProd)} effective daily prod${totalBonus > 0 ? ` (+${totalBonus}% bonus)` : ''}`,
		extraDetails: [
			{ label: 'Margin/unit', value: fmtCurrency(netMarginPerUnit) },
			{
				label: 'Input cost/unit',
				value:
					inputPrice > 0
						? `${fmtCurrency(inputPrice)} × ${productionPoints} = ${fmtCurrency(inputPrice * productionPoints)}`
						: 'None'
			},
			{ label: 'Daily gain at next level', value: fmtCurrency(engineDcf.marginalDailyFlow) }
		]
	});
</script>

<Card.Root class="col-span-2 xl:col-span-1">
	<Card.Header class="pb-3">
		<div class="flex items-center justify-between">
			<div>
				<Card.Title class="flex items-center gap-1.5 text-base">
					<!-- <IconUpgrade class="h-4 w-4" /> -->
					Engine upgrade WIP
				</Card.Title>
				<Card.Description>DCF Model</Card.Description>
			</div>
			<div class="flex flex-wrap items-center gap-1.5">
				<Badge variant="outline" class="rounded px-2 py-0.5 text-xs font-medium">
					Engine Lv.{engineLevel}
				</Badge>
			</div>
		</div>

		<!-- Discount rate + margin/unit + horizon toggle -->
		<div class="mt-2 flex items-center justify-between gap-2 rounded-md bg-muted/50 px-3 py-1.5">
			<div class="flex flex-col">
				<span class="text-xs text-muted-foreground">Discount rate</span>
				<span class="text-xs font-semibold">{(discountRate * 100).toFixed(1)}% / day</span>
			</div>
			<div class="flex flex-col items-center">
				<span class="text-xs text-muted-foreground">Margin / unit</span>
				<span class="text-xs font-semibold">{fmtCurrency(netMarginPerUnit)}</span>
			</div>
			{#if totalBonus > 0}
				<div class="flex flex-col items-center">
					<span class="text-xs text-muted-foreground">Prod. bonus</span>
					<span class="text-xs font-semibold text-green-600">+{totalBonus}%</span>
				</div>
			{/if}
			<div class="flex items-center gap-0.5 rounded-md border bg-background p-0.5">
				{#each horizons as h}
					<button
						class="rounded px-2 py-0.5 text-xs font-medium transition-colors"
						class:bg-primary={selectedHorizon === h.days}
						class:text-primary-foreground={selectedHorizon === h.days}
						class:text-muted-foreground={selectedHorizon !== h.days}
						onclick={() => (selectedHorizon = h.days)}
					>
						{h.label}
					</button>
				{/each}
			</div>
		</div>
	</Card.Header>

	<Card.Content class="flex w-full flex-col gap-10 pt-0 sm:flex-row">
		{@const result = engineUpgradeEntry.dcf.byHorizon[selectedHorizon]}
		{@const progress = paybackProgress(result.paybackDays, selectedHorizon)}

		<div class="flex flex-1 flex-col gap-3">
			<!-- Title row -->
			<div class="flex items-center justify-between">
				<div class="flex flex-col">
					<span class="text-sm font-semibold">{engineUpgradeEntry.name} Upgrade</span>
					<span class="text-xs text-muted-foreground">{engineUpgradeEntry.subtitle}</span>
				</div>
				<Badge variant={npvVariant(result.npv)} class="rounded px-2 py-0.5 text-xs font-semibold">
					{npvLabel(result.npv)}
				</Badge>
			</div>

			<!-- Context detail -->
			<p class="text-xs text-muted-foreground">{engineUpgradeEntry.detail}</p>

			<!-- Extra details -->
			<div class="flex flex-wrap gap-x-4 gap-y-1">
				{#each engineUpgradeEntry.extraDetails as item}
					<p class="text-xs text-muted-foreground">
						<span class="font-medium text-foreground">{item.label}:</span>
						{item.value}
					</p>
				{/each}
			</div>

			<!-- Stats grid -->
			<div class="grid grid-cols-2 gap-2">
				<div class="rounded-md bg-muted/50 px-3 py-2">
					<p class="text-xs text-muted-foreground">Upgrade Cost</p>
					<p class="text-sm font-bold">{engineUpgradeEntry.dcf.nextSteelCost} steel</p>
					<p class="text-xs text-muted-foreground">
						≈ <span class="font-medium text-foreground">
							{fmtCurrency(engineUpgradeEntry.dcf.investmentCost)}
						</span>
					</p>
				</div>

				<div class="rounded-md bg-muted/50 px-3 py-2">
					<p class="text-xs text-muted-foreground">
						NPV
						<span class="font-medium text-foreground">
							({horizons.find((h) => h.days === selectedHorizon)?.label})
						</span>
					</p>
					<p
						class="text-sm font-bold"
						class:text-green-600={result.npv > 0}
						class:text-destructive={result.npv < 0}
					>
						{result.npv > 0 ? '+' : ''}{fmtCurrency(result.npv)}
					</p>
					<p class="text-xs text-muted-foreground">
						Daily CF: <span class="font-medium text-foreground">
							{fmtCurrency(engineUpgradeEntry.dcf.marginalDailyFlow)}
						</span>
					</p>
				</div>
			</div>

			<!-- Payback progress -->
			<div class="flex flex-col gap-1.5">
				<div class="flex items-center justify-between text-xs">
					<span class="text-muted-foreground">Payback period</span>
					<span class="font-semibold">
						{#if result.paybackDays !== null}
							{result.paybackDays} days
						{:else}
							&gt; {selectedHorizon} days
						{/if}
					</span>
				</div>
				<div class="h-1.5 w-full overflow-hidden rounded-full bg-muted">
					<div
						class="h-full rounded-full transition-all duration-500"
						class:bg-primary={result.paybackDays !== null && progress < 80}
						class:bg-green-500={result.paybackDays !== null && progress >= 80}
						class:bg-muted-foreground={result.paybackDays === null}
						style="width: {progress}%"
					></div>
				</div>
				<p class="text-xs text-muted-foreground">
					Total invested: <span class="font-medium text-foreground">
						{engineUpgradeEntry.dcf.totalSteelInvested} steel
					</span>
				</p>
			</div>
		</div>

		<!-- <Separator
			decorative={true}
			class="sm:min-h-full sm:w-px sm:data-[orientation=horizontal]:h-px sm:data-[orientation=horizontal]:w-px"
		/> -->
	</Card.Content>
</Card.Root>

<Card.Root class="col-span-2 xl:col-span-1">
	<Card.Header class="pb-3">
		<div class="flex items-center justify-between">
			<div>
				<Card.Title class="flex items-center gap-1.5 text-base">
					<!-- <IconUpgrade class="h-4 w-4" /> -->
					Storage upgrade WIP
				</Card.Title>
				<Card.Description>Storage capacity</Card.Description>
			</div>
			<div class="flex flex-wrap items-center gap-1.5">
				<Badge variant="outline" class="rounded px-2 py-0.5 text-xs font-medium">
					Storage Lv.{storageLevel}
				</Badge>
			</div>
		</div>
	</Card.Header>

	<Card.Content class="flex w-full flex-col gap-10 pt-0 sm:flex-row">
		{@const s = storageStats}

		<div class="flex flex-1 flex-col gap-3">
			<!-- Title row -->
			<div class="flex items-center justify-between">
				<div class="flex flex-col">
					<span class="text-sm font-semibold">Storage Upgrade</span>
					<span class="text-xs text-muted-foreground">+{s.extraCapacity} max capacity</span>
				</div>
				<Badge
					variant={s.isBlockedCombined
						? 'destructive'
						: s.isBlockedEngine
							? 'secondary'
							: 'outline'}
					class="rounded px-2 py-0.5 text-xs font-semibold"
				>
					{s.isBlockedCombined
						? 'Blocked w/ workers'
						: s.isBlockedEngine
							? 'Blocked (engine only)'
							: 'No blockage'}
				</Badge>
			</div>

			<!-- Capacity grid -->
			<div class="grid grid-cols-2 gap-2">
				<div class="rounded-md bg-muted/50 px-3 py-2">
					<p class="text-xs text-muted-foreground">Current capacity</p>
					<p class="text-sm font-bold">{s.currentMax} units</p>
					<p class="text-xs text-muted-foreground">
						Engine fills in <span class="font-medium text-foreground">
							{s.hoursToFillCurrentEngine === Infinity
								? '∞'
								: `${s.hoursToFillCurrentEngine.toFixed(1)}h`}
						</span>
					</p>
					{#if s.workerDailyProd > 0}
						<p class="text-xs text-muted-foreground">
							Combined fills in <span class="font-medium text-foreground">
								{s.hoursToFillCurrentCombined === Infinity
									? '∞'
									: `${s.hoursToFillCurrentCombined.toFixed(1)}h`}
							</span>
						</p>
					{/if}
				</div>

				<div class="rounded-md bg-muted/50 px-3 py-2">
					<p class="text-xs text-muted-foreground">Next capacity</p>
					<p class="text-sm font-bold">{s.nextMax} units</p>
					<p class="text-xs text-muted-foreground">
						Engine fills in <span class="font-medium text-foreground">
							{s.hoursToFillNextEngine === Infinity
								? '∞'
								: `${s.hoursToFillNextEngine.toFixed(1)}h`}
						</span>
					</p>
					{#if s.workerDailyProd > 0}
						<p class="text-xs text-muted-foreground">
							Combined fills in <span class="font-medium text-foreground">
								{s.hoursToFillNextCombined === Infinity
									? '∞'
									: `${s.hoursToFillNextCombined.toFixed(1)}h`}
							</span>
						</p>
					{/if}
				</div>
			</div>

			<!-- Worker contribution row -->
			{#if s.workerDailyProd > 0}
				<div class="rounded-md bg-muted/50 px-3 py-2">
					<p class="mb-1 text-xs font-medium text-foreground">Worker contribution</p>
					<div class="flex flex-wrap gap-x-4 gap-y-0.5">
						<p class="text-xs text-muted-foreground">
							Daily prod: <span class="font-medium text-foreground"
								>{fmtCurrency(s.workerDailyProd)} units</span
							>
						</p>
						<p class="text-xs text-muted-foreground">
							Actions/day: <span class="font-medium text-foreground"
								>{fmtCurrency(workersInfos.dailyWork)}</span
							>
						</p>
						<p class="text-xs text-muted-foreground">
							Engine: <span class="font-medium text-foreground"
								>{fmtCurrency(s.effectiveDailyProd)}/day</span
							>
						</p>
						<p class="text-xs text-muted-foreground">
							Combined: <span class="font-medium text-foreground"
								>{fmtCurrency(s.effectiveDailyProd + s.workerDailyProd)}/day</span
							>
						</p>
					</div>
				</div>
			{/if}

			<!-- Blockage detail — engine only -->
			{#if s.isBlockedEngine}
				<div class="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
					<p class="text-xs font-medium text-destructive">Engine blockage (without workers)</p>
					<p class="text-xs text-muted-foreground">
						<span class="font-medium text-foreground">{s.blockedHoursEngine.toFixed(1)}h/day</span>
						lost —
						<span class="font-medium text-foreground"
							>{fmtCurrency(s.blockedUnitsPerdayEngine)} units/day</span
						> not produced
					</p>
					{#if s.stillBlockedAfterEngine}
						<p class="mt-1 text-xs text-muted-foreground">
							After upgrade: still <span class="font-medium text-foreground"
								>{s.blockedHoursAfterEngine.toFixed(1)}h/day</span
							>
							blocked ({fmtCurrency(s.blockedUnitsAfterEngine)} units/day)
						</p>
					{:else}
						<p class="mt-1 text-xs text-green-600">Upgrade fully resolves engine blockage ✓</p>
					{/if}
				</div>
			{/if}

			<!-- Blockage detail — combined -->
			{#if s.workerDailyProd > 0 && s.isBlockedCombined}
				<div class="rounded-md border border-orange-500/30 bg-orange-500/5 px-3 py-2">
					<p class="text-xs font-medium text-orange-600">Combined blockage (engine + workers)</p>
					<p class="text-xs text-muted-foreground">
						<span class="font-medium text-foreground">{s.blockedHoursCombined.toFixed(1)}h/day</span
						>
						lost —
						<span class="font-medium text-foreground"
							>{fmtCurrency(s.blockedUnitsPerDayCombined)} units/day</span
						> not produced
					</p>
					{#if s.stillBlockedAfterCombined}
						<p class="mt-1 text-xs text-muted-foreground">
							After upgrade: still <span class="font-medium text-foreground"
								>{s.blockedHoursAfterCombined.toFixed(1)}h/day</span
							>
							blocked ({fmtCurrency(s.blockedUnitsAfterCombined)} units/day)
						</p>
					{:else}
						<p class="mt-1 text-xs text-green-600">Upgrade fully resolves combined blockage ✓</p>
					{/if}
				</div>
			{:else if s.workerDailyProd > 0 && !s.isBlockedCombined && s.isBlockedEngine}
				<p class="text-xs text-muted-foreground">
					Workers fill storage faster but don't cause additional blockage within 24h with next
					upgrade.
				</p>
			{:else if !s.isBlockedEngine}
				<p class="text-xs text-muted-foreground">
					Engine produces freely — storage fills in
					<span class="font-medium text-foreground">{s.hoursToFillCurrentEngine.toFixed(1)}h</span>
					{#if s.workerDailyProd > 0}
						(<span class="font-medium text-foreground"
							>{s.hoursToFillCurrentCombined.toFixed(1)}h</span
						> combined with workers)
					{/if}
					— no blockage within a 24h cycle.
				</p>
			{/if}

			<!-- Upgrade cost -->
			<div class="rounded-md bg-muted/50 px-3 py-2">
				<p class="text-xs text-muted-foreground">Upgrade Cost</p>
				<p class="text-sm font-bold">{s.nextSteelCost} steel</p>
				<p class="text-xs text-muted-foreground">
					≈ <span class="font-medium text-foreground">{fmtCurrency(s.investmentCost)}</span>
					<span class="ml-2">Total invested: {s.totalInvested} steel</span>
				</p>
			</div>
		</div>
	</Card.Content>
</Card.Root>
