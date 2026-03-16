<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/atoms/card';
	import * as Table from '$lib/components/atoms/table';
	import { Badge } from '$lib/components/atoms/badge';

	import type { RegionData, RegionResponse } from '$lib/types/api/schemas/region';
	import type { ProductionBonusResponse } from '$lib/types/api/schemas/company';
	import type { DepositInfo } from '$lib/types';

	interface Props {
		bonuses: RegionData[];
		activeProductionBonus: ProductionBonusResponse;
		currentRegion: string;
		countryTaxes: number | null;
		countryRegion: RegionResponse | null;
		depositInfo: DepositInfo | null;
		getCountryName: (regionId: string | undefined) => string;
		getRegionName: (regionId: string | undefined) => string;
	}

	let {
		bonuses,
		activeProductionBonus,
		currentRegion,
		countryTaxes,
		countryRegion,
		depositInfo,
		getCountryName,
		getRegionName
	}: Props = $props();

	const filteredBonuses = $derived(
		bonuses.filter((b) => b.bonus >= activeProductionBonus.total && b.regionId !== currentRegion)
	);
</script>

<Card class="col-span-2 container flex w-full min-w-0 flex-col">
	<CardHeader>
		<CardTitle>Possible regions</CardTitle>
	</CardHeader>
	<CardContent class="overflow-hidden sm:max-w-screen">
		<Table.Root class="overflow-x-scroll">
			<Table.Header>
				<Table.Row>
					<Table.Head class="whitespace-nowrap">Region</Table.Head>
					<Table.Head class="whitespace-nowrap">Country</Table.Head>
					<Table.Head class="text-right whitespace-nowrap">Total Bonus %</Table.Head>
					<Table.Head class="text-right whitespace-nowrap">Strategic %</Table.Head>
					<Table.Head class="text-right whitespace-nowrap">Deposit %</Table.Head>
					<Table.Head class="text-right whitespace-nowrap">Ethic Deposit %</Table.Head>
					<Table.Head class="text-right whitespace-nowrap">Ethic Spec %</Table.Head>
					<Table.Head class="text-right whitespace-nowrap">Taxes %</Table.Head>
					<Table.Head class="whitespace-nowrap">Deposit Ends</Table.Head>
				</Table.Row>
			</Table.Header>

			<Table.Body>
				<Table.Row title="Current region" class="bg-muted/50">
					<Table.Cell class="font-medium whitespace-nowrap">
						{getRegionName(countryRegion?._id)}
					</Table.Cell>

					<Table.Cell class="font-medium whitespace-nowrap">
						{getCountryName(countryRegion?._id)}
					</Table.Cell>

					<Table.Cell class="text-right whitespace-nowrap">
						<Badge variant="secondary">
							{activeProductionBonus.total}%
						</Badge>
					</Table.Cell>

					<Table.Cell class="text-right whitespace-nowrap">
						{activeProductionBonus.strategicBonus}%
					</Table.Cell>

					<Table.Cell class="text-right whitespace-nowrap">
						{activeProductionBonus.depositBonus}%
					</Table.Cell>

					<Table.Cell class="text-right whitespace-nowrap">
						{activeProductionBonus.ethicDepositBonus ?? 0}%
					</Table.Cell>

					<Table.Cell class="text-right whitespace-nowrap">
						{activeProductionBonus.ethicSpecializationBonus ?? 0}%
					</Table.Cell>

					<Table.Cell class="text-right whitespace-nowrap">
						{countryTaxes}%
					</Table.Cell>

					<Table.Cell class="whitespace-nowrap">
						{#if depositInfo}
							{depositInfo.endsAt}
						{:else}
							<span class="text-muted-foreground">No end date</span>
						{/if}
					</Table.Cell>
				</Table.Row>

				{#each filteredBonuses as bonus (bonus.regionId)}
					<Table.Row>
						<Table.Cell class="font-medium whitespace-nowrap">
							{getRegionName(bonus.regionId)}
						</Table.Cell>

						<Table.Cell class="font-medium whitespace-nowrap">
							{getCountryName(bonus.regionId)}
						</Table.Cell>

						<Table.Cell class="text-right whitespace-nowrap">
							<Badge variant="secondary">
								{bonus.bonus}%
							</Badge>
						</Table.Cell>

						<Table.Cell class="text-right whitespace-nowrap">
							{bonus.strategicBonus}%
						</Table.Cell>

						<Table.Cell class="text-right whitespace-nowrap">
							{bonus.depositBonus}%
						</Table.Cell>

						<Table.Cell class="text-right whitespace-nowrap">
							{bonus.ethicDepositBonus ?? 0}%
						</Table.Cell>

						<Table.Cell class="text-right whitespace-nowrap">
							{bonus.ethicSpecializationBonus ?? 0}%
						</Table.Cell>

						<Table.Cell class="text-right whitespace-nowrap">
							{bonus.taxPercent}%
						</Table.Cell>

						<Table.Cell class="whitespace-nowrap">
							<span class="text-muted-foreground">No end date</span>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</CardContent>
</Card>
