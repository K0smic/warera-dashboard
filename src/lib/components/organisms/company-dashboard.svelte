<script lang="ts">
	import { setContext } from 'svelte';

	import { WORKER_INFO_CTX, type WorkerInfoContext } from '$lib/types';
	import { configsState } from '$lib/stores/configs.svelte';
	import { createCountries } from '$lib/stores/countries.svelte';

	import {
		CompanyHeader,
		SummaryCards,
		UpgradesCard,
		BestRegionsTable
	} from '$lib/components/molecules';
	import WorkersWidget from '$lib/components/organisms/company-workers-widget.svelte';

	import type { CompanyDashboardData } from '$lib/types';

	// ---------------------------------------------------------------------------
	// Props
	// ---------------------------------------------------------------------------

	interface Props {
		data: CompanyDashboardData;
	}

	let { data }: Props = $props();

	// ---------------------------------------------------------------------------
	// Global stores
	// ---------------------------------------------------------------------------

	const countriesState = createCountries();

	// ---------------------------------------------------------------------------
	// Item config
	// ---------------------------------------------------------------------------

	const item = $derived(configsState.configs.items[data.company.itemCode]);

	// ---------------------------------------------------------------------------
	// Input cost
	// ---------------------------------------------------------------------------

	/** Total price of all production-input materials at current sell prices. */
	const inputPrice = $derived(
		data.productionNeeds.reduce((acc, need) => acc + need.sell * need.quantity, 0)
	);

	// ---------------------------------------------------------------------------
	// Market data
	// ---------------------------------------------------------------------------

	const getOrderPrice = (orders: { price: number }[]) => orders[0]?.price ?? 0;

	const bestBuyPrice = $derived(getOrderPrice(data.companyOrders.buyOrders));
	const bestSellPrice = $derived(getOrderPrice(data.companyOrders.sellOrders));
	const marketSpread = $derived(bestSellPrice - bestBuyPrice);
	const steelPrice = $derived(getOrderPrice(data.steelOrders.sellOrders));
	const concretePrice = $derived(getOrderPrice(data.concreteOrders.sellOrders));

	// ---------------------------------------------------------------------------
	// Production & capacity
	// ---------------------------------------------------------------------------

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

	// ---------------------------------------------------------------------------
	// Investments
	// ---------------------------------------------------------------------------

	const concreteValue = $derived(data.company.concreteInvested * concretePrice);

	// ---------------------------------------------------------------------------
	// Deposit info
	// ---------------------------------------------------------------------------

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

	// ---------------------------------------------------------------------------
	// Region & country
	// ---------------------------------------------------------------------------

	const countryRegion = $derived(countriesState.regions[data.company.region]);
	const countryTaxes = $derived(countriesState.getCountryById(countryRegion.country).taxes.income);

	// ---------------------------------------------------------------------------
	// Worker context
	// Initialised here so that child molecules (CompanyWorkers) can write into
	// it via $effect, and this organism can derive financials that depend on it.
	// ---------------------------------------------------------------------------

	let workersInfos = $state<WorkerInfoContext>({
		totalDailyProduction: 0,
		totalWages: 0
	});
	setContext<WorkerInfoContext>(WORKER_INFO_CTX, workersInfos);

	// ---------------------------------------------------------------------------
	// Engine output
	// ---------------------------------------------------------------------------

	const engineDailyProd = $derived(
		configsState.configs.upgradesConfig['automatedEngine']?.levels[
			data.company.activeUpgradeLevels.automatedEngine
		]?.stats.dailyProd ?? 0
	);

	// ---------------------------------------------------------------------------
	// Worker-dependent financials
	// These must live in this organism because they depend on the reactive
	// `workersInfos` state that is written to by the CompanyWorkers molecule.
	// ---------------------------------------------------------------------------

	/** Units of output produced per day (workers + engine, with bonus applied). */
	const dailyUnits = $derived(
		((workersInfos.totalDailyProduction + engineDailyProd) / item.productionPoints) *
			(1 + data.activeProductionBonus.total / 100)
	);

	/** Total daily expenses: worker wages + raw material cost for all units produced. */
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

	// ---------------------------------------------------------------------------
	// Table helpers
	// ---------------------------------------------------------------------------

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

	<!-- PERFORMANCE & UPGRADES GRID -->
	<div
		class="grid grid-cols-2 gap-4 overflow-hidden *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-2 dark:*:data-[slot=card]:bg-card"
	>
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
			bonuses={data.availableProductionBonuses}
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
