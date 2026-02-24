<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/atoms/card';
	import { Badge } from '$lib/components/atoms/badge';
	import { Progress } from '$lib/components/atoms/progress';
	import IconFactory from '~icons/mdi/factory';
	import IconChart from '~icons/mdi/chart-line';
	import MdiInformationBox from '~icons/mdi/information-box';
	import MdiBitcoin from '~icons/mdi/bitcoin';
	import { camelCaseToNormalText } from '$lib/utils';
	import Separator from '../atoms/separator/separator.svelte';

	interface Props {
		production: number;
		productionCapacity: number;
		productionValue: number;
		item: any;
		bestBuyPrice: number;
		bestSellPrice: number;
		marketSpread: number;
		workerCount: number;
		concreteInvested: number;
		concreteValue: number;
	}

	let {
		production,
		productionCapacity,
		productionValue,
		item,
		bestBuyPrice,
		bestSellPrice,
		marketSpread,
		workerCount,
		concreteInvested,
		concreteValue
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
			<div class="text-2xl font-bold">
				{production.toFixed(2)}
			</div>
			<Progress value={productionCapacity} class="mt-2" />
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

	<Card>
		<CardHeader>
			<CardTitle class="item-center flex gap-2">
				<IconChart class="h-5 w-5" />
				{camelCaseToNormalText(item.code)} market
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
			<Separator />
			<dl class="mx-auto grid max-w-2xs grid-cols-2">
				<dt>Concrete invested:</dt>
				<dd class="text-right slashed-zero tabular-nums">{concreteInvested}</dd>
				<dt>Estimated value:</dt>
				<dd class="text-right slashed-zero tabular-nums">{concreteValue.toFixed(3)}</dd>
			</dl>
		</CardContent>
	</Card>
</div>
