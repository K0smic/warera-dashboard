<script lang="ts">
	import * as Card from '$lib/components/atoms/card';
	import { Badge } from '$lib/components/atoms/badge';
	import { Separator } from '$lib/components/atoms/separator';
	import IconUpgrade from '~icons/material-symbols/upgrade';
	import IconEngine from '~icons/material-symbols/settings';
	import IconStorage from '~icons/material-symbols/inventory-2';

	import { createGameConfigs } from '$lib/stores/configs.svelte';

	const configsState = createGameConfigs();

	interface UpgradeStats {
		totalSteelInvested: number;
		nextSteelCost: number;
		steelValue: number;
		upgradeCost: number;
	}

	interface Props {
		engineLevel: number;
		storageLevel: number;
		breakRoomLevel: number | undefined;
		steelPrice: number;
	}

	let {
		engineLevel,
		storageLevel,
		breakRoomLevel,
		engineUpgrade,
		storageUpgrade,
		steelPrice
	}: Props = $props();

	const getNextUpgradeSteelCost = (upgradeKey: string, currentLevel: number) =>
		configsState.configs.upgradesConfig[upgradeKey].levels[currentLevel + 1]?.steelCost ?? 0;

	const calculateTotalSteelInvested = (upgradeKey: string, currentLevel: number) => {
		const levels = configsState.configs.upgradesConfig[upgradeKey].levels;
		return Object.entries(levels)
			.filter(([level]) => Number(level) <= currentLevel)
			.reduce((total, [, cfg]) => total + ((cfg as any).steelCost ?? 0), 0);
	};

	const calculateUpgradeStats = (upgrade: any, steelPrice: number) => ({
		totalSteelInvested: calculateTotalSteelInvested(upgrade.upgradeType, upgrade.level),
		nextSteelCost: getNextUpgradeSteelCost(upgrade.upgradeType, upgrade.level),
		get steelValue() {
			return this.totalSteelInvested * steelPrice;
		},
		get upgradeCost() {
			return this.nextSteelCost * steelPrice;
		}
	});

	const engineStats = $derived(calculateUpgradeStats(engineUpgrade, steelPrice));
	const storageStats = $derived(calculateUpgradeStats(storageUpgrade, steelPrice));

	function getRoi(stats: UpgradeStats): number {
		if (stats.totalSteelInvested === 0) return 0;
		return ((stats.steelValue - stats.totalSteelInvested) / stats.totalSteelInvested) * 100;
	}

	function getNextUpgradeProgress(stats: UpgradeStats): number {
		if (stats.nextSteelCost === 0) return 100;
		// How much of the next steel cost has been "earned" via current value
		return Math.min((stats.steelValue / stats.nextSteelCost) * 100, 100);
	}

	const upgrades = $derived([
		{
			name: 'Engine',
			level: engineLevel,
			stats: engineStats,
			roi: getRoi(engineStats),
			progress: getNextUpgradeProgress(engineStats)
		},
		{
			name: 'Storage',
			level: storageLevel,
			stats: storageStats,
			roi: getRoi(storageStats),
			progress: getNextUpgradeProgress(storageStats)
		}
	]);
</script>

<Card.Root class="col-span-2 xl:col-span-1">
	<Card.Header class="pb-3">
		<div class="flex items-center justify-between">
			<Card.Title class="flex items-center gap-1.5 text-base">
				<IconUpgrade class="h-4 w-4" />
				Upgrades
			</Card.Title>
			<!-- Level pills always visible -->
			<div class="flex items-center gap-1.5">
				<Badge variant="outline" class="rounded px-2 py-0.5 text-xs font-medium">
					Engine Lv.{engineLevel}
				</Badge>
				<Badge variant="outline" class="rounded px-2 py-0.5 text-xs font-medium">
					Storage Lv.{storageLevel}
				</Badge>
				{#if breakRoomLevel !== undefined}
					<Badge variant="outline" class="rounded px-2 py-0.5 text-xs font-medium">
						Rooms Lv.{breakRoomLevel}
					</Badge>
				{/if}
			</div>
		</div>
	</Card.Header>

	<Card.Content class="flex flex-col gap-4 pt-0">
		{#each upgrades as upgrade, i}
			{#if i > 0}
				<Separator />
			{/if}

			<div class="flex flex-col gap-3">
				<!-- Upgrade title row -->
				<div class="flex items-center justify-between">
					<span class="text-sm font-semibold">{upgrade.name} Upgrade</span>
					<!-- ROI badge -->
					<Badge
						variant={upgrade.roi >= 0 ? 'default' : 'destructive'}
						class="rounded px-2 py-0.5 text-xs font-semibold"
					>
						ROI {upgrade.roi >= 0 ? '+' : ''}{upgrade.roi.toFixed(1)}%
					</Badge>
				</div>

				<!-- Main stats grid -->
				<div class="grid grid-cols-2 gap-3">
					<!-- Steel invested vs value -->
					<div class="rounded-md bg-muted/50 px-3 py-2">
						<p class="text-xs text-muted-foreground">Steel Invested</p>
						<p class="text-base font-bold">{upgrade.stats.totalSteelInvested}</p>
						<p class="text-xs text-muted-foreground">
							Value:
							<span class="font-medium text-foreground">
								{upgrade.stats.steelValue.toFixed(2)}
							</span>
						</p>
					</div>

					<!-- Next upgrade cost -->
					<div class="rounded-md bg-muted/50 px-3 py-2">
						<p class="text-xs text-muted-foreground">Next Upgrade</p>
						<p class="text-base font-bold">{upgrade.stats.nextSteelCost} steel</p>
						<p class="text-xs text-muted-foreground">
							Est. cost:
							<span class="font-medium text-foreground">
								{upgrade.stats.upgradeCost.toFixed(2)}
							</span>
						</p>
					</div>
				</div>

				<!-- Progress toward next upgrade -->
				<div class="flex flex-col gap-1">
					<div class="flex justify-between text-xs text-muted-foreground">
						<span>Progress to next upgrade</span>
						<span>{upgrade.progress.toFixed(0)}%</span>
					</div>
					<div class="h-1.5 w-full overflow-hidden rounded-full bg-muted">
						<div
							class="h-full rounded-full transition-all"
							class:bg-primary={upgrade.progress < 100}
							class:bg-green-500={upgrade.progress >= 100}
							style="width: {upgrade.progress}%"
						></div>
					</div>
				</div>
			</div>
		{/each}
	</Card.Content>
</Card.Root>
