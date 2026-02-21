<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/atoms/card';
	import { Badge } from '$lib/components/atoms/badge';
	import { Separator } from '$lib/components/atoms/separator';
	import IconUpgrade from '~icons/material-symbols/upgrade';

	interface UpgradeStats {
		totalSteelInvested: number;
		nextSteelCost: number;
		steelValue: number;
		upgradeCost: number;
	}

	interface Props {
		engineLevel: number;
		storageLevel: number;
		breakRoomLevel: number | undefined;
		engineStats: UpgradeStats;
		storageStats: UpgradeStats;
	}

	let { engineLevel, storageLevel, breakRoomLevel, engineStats, storageStats }: Props = $props();
</script>

<Card>
	<CardHeader>
		<div class="flex items-start justify-between">
			<CardTitle class="flex flex-1"><IconUpgrade class="h-5 w-5" />Upgrades</CardTitle>
			<div class="flex flex-1 grow justify-between gap-1">
				<Badge class="grow rounded-sm font-semibold">Engine: {engineLevel}</Badge>
				<Badge class="grow rounded-sm font-semibold">Storage: {storageLevel}</Badge>
				<Badge class="grow rounded-sm font-semibold">Rooms: {breakRoomLevel}</Badge>
			</div>
		</div>
		<Separator />
	</CardHeader>
	<CardContent class="grid grid-cols-1 gap-4 text-sm md:grid-cols-1">
		{#each [{ name: 'Engine Upgrade', stats: engineStats }, { name: 'Storage Upgrade', stats: storageStats }] as upgrade}
			<div class="flex flex-1 flex-col">
				<div class="text-muted-foreground">{upgrade.name}</div>
				<div class="flex flex-1 flex-row space-y-1">
					<div class="flex flex-1 flex-col">
						<div class="font-medium">
							Steel invested: {upgrade.stats.totalSteelInvested}
						</div>
						<div class="text-muted-foreground">
							Estimated value: {upgrade.stats.steelValue.toFixed(3)}
						</div>
					</div>
					<div class="flex flex-1 flex-col">
						<div class="font-medium">
							Next upgrade cost: {upgrade.stats.nextSteelCost}
						</div>
						<div class="text-muted-foreground">
							Estimated upgrade cost: {upgrade.stats.upgradeCost.toFixed(3)}
						</div>
					</div>
				</div>
			</div>
		{/each}
	</CardContent>
</Card>
