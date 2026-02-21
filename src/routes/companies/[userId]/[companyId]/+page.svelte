<script lang="ts">
	import type { PageProps } from './$types';
	import { createGameConfigs } from '$lib/stores/configs.svelte';
	import { camelCaseToNormalText } from '$lib/utils';

	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/atoms/card';
	import { Separator } from '$lib/components/atoms/separator/index.js';
	import { Badge } from '$lib/components/atoms/badge';
	import { Progress } from '$lib/components/atoms/progress';
	import IconFactory from '~icons/mdi/factory';
	import IconChart from '~icons/mdi/chart-line';
	import MdiInformationBox from '~icons/mdi/information-box';
	import IconUpgrade from '~icons/material-symbols/upgrade';
	import MdiBitcoin from '~icons/mdi/bitcoin';
	import { createCountries } from '$lib/stores/countries.svelte';

	let { data }: PageProps = $props();
	const configsState = createGameConfigs();
	const countriesState = createCountries();

	const item = $derived(configsState.configs.items[data.company.itemCode]);

	console.log(data);

	// Max production capacity based on storage level
	const Capacity = $derived(
		Math.min(
			100,
			(data.company.production /
				configsState.configs.upgradesConfig['storage'].levels[
					data.company.activeUpgradeLevels.storage
				].stats.maxProduction) *
				100
		)
	);

	const bestBuyPrice = $derived(data.companyOrders.buyOrders[0]?.price ?? 0);

	const bestSellPrice = $derived(data.companyOrders.sellOrders[0]?.price ?? 0);

	const marketSpread = $derived(bestSellPrice - bestBuyPrice);

	// image url example
	// https://app.warera.io/images/items/lightAmmo.png?v=31

	function totalSteelInvested(upgradeKey: string, currentLevel: number) {
		const levels = configsState.configs.upgradesConfig[upgradeKey].levels;

		return Object.entries(levels)
			.filter(([level]) => Number(level) <= currentLevel)
			.reduce((total, [, cfg]) => {
				return total + (cfg.steelCost ?? 0);
			}, 0);
	}

	const totalEngineSteelInvested = $derived(
		totalSteelInvested(data.engineUpgrade.upgradeType, data.engineUpgrade.level)
	);

	const totalStorageSteelInvested = $derived(
		totalSteelInvested(data.storageUpgrade.upgradeType, data.storageUpgrade.level)
	);

	const steelPrice = $derived(data.steelOrders.sellOrders[0]?.price ?? 0);
	const concretePrice = $derived(data.concreteOrders.sellOrders[0]?.price ?? 0);

	const concreteValue = $derived(data.company.concreteInvested * concretePrice);
	const engineSteelValue = $derived(totalEngineSteelInvested * steelPrice);
	const storageSteelValue = $derived(totalStorageSteelInvested * steelPrice);

	function nextUpgradeSteelCost(upgradeKey: string, currentLevel: number) {
		return configsState.configs.upgradesConfig[upgradeKey].levels[currentLevel + 1]?.steelCost ?? 0;
	}

	const nextEngineSteelCost = $derived(
		nextUpgradeSteelCost(data.engineUpgrade.upgradeType, data.engineUpgrade.level)
	);

	const nextStorageSteelCost = $derived(
		nextUpgradeSteelCost(data.storageUpgrade.upgradeType, data.storageUpgrade.level)
	);

	const engineUpgradeCost = $derived(nextEngineSteelCost * steelPrice);
	const storageUpgradeCost = $derived(nextStorageSteelCost * steelPrice);

	if (countriesState.regions[data.company.region].deposit) {
		console.log(countriesState.regions[data.company.region].deposit);
		const currentDeposit = $derived(countriesState.regions[data.company.region].deposit);

		if (currentDeposit.startsAt) {
			const currentDepositStartsAt = new Date(currentDeposit.startsAt).toLocaleString();
		}

		if (currentDeposit.endsAt) {
			const currentDepositEndsAt = new Date(currentDeposit.endsAt).toLocaleString();
		}
	}

	// TODO: Company: Add production total market value
	const productionValue = $derived(
		(data.company.production / item.productionPoints) * bestSellPrice
	);

	// console.log(countriesState.getCountryById(countriesState.regions[data.company.region]));
	// console.log(countriesState.regions[data.company.region]);
</script>

<div class="grid gap-6 px-4">
	<!-- HEADER -->
	<div class="item-center flex justify-between">
		<div>
			<h1 class="text-3xl font-bold">{data.company.name}</h1>
			<p class="text-muted-foreground">
				{camelCaseToNormalText(item.code)} production · Region {countriesState.regions[
					data.company.region
				].name}
			</p>
		</div>

		<Badge variant="secondary">
			Estimated value: {data.company.estimatedValue.toFixed(2)}
		</Badge>
	</div>

	<!-- SUMMARY CARDS -->
	<div
		class="grid gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card"
	>
		<Card>
			<CardHeader>
				<CardTitle class="item-center flex gap-2">
					<IconFactory class="h-5 w-5" />
					Production
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div class="text-2xl font-bold">
					{data.company.production.toFixed(2)}
				</div>
				<Progress value={Capacity} class="mt-2" />
				<div class="flex items-center">
					<span>Market value: {productionValue.toFixed(3)}</span>
					<MdiBitcoin class="ml-1" />
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle class="item-center flex gap-2">
					<MdiInformationBox class="h-5 w-5" />
					<span class="flex-1">Info</span>
					<Badge title="Rarity" class="rounded-sm font-semibold"
						>{camelCaseToNormalText(item.rarity)}</Badge
					>
				</CardTitle>
			</CardHeader>
			<CardContent class="space-y-1 text-sm">
				<dl class="x-auto grid max-w-2xs grid-cols-2 text-nowrap">
					<dt>Type:</dt>
					<dd class="text-right slashed-zero tabular-nums">{camelCaseToNormalText(item.type)}</dd>

					<dt>Production points:</dt>
					<dd class="text-right slashed-zero tabular-nums">{item.productionPoints}</dd>

					<dt>Active workers:</dt>
					<dd class="text-right slashed-zero tabular-nums">{data.company.workerCount}</dd>

					{#if item.flatStats}
						{#each Object.entries(item.flatStats) as [key, value]}
							<dt>{camelCaseToNormalText(key)}:</dt>
							<dd class="text-right slashed-zero tabular-nums">{value}</dd>
						{/each}
					{/if}

					{#if item.productionNeeds}
						{#each Object.entries(item.productionNeeds) as [key, value]}
							<dt>Input:</dt>
							<dd class="text-right slashed-zero tabular-nums">
								{value}
								{camelCaseToNormalText(key)}
							</dd>
						{/each}
					{/if}
				</dl>
			</CardContent>
		</Card>
		<Card>
			<CardHeader>
				<CardTitle class="item-center flex gap-2">
					<IconChart class="h-5 w-5" />
					Market
				</CardTitle>
			</CardHeader>
			<CardContent class="space-y-1 text-sm">
				<dl class="mx-auto grid max-w-2xs grid-cols-2">
					<dt>Best Buy:</dt>
					<dd class="text-right slashed-zero tabular-nums">
						{bestBuyPrice}
					</dd>
					<dt>Best Sell:</dt>
					<dd class="text-right slashed-zero tabular-nums">
						{bestSellPrice}
					</dd>
					<dt>Spread:</dt>
					<dd
						class="text-right slashed-zero tabular-nums {marketSpread >= 0
							? 'text-green-600'
							: 'text-red-600'}"
					>
						{marketSpread.toFixed(3)}
					</dd>
				</dl>
			</CardContent>
		</Card>
	</div>
	<!-- Performance -->
	<div
		class="grid gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-2 dark:*:data-[slot=card]:bg-card"
	>
		<Card>
			<CardHeader>
				<CardTitle>Company performance</CardTitle>
			</CardHeader>
			<CardContent class="md:grid-auto-columns grid grid-cols-2 gap-4 text-sm">
				<div>
					<div class="text-muted-foreground">Strategic bonus</div>
					<div class="font-medium">
						{data.activeProductionBonus.strategicBonus}%
					</div>
				</div>
				<div>
					<div class="text-muted-foreground">Deposit bonus</div>
					<div class="font-medium">
						{data.activeProductionBonus.depositBonus}%
					</div>
				</div>
				<div>
					<div class="text-muted-foreground">Ethic deposit bonus</div>
					<div class="font-medium">
						{data.activeProductionBonus.ethicDepositBonus
							? data.activeProductionBonus.ethicDepositBonus
							: 0}%
					</div>
				</div>
				<div>
					<div class="text-muted-foreground">Ethic specialization bonus</div>
					<div class="font-medium">
						{data.activeProductionBonus.ethicSpecializationBonus
							? data.activeProductionBonus.ethicSpecializationBonus
							: 0}%
					</div>
				</div>
				<div>
					<div class="text-muted-foreground">Total production bonus</div>
					<div class="font-medium">
						{data.activeProductionBonus.total}%
					</div>
				</div>
				<div>
					<div class="text-muted-foreground">Worker taxes</div>
					<div class="font-medium">
						{countriesState.getCountryById(countriesState.regions[data.company.region].country)
							.taxes.income}%
					</div>
				</div>
				{#if typeof currentDeposit !== 'undefined' && currentDeposit.type === data.company.itemCode}
					<div>
						<div class="text-muted-foreground">Started</div>
						<div class="font-medium">
							{currentDepositStartsAt}
						</div>
					</div>
					<div>
						<div class="text-muted-foreground">Ends</div>
						<div class="font-medium">
							{currentDepositEndsAt}
						</div>
					</div>
				{/if}
				<div>
					<div class="text-muted-foreground">Concrete invested</div>
					<div class="font-medium">
						{data.company.concreteInvested}
					</div>
					<div class="text-muted-foreground">
						Estimated value: {concreteValue.toFixed(3)}
					</div>
				</div>
			</CardContent>
		</Card>
		<Card>
			<CardHeader>
				<div class="flex items-start justify-between">
					<CardTitle class="flex flex-1"><IconUpgrade class="h-5 w-5" />Upgrades</CardTitle>
					<div class="flex flex-1 grow justify-between gap-1">
						<Badge class="grow rounded-sm font-semibold"
							>Engine: {data.company.activeUpgradeLevels.automatedEngine}</Badge
						>
						<Badge class="grow rounded-sm font-semibold"
							>Storage: {data.company.activeUpgradeLevels.storage}</Badge
						>
						<Badge class="grow rounded-sm font-semibold"
							>Rooms: {data.company.activeUpgradeLevels.breakRoom}</Badge
						>
					</div>
				</div>
				<Separator />
			</CardHeader>
			<CardContent class="grid grid-cols-1 gap-4 text-sm md:grid-cols-1">
				<div class="flex flex-1 flex-col">
					<div class="text-muted-foreground">Engine Upgrade</div>
					<div class="flex flex-1 flex-row space-y-1">
						<div class="flex flex-1 flex-col">
							<div class="font-medium">
								Steel invested: {totalEngineSteelInvested}
							</div>
							<div class="text-muted-foreground">
								Estimated value: {engineSteelValue.toFixed(3)}
							</div>
						</div>
						<div class="flex flex-1 flex-col">
							<!-- <div class="text-muted-foreground">Engine Upgrade</div> -->
							<div class="font-medium">
								Next Engine upgrade cost: {nextEngineSteelCost}
							</div>
							<div class="text-muted-foreground">
								Estimated upgrade cost: {engineUpgradeCost.toFixed(3)}
							</div>
						</div>
					</div>
				</div>
				<div class="flex flex-1 flex-col">
					<div class="text-muted-foreground">Storage Upgrade</div>
					<div class="flex flex-1 flex-row space-y-1">
						<div class="flex flex-1 flex-col">
							<div class="font-medium">
								Steel invested: {totalStorageSteelInvested}
							</div>
							<div class="text-muted-foreground">
								Estimated value: {storageSteelValue.toFixed(3)}
							</div>
						</div>
						<div class="flex flex-1 flex-col">
							<!-- <div class="text-muted-foreground">Engine Upgrade</div> -->
							<div class="font-medium">
								Next Storage upgrade cost: {nextStorageSteelCost}
							</div>
							<div class="text-muted-foreground">
								Estimated upgrade cost: {storageUpgradeCost.toFixed(3)}
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
		<Card class="col-span-2">
			<CardHeader>
				<CardTitle>Best regions</CardTitle>
			</CardHeader>
			<CardContent>
				{#each data.availableProductionBonuses as availableProductionBonuses}
					{#if availableProductionBonuses.bonus >= data.activeProductionBonus.total && availableProductionBonuses.region !== data.company.region}
						<Separator />
						<div class="md:grid-auto-columns grid grid-cols-2 gap-4 text-sm">
							<div>
								<div class="text-muted-foreground">Strategic bonus</div>
								<div class="font-medium">
									{availableProductionBonuses.strategicBonus}%
								</div>
							</div>
							<div>
								<div class="text-muted-foreground">Deposit bonus</div>
								<div class="font-medium">
									{availableProductionBonuses.depositBonus}%
								</div>
							</div>
							<div>
								<div class="text-muted-foreground">Ethic deposit bonus</div>
								<div class="font-medium">
									{availableProductionBonuses.ethicDepositBonus
										? availableProductionBonuses.ethicDepositBonus
										: 0}%
								</div>
							</div>
							<div>
								<div class="text-muted-foreground">Ethic specialization bonus</div>
								<div class="font-medium">
									{availableProductionBonuses.ethicSpecializationBonus
										? availableProductionBonuses.ethicSpecializationBonus
										: 0}%
								</div>
							</div>
							<div>
								<div class="text-muted-foreground">Total production bonus</div>
								<div class="font-medium">
									{availableProductionBonuses.bonus}%
								</div>
							</div>
							<div>
								<div class="text-muted-foreground">Worker taxes</div>
								<div class="font-medium">
									{availableProductionBonuses.taxPercent}%
								</div>
							</div>
							<div>
								<div class="text-muted-foreground">Region</div>
								<div class="font-medium">
									{countriesState.regions[availableProductionBonuses.regionId].name}
								</div>
							</div>
							<div>
								<div class="text-muted-foreground">Deposit ends</div>
								<div class="font-medium">
									{#if availableProductionBonuses.depositEndAt}
										{new Date(availableProductionBonuses.depositEndAt).toLocaleString()}
									{:else}
										No end date
									{/if}
								</div>
							</div>
						</div>
						<Separator />
					{/if}
				{/each}
			</CardContent>
		</Card>
	</div>
</div>
