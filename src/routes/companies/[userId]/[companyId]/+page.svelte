<script lang="ts">
	import type { PageProps } from './$types';
	import { createGameConfigs } from '$lib/stores/configs.svelte';
	import { createCountries } from '$lib/stores/countries.svelte';
	import { setContext } from 'svelte';

	import {
		CompanyHeader,
		SummaryCards,
		UpgradesCard,
		BestRegionsTable
	} from '$lib/components/molecules';
	import WorkersWidget from '$lib/components/organisms/company-workers-widget.svelte';

	let { data }: PageProps = $props();

	//DEBUG:
	$inspect(data);

	const configsState = createGameConfigs();
	const countriesState = createCountries();

	const item = $derived(configsState.configs.items[data.company.itemCode]);
	// Total price of all inputs
	const inputPrice = $derived(
		data.productionNeeds.reduce((input, obj) => obj.sell * obj.quantity + input, 0)
	);

	// ===== HELPER FUNCTIONS =====
	const getOrderPrice = (orders: any[], orderType: 'buy' | 'sell') => orders[0]?.price ?? 0;

	// ===== MARKET DATA =====
	const bestBuyPrice = $derived(getOrderPrice(data.companyOrders.buyOrders, 'buy'));
	const bestSellPrice = $derived(getOrderPrice(data.companyOrders.sellOrders, 'sell'));
	const marketSpread = $derived(bestSellPrice - bestBuyPrice);
	const steelPrice = $derived(getOrderPrice(data.steelOrders.sellOrders, 'sell'));
	const concretePrice = $derived(getOrderPrice(data.concreteOrders.sellOrders, 'sell'));

	// ===== PRODUCTION & CAPACITY =====
	const maxProduction = $derived(
		configsState.configs.upgradesConfig['storage'].levels[data.company.activeUpgradeLevels.storage]
			.stats.maxProduction
	);
	const productionCapacity = $derived(
		Math.min(100, (data.company.production / maxProduction) * 100)
	);
	const productionValue = $derived(
		(data.company.production / item.productionPoints) * bestSellPrice
	);

	// ===== INVESTMENTS & VALUES =====
	const concreteValue = $derived(data.company.concreteInvested * concretePrice);

	// ===== DEPOSIT DATA =====
	const currentDeposit = $derived(countriesState.regions[data.company.region].deposit);
	const depositInfo = $derived(
		currentDeposit && currentDeposit.type === data.company.itemCode
			? {
					startsAt: currentDeposit.startsAt
						? new Date(currentDeposit.startsAt).toLocaleString()
						: null,
					endsAt: currentDeposit.endsAt ? new Date(currentDeposit.endsAt).toLocaleString() : null
				}
			: null
	);

	// ===== SHARED DATA =====
	const countryRegion = $derived(countriesState.regions[data.company.region]);
	const countryTaxes = $derived(countriesState.getCountryById(countryRegion.country).taxes.income);

	// ===== PERFORMANCE BONUSES =====
	const bonusLabels = $derived([
		{ label: 'Strategic bonus', value: data.activeProductionBonus.strategicBonus },
		{ label: 'Deposit bonus', value: data.activeProductionBonus.depositBonus },
		{ label: 'Ethic deposit bonus', value: data.activeProductionBonus.ethicDepositBonus ?? 0 },
		{
			label: 'Ethic specialization bonus',
			value: data.activeProductionBonus.ethicSpecializationBonus ?? 0
		},
		{ label: 'Total production bonus', value: data.activeProductionBonus.total }
	]);

	let workersInfos = $state({
		totalEnergy: 0 as number,
		dailyWork: 0 as number,
		totalWages: 0 as number,
		totalDailyProduction: 0 as number
	});
	setContext('workersInfos', workersInfos);

	const engineDailyProd = $derived(
		configsState.configs.upgradesConfig['automatedEngine']?.levels[
			data.company.activeUpgradeLevels.automatedEngine
		].stats.dailyProd
	);

	/** Units of output produced per day (workers + engine, with bonus applied) */
	const dailyUnits = $derived(
		((workersInfos.totalDailyProduction + engineDailyProd) / item.productionPoints) *
			(1 + data.activeProductionBonus.total / 100)
	);

	/** Total daily expenses: worker wages + raw material cost for all units produced */
	const expenses = $derived(workersInfos.totalWages + inputPrice * dailyUnits);

	/**
	 * Estimated daily revenue from production output.
	 *   totalDailyProduction = Σ(dailyActions_i × production_i)
	 *   engineDailyProd      = flat daily production from engine/machinery
	 *   productionPoints     = units of production required per output item
	 *   activeProductionBonus = percentage bonus applied to total output
	 */
	const revenue = $derived(
		((workersInfos.totalDailyProduction + engineDailyProd) / item.productionPoints) *
			(1 + data.activeProductionBonus.total / 100) *
			bestSellPrice
	);

	/** Net daily profit: revenue minus all operational expenses. */
	const netValue = $derived(revenue - expenses);

	// ===== HELPER FUNCTIONS FOR TABLE =====
	const getCountryName = (regionId: string) =>
		countriesState.getCountryById(countriesState.regions[regionId].country).name;

	const getRegionName = (regionId: string) => countriesState.regions[regionId].name;
</script>

<div class="grid gap-6">
	<!-- HEADER -->
	<CompanyHeader
		companyName={data.company.name}
		itemCode={item.code}
		regionName={countriesState.regions[data.company.region].name}
		estimatedValue={data.company.estimatedValue}
	/>

	<!-- SUMMARY CARDS -->
	<SummaryCards
		production={data.company.production}
		{dailyUnits}
		{productionCapacity}
		{productionValue}
		{item}
		{bestBuyPrice}
		{bestSellPrice}
		{marketSpread}
		workerCount={data.company.workerCount}
		concreteInvested={data.company.concreteInvested}
		{concreteValue}
		{expenses}
		{revenue}
		{netValue}
	/>

	<!-- PERFORMANCE & UPGRADES -->
	<div
		class="grid grid-cols-2 gap-4 overflow-hidden *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-2 dark:*:data-[slot=card]:bg-card"
	>
		<!-- <CompanyPerformanceCard {bonusLabels} {countryTaxes} {depositInfo} /> -->
		<WorkersWidget
			marketPrice={bestSellPrice}
			{inputPrice}
			productionPoints={item.productionPoints}
			totalBonus={data.activeProductionBonus.total}
			workers={data.workers}
			tax={countryTaxes}
		/>

		<UpgradesCard
			engineLevel={data.company.activeUpgradeLevels.automatedEngine}
			storageLevel={data.company.activeUpgradeLevels.storage}
			breakRoomLevel={data.company.activeUpgradeLevels.breakRoom}
			engineUpgrade={data.engineUpgrade}
			storageUpgrade={data.storageUpgrade}
			productionPoints={item.productionPoints}
			{inputPrice}
			totalBonus={data.activeProductionBonus.total}
			outputBestBuyPrice={bestBuyPrice}
			outputBestSellPrice={bestSellPrice}
			outputMarketSpread={marketSpread}
			{steelPrice}
		/>

		<BestRegionsTable
			bonuses={data.availableProductionBonuses as any}
			activeProductionBonus={data.activeProductionBonus}
			currentRegion={data.company.region}
			{countryRegion}
			{countryTaxes}
			{depositInfo}
			{getCountryName}
			{getRegionName}
		/>
	</div>
</div>
