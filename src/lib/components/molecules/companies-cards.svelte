<script lang="ts">
	import * as Card from '$lib/components/atoms/card/index';
	import { Badge } from '$lib/components/atoms/badge';
	import { camelCaseToNormalText } from '$lib/utils';

	import type { CompanyResponse } from '$lib/types/api/schemas';
	import MdiBitcoin from '~icons/mdi/bitcoin';

	//     {
	//   "_id": "699175837456ac88335f8ee4",
	//   "user": "696f3823bcd04419d1f91460",
	//   "region": "6813b7079403bc4170a5d87c",
	//   "itemCode": "lead",
	//   "isFull": false,
	//   "name": "Piombino",
	//   "concreteInvested": 300,
	//   "production": 28.319999999999983,
	//   "activeUpgradeLevels": {
	//     "storage": 1,
	//     "automatedEngine": 3,
	//     "breakRoom": 1
	//   },
	//   "workerCount": 0,
	//   "createdAt": "2026-02-15T07:28:03.643Z",
	//   "updatedAt": "2026-02-16T13:00:36.538Z",
	//   "__v": 0,
	//   "estimatedValue": 681.7804922650128
	// }

	let company: CompanyResponse = $props();
	// $inspect(company);
</script>

<Card.Root class="@container/card">
	<!-- <Card.Header>
		<Card.Title>{company.name}</Card.Title>
		<Card.Description>
			{company.itemCode}
		</Card.Description>
	</Card.Header>
	<Card.Content></Card.Content>
	<Card.Footer></Card.Footer> -->

	<Card.Header>
		<div class="flex items-start justify-between">
			<div>
				<Card.Title class="text-lg">{company.name}</Card.Title>
				<Card.Description>
					{camelCaseToNormalText(company.itemCode)}
				</Card.Description>
			</div>

			<span
				class="rounded-full px-2 py-1 text-xs font-medium"
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
		<div class="grid grid-cols-2 gap-3 text-sm">
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
				<div class="flex items-center">
					<p class="font-semibold">
						{company.estimatedValue.toFixed(2)}
					</p>
					<MdiBitcoin class="ml-1" />
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
