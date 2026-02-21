<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/atoms/card';
	import * as Table from '$lib/components/atoms/table';
	import { Badge } from '$lib/components/atoms/badge';

	interface Props {
		bonuses: any[];
		currentTotalBonus: number;
		currentRegion: string;
		getCountryName: (countryId: string) => string;
		getRegionName: (regionId: string) => string;
	}

	let { bonuses, currentTotalBonus, currentRegion, getCountryName, getRegionName }: Props =
		$props();

	const filteredBonuses = $derived(
		bonuses.filter((b) => b.bonus >= currentTotalBonus && b.regionId !== currentRegion)
	);
</script>

<Card class="col-span-2">
	<CardHeader>
		<CardTitle>Best regions</CardTitle>
	</CardHeader>
	<CardContent>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>Region</Table.Head>
					<Table.Head>Country</Table.Head>
					<Table.Head class="text-right">Total Bonus %</Table.Head>
					<Table.Head class="text-right">Strategic %</Table.Head>
					<Table.Head class="text-right">Deposit %</Table.Head>
					<Table.Head class="text-right">Ethic Deposit %</Table.Head>
					<Table.Head class="text-right">Ethic Spec %</Table.Head>
					<Table.Head class="text-right">Taxes %</Table.Head>
					<Table.Head>Deposit Ends</Table.Head>
				</Table.Row>
			</Table.Header>

			<Table.Body>
				{#each filteredBonuses as bonus}
					<Table.Row>
						<Table.Cell class="font-medium">
							{getRegionName(bonus.regionId)}
						</Table.Cell>

						<Table.Cell class="font-medium">
							{getCountryName(bonus.regionId)}
						</Table.Cell>

						<Table.Cell class="text-right">
							<Badge variant="secondary">
								{bonus.bonus}%
							</Badge>
						</Table.Cell>

						<Table.Cell class="text-right">
							{bonus.strategicBonus}%
						</Table.Cell>

						<Table.Cell class="text-right">
							{bonus.depositBonus}%
						</Table.Cell>

						<Table.Cell class="text-right">
							{bonus.ethicDepositBonus ?? 0}%
						</Table.Cell>

						<Table.Cell class="text-right">
							{bonus.ethicSpecializationBonus ?? 0}%
						</Table.Cell>

						<Table.Cell class="text-right">
							{bonus.taxPercent}%
						</Table.Cell>

						<Table.Cell>
							{#if bonus.depositEndAt}
								{new Date(bonus.depositEndAt).toLocaleString()}
							{:else}
								<span class="text-muted-foreground">No end date</span>
							{/if}
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</CardContent>
</Card>
