<script lang="ts">
	import * as Card from '$lib/components/atoms/card/index';
	import { Badge } from '$lib/components/atoms/badge';
	import { camelCaseToNormalText } from '$lib/utils';
	import Icon from '$lib/components/atoms/icon/icon.svelte';
	import { resolve } from '$app/paths';
	import { configsState } from '$lib/stores/configs.svelte';
	import { error } from '@sveltejs/kit';
	import ItemsImages from '$lib/components/atoms/items-images/items-images.svelte';

	import type { bestBonusRegions, CompanyWithBonus } from '$lib/types/components/companies';

	interface Props {
		companies: CompanyWithBonus[];
		bestRegions: bestBonusRegions;
	}

	let { companies, bestRegions }: Props = $props();

	function maxUpgradeLvl(upgrade: 'automatedEngine' | 'storage'): number {
		const levels = configsState.upgradesConfig(upgrade)?.levels;

		if (!levels) throw error(404, 'configsState not found');

		const maxLevel = Object.keys(levels).reduce(function (a, b) {
			return levels[a] > levels[b] ? a : b;
		});

		const maxUpgrade = configsState.upgradesConfig(upgrade)?.levels[Number(maxLevel)].level;

		if (!maxUpgrade) throw error(404, 'configsState not found');
		return maxUpgrade;
	}

	const engineUpgrade = maxUpgradeLvl('automatedEngine');
	const storageUpgrade = maxUpgradeLvl('storage');
</script>

{#each companies as company (company._id)}
	{@const itemBestBonus = bestRegions[company.itemCode]}
	{@const filteredBonuses = itemBestBonus.filter(
		(b) => b.bonus > company.productionBonus.total && b.regionId !== company.region
	)}
	<a href={resolve(`/companies/${company.user}/${company._id}`)}>
		<Card.Root class="@container/card">
			<Card.Header>
				<div class="flex items-start justify-between">
					<div>
						<Card.Title class="flex gap-1 text-lg"><Icon name="company" />{company.name}</Card.Title
						>
						<Card.Description>
							{camelCaseToNormalText(company.itemCode)}
						</Card.Description>
					</div>
					<Badge
						variant="outline"
						class="text mt-1 rounded-sm {filteredBonuses.length > 0
							? 'border-destructive'
							: 'border-green-100'}"
						title={filteredBonuses.length > 0 ? 'Better bonus found' : 'Max bonus'}
					>
						{filteredBonuses.length > 0
							? `${company.productionBonus.total}% < ${filteredBonuses[0].bonus}%`
							: company.productionBonus.total + '%'}
					</Badge>
				</div>
			</Card.Header>

			<Card.Content class="space-y-3">
				<div class="flex gap-3 text-sm">
					<div class="rounded-lg bg-muted/50">
						<!-- <img
							src="https://app.warera.io/images/items/{company.itemCode}.png"
							class=" inline aspect-square w-30"
							loading="lazy"
							alt={camelCaseToNormalText(company.itemCode)}
						/> -->
						<ItemsImages
							item={company.itemCode}
							alt={camelCaseToNormalText(company.itemCode)}
							class=" inline aspect-square w-30"
							loading="lazy"
						/>
					</div>
					<div class="grid w-full grid-cols-2">
						<div>
							<p class="text-muted-foreground">Stock production</p>
							<p class="font-semibold">{company.production.toFixed(2)}</p>
						</div>

						<div>
							<p class="text-muted-foreground">Workers</p>
							<p class="font-semibold">{company.workerCount}</p>
						</div>

						<div>
							<p class="text-muted-foreground">Concrete Invested</p>
							<p class="font-semibold">{company.concreteInvested}</p>
						</div>

						<div>
							<p class="text-muted-foreground">Estimated Value</p>
							<div class="flex items-center gap-1">
								<p class="font-semibold">
									{company.estimatedValue.toFixed(2)}
								</p>
								<Icon name="currency" />
							</div>
						</div>
					</div>
				</div>

				<div class="border-t pt-3">
					<p class="mb-2 text-sm font-medium">Upgrades</p>
					<div class="flex justify-between gap-1">
						<Badge class="grow rounded-sm font-semibold"
							>Engine: {company.activeUpgradeLevels.automatedEngine}/{engineUpgrade}</Badge
						>
						<Badge class="grow rounded-sm font-semibold"
							>Storage: {company.activeUpgradeLevels.storage}/{storageUpgrade}</Badge
						>
						<!-- <Badge class="grow rounded-sm font-semibold"
							>Rooms: {company.activeUpgradeLevels.breakRoom}/?</Badge
						> -->
					</div>
				</div>
			</Card.Content>

			<Card.Footer class="text-xs text-muted-foreground">
				Updated: {new Date(company.updatedAt).toLocaleString()}
			</Card.Footer>
		</Card.Root>
	</a>
{/each}
