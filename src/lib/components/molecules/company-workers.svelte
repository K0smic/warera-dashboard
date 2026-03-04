<script lang="ts">
	import { getContext } from 'svelte';
	import * as Card from '$lib/components/atoms/card';
	import * as Avatar from '$lib/components/atoms/avatar';
	import Badge from '$lib/components/atoms/badge/badge.svelte';

	import MdiHeart from '~icons/mdi/heart';
	import MdiPickaxe from '~icons/mdi/pickaxe';
	import MdiLightningBolt from '~icons/mdi/lightning-bolt';
	import MdiBitcoin from '~icons/mdi/bitcoin';

	interface Props {
		workers: [any];
		tax: number;
	}

	let breakEvenWage = getContext('breakEvenWage');

	let workersInfos = getContext('workersInfos');

	let { workers, tax }: Props = $props();

	const totalEnergy = $derived(workers.reduce((acc, w) => w.userData.skills.energy.total + acc, 0));
	const totalProd = $derived(
		workers.reduce((acc, w) => w.userData.skills.production.total + acc, 0)
	);
	const totalWage = $derived(workers.reduce((acc, w) => w.wage + acc, 0));
	const dailyWork = $derived(totalEnergy * 0.24);
	const estimatedDailyWage = $derived((totalWage * totalProd * dailyWork).toFixed(2));

	$effect(() => {
		workersInfos.totalEnergy = totalEnergy;
		workersInfos.totalProd = totalProd;
	});
</script>

<Card.Root class="col-span-2 flex flex-col overflow-hidden xl:col-span-1">
	<!-- Header -->
	<Card.Header>
		<div class="flex items-start justify-between gap-2">
			<div>
				<Card.Title class="text-base">Workers</Card.Title>
				<Card.Description
					>{workers.length} active worker{workers.length !== 1 ? 's' : ''}</Card.Description
				>
			</div>
			<!-- <Badge variant="secondary" class="shrink-0 rounded-md px-2 py-1 text-xs font-semibold">
				Est. daily wage: {estimatedDailyWage}
			</Badge> -->
		</div>

		<!-- Summary stats row -->
		<div class="grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
			{#each [{ label: 'Total Wage', value: totalWage.toFixed(2) }, { label: 'Total Prod.', value: totalProd }, { label: 'Daily Work', value: dailyWork.toFixed(2) }, { label: 'Daily wages', value: estimatedDailyWage }] as stat}
				<div class="rounded-md bg-muted px-2 py-1.5">
					<p class="text-xs text-muted-foreground">{stat.label}</p>
					<p class="text-sm font-semibold">{stat.value}</p>
				</div>
			{/each}
		</div>
	</Card.Header>

	<!-- <Separator.Root /> -->

	<!-- Worker list -->
	<Card.Content class="pm-4 flex max-h-[420px] flex-col gap-2 overflow-y-auto">
		{#each workers as worker (worker._id)}
			{@const breakEvenWithFidelity = breakEvenWage.getByFidelity?.(worker.fidelity)}
			{@const isOverBreakEven = worker.wage >= breakEvenWithFidelity}
			{@const taxedWage = (worker.wage - (worker.wage * tax) / 100).toFixed(3)}

			<article
				class="flex items-center gap-3 rounded-lg bg-card p-3 transition-colors hover:bg-muted/40 {isOverBreakEven
					? 'border border-destructive'
					: 'border'}"
			>
				<Avatar.Root class="size-9 shrink-0 rounded-lg">
					<Avatar.Image
						src={worker.userData.avatarUrl}
						alt={`Avatar of ${worker.userData.username}`}
						loading="lazy"
					/>
					<Avatar.Fallback class="rounded-lg text-xs">
						{worker.userData.username?.[0]?.toUpperCase() ?? 'U'}
					</Avatar.Fallback>
				</Avatar.Root>

				<div class="flex min-w-0 flex-1 flex-col gap-1.5">
					<!-- Top row: name + wage badges -->
					<div class="flex flex-wrap items-center justify-between gap-1">
						<h3 class="truncate text-sm font-semibold">
							{worker.userData.username}
						</h3>
						<div class="flex shrink-0 gap-1">
							<Badge
								variant={isOverBreakEven ? 'destructive' : 'outline'}
								class="rounded px-1.5 py-0 text-xs"
								title="Wage"
							>
								{worker.wage.toFixed(3)}<MdiBitcoin />
							</Badge>
							<Badge variant="secondary" class="rounded px-1.5 py-0 text-xs" title="Net wage">
								-{tax}% → {taxedWage}<MdiBitcoin />
							</Badge>
						</div>
					</div>

					<!-- Bottom row: stats -->
					<div class="flex flex-row gap-2 align-middle text-xs text-muted-foreground sm:w-1/2">
						<Badge
							variant="outline"
							class="flex w-1/4 grow gap-1 rounded-sm font-medium text-foreground"
							title="Fidelity"><MdiHeart class="size-4" /> {worker.fidelity}%</Badge
						>

						<Badge
							variant="outline"
							class="flex w-1/4 grow gap-1 rounded-sm font-medium text-foreground"
							title="Production"
							><MdiPickaxe class="size-4" /> {worker.userData.skills.production.total}</Badge
						>

						<Badge
							variant="outline"
							class="flex w-1/4 grow rounded-sm font-medium text-foreground"
							title="Energy"
							><MdiLightningBolt class="size-4" /> {worker.userData.skills.energy.total}</Badge
						>
					</div>
				</div>
			</article>
		{/each}
	</Card.Content>
</Card.Root>
