<script lang="ts">
	import * as Card from '$lib/components/atoms/card/index';
	import { Badge } from '$lib/components/atoms/badge';
	import { camelCaseToNormalText } from '$lib/utils';

	import type { CompanyResponse } from '$lib/types/api/schemas';
	import Icon from '$lib/components/atoms/Icon/icon.svelte';

	let company: CompanyResponse = $props();
</script>

<Card.Root class="@container/card">
	<Card.Header>
		<div class="flex items-start justify-between">
			<div>
				<Card.Title class="flex gap-1 text-lg"><Icon name="company" />{company.name}</Card.Title>
				<Card.Description>
					{camelCaseToNormalText(company.itemCode)}
				</Card.Description>
			</div>

			<span
				class="rounded-sm px-2 py-1 text-xs font-medium"
				class:bg-green-100={!company.isFull}
				class:text-green-700={!company.isFull}
				class:bg-red-100={company.isFull}
				class:text-red-700={company.isFull}
				title="Space available"
			>
				{company.isFull ? 'Full' : 'Available'}
			</span>
		</div>
	</Card.Header>

	<Card.Content class="space-y-3">
		<div class="flex gap-3 text-sm">
			<div>
				<img
					src="https://app.warera.io/images/items/{company.itemCode}.png"
					class=" inline aspect-square w-30"
					loading="lazy"
					alt={camelCaseToNormalText(company.itemCode)}
				/>
			</div>
			<div class="grid w-full grid-cols-2">
				<div>
					<p class="text-muted-foreground">Production</p>
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
					>Engine: {company.activeUpgradeLevels.automatedEngine}/7</Badge
				>
				<Badge class="grow rounded-sm font-semibold"
					>Storage: {company.activeUpgradeLevels.storage}/7</Badge
				>
				<Badge class="grow rounded-sm font-semibold"
					>Rooms: {company.activeUpgradeLevels.breakRoom}/?</Badge
				>
			</div>
		</div>
	</Card.Content>

	<Card.Footer class="text-xs text-muted-foreground">
		Updated: {new Date(company.updatedAt).toLocaleString()}
	</Card.Footer>
</Card.Root>
