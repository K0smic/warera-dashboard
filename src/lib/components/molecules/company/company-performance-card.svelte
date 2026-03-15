<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/atoms/card';
	import type { BonusLabel, DepositInfo } from '$lib/types';

	interface Props {
		bonusLabels: BonusLabel[];
		countryTaxes: number;
		depositInfo: DepositInfo | null;
		concreteInvested: number;
		concreteValue: number;
	}

	let { bonusLabels, countryTaxes, depositInfo }: Props = $props();
</script>

<Card>
	<CardHeader>
		<CardTitle>Company performance</CardTitle>
	</CardHeader>
	<CardContent class="md:grid-auto-columns grid grid-cols-2 gap-4 text-sm">
		{#each bonusLabels as { label, value }}
			<div>
				<div class="text-muted-foreground">{label}</div>
				<div class="font-medium">{value}%</div>
			</div>
		{/each}

		<div>
			<div class="text-muted-foreground">Worker taxes</div>
			<div class="font-medium">{countryTaxes}%</div>
		</div>

		{#if depositInfo}
			<div>
				<div class="text-muted-foreground">Started</div>
				<div class="font-medium">{depositInfo.startsAt}</div>
			</div>
			<div>
				<div class="text-muted-foreground">Ends</div>
				<div class="font-medium">{depositInfo.endsAt}</div>
			</div>
		{/if}
	</CardContent>
</Card>
