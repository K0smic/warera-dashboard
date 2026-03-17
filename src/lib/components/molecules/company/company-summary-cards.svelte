<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/atoms/card';
	import { Badge } from '$lib/components/atoms/badge';
	import { Progress } from '$lib/components/atoms/progress';
	import { camelCaseToNormalText } from '$lib/utils';
	import Separator from '$lib/components/atoms/separator/separator.svelte';

	import IconFactory from '~icons/mdi/factory';
	import MdiPickaxe from '~icons/mdi/pickaxe';
	import MdiBitcoin from '~icons/mdi/bitcoin';
	import MdiInformationBox from '~icons/mdi/information-box';
	import IconChart from '~icons/mdi/chart-line';

	interface Props {
		production: number;
		dailyUnits: number;
		productionCapacity: number;
		productionValue: number;
		item: any;
		bestBuyPrice: number;
		bestSellPrice: number;
		marketSpread: number;
		workerCount: number;
		concreteInvested: number;
		concreteValue: number;
		revenue: number;
		expenses: number;
		netValue: number;
	}

	let {
		production,
		dailyUnits,
		productionCapacity,
		productionValue,
		item,
		bestBuyPrice,
		bestSellPrice,
		marketSpread,
		workerCount,
		concreteInvested,
		concreteValue,
		revenue = 0,
		expenses = 0,
		netValue = 0
	}: Props = $props();
</script>

<div
	class="grid gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card"
>
	<Card>
		<CardHeader>
			<CardTitle class="item-center flex gap-2">
				<IconFactory class="h-5 w-5" />
				Production
			</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="flex justify-between">
				<div class="flex items-center" title="Current production">
					<span class="text-2xl font-bold">{production.toFixed(2)}</span>
					<MdiPickaxe class="mt-1 ml-1" />
				</div>
				<div class="flex items-center" title="Production value">
					<span class="sr-only">Production value</span>
					<span>{productionValue.toFixed(3)}</span>
					<MdiBitcoin class="ml-1" />
				</div>
			</div>

			<Progress value={productionCapacity} class="mt-2" />

			<div class="mt-3 flex items-center justify-between rounded-md bg-muted px-2 py-1.5">
				<span class="text-xs text-muted-foreground">Est. daily output</span>
				<div class="flex items-center gap-1">
					<span class="text-sm font-semibold">{dailyUnits.toFixed(1)}</span>
					<span class="text-xs text-muted-foreground">units/day</span>
				</div>
			</div>
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle class="item-center flex gap-2">
				<IconFactory class="h-5 w-5" />
				Daily flow
			</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="grid grid-cols-1 gap-2">
				<div class="rounded-md bg-muted px-2 py-1.5 text-center text-sm">
					<p class="text-xs font-semibold text-muted-foreground">Profit/Loss</p>
					<div class="flex items-center justify-center">
						<p class="text-sm font-bold {netValue > 0 ? 'text-green-600' : 'text-destructive'}">
							{netValue > 0 ? '+' : ''}{netValue.toFixed(3)}
						</p>
						<span><MdiBitcoin class="ml-1" /></span>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-2 text-center sm:grid-cols-2">
					<div
						class="rounded-md bg-muted px-2 py-1.5 text-sm"
						title="Estimated workers and engine daily production in money"
					>
						<p class="text-xs text-muted-foreground">Revenue</p>
						<div class="flex items-center justify-center">
							<p class="text-sm font-semibold text-green-600">+{revenue.toFixed(3)}</p>
							<span><MdiBitcoin class="ml-1" /></span>
						</div>
					</div>
					<div
						class="rounded-md bg-muted px-2 py-1.5 text-sm"
						title="Estimated worker wages and input goods cost"
					>
						<p class="text-xs text-muted-foreground">Expenses</p>
						<div class="flex items-center justify-center">
							<p class="text-sm font-semibold text-destructive">
								{expenses ? '-' + expenses.toFixed(3) : 0}
							</p>
							<span><MdiBitcoin class="ml-1" /></span>
						</div>
					</div>
				</div>
			</div>
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle class="item-center flex gap-2">
				<IconChart class="h-5 w-5" />
				{camelCaseToNormalText(item.code)} market
			</CardTitle>
		</CardHeader>
		<CardContent class="space-y-1 text-sm">
			<dl class="mx-auto grid w-full grid-cols-2">
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
			<Separator />
			<dl class="mx-auto grid w-full grid-cols-2">
				<dt>Concrete invested:</dt>
				<dd class="text-right slashed-zero tabular-nums">{concreteInvested}</dd>
				<dt>Estimated value:</dt>
				<dd class="text-right slashed-zero tabular-nums">{concreteValue.toFixed(3)}</dd>
			</dl>
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
		<CardContent class="w-full space-y-1 text-sm">
			<dl class="x-auto grid w-full grid-cols-2 text-nowrap">
				<dt>Type:</dt>
				<dd class="text-right slashed-zero tabular-nums">{camelCaseToNormalText(item.type)}</dd>

				<dt>Production points:</dt>
				<dd class="text-right slashed-zero tabular-nums">{item.productionPoints}</dd>

				<dt>Active workers:</dt>
				<dd class="text-right slashed-zero tabular-nums">{workerCount}</dd>

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
</div>
