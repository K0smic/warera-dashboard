<script lang="ts">
	import CompaniesCards from '$lib/components/molecules/companies/companies-cards.svelte';
	import CompaniesSummary from '$lib/components/molecules/companies/companies-summary.svelte';
	import { usePolling } from '$lib/services';

	import { regionsState } from '$lib/stores/regions.svelte';
	import { error } from '@sveltejs/kit';

	import type { PageProps } from './$types';

	// ---------------------------------------------------------------------------
	// Props
	// ---------------------------------------------------------------------------

	let { data }: PageProps = $props();

	// ---------------------------------------------------------------------------
	// Polling
	//
	// On adapter-static there is no websocket or SSE support, so we poll.
	// The interval only runs when the tab is visible — no wasted requests
	// while the user is looking at something else.
	//
	// invalidate() re-runs the load function (which has SWR caching) without
	// unmounting the component, so the UI never flashes.
	// ---------------------------------------------------------------------------
	$effect(() => {
		const userId = data.companies[0]?.user;
		if (userId) usePolling(`companies:${userId}`, 60_000);
	});

	const bestRegions = $derived(
		regionsState.bonuses ? regionsState.bonuses : error(404, 'regionsState not found in companies')
	);
</script>

<!-- ── List ──────────────────────────────────────────────────────────────── -->

{#if data.companies.length === 0}
	<div class="flex min-h-[40vh] flex-col items-center justify-center gap-2 text-muted-foreground">
		<p class="text-sm">No companies found.</p>
	</div>
{:else}
	<div
		class="grid gap-4
		       *:data-[slot=card]:bg-linear-to-t
		       *:data-[slot=card]:from-primary/5
		       *:data-[slot=card]:to-card
		       *:data-[slot=card]:shadow-xs
		       @xl/main:grid-cols-2
		       @5xl/main:grid-cols-3
		       dark:*:data-[slot=card]:bg-card"
	>
		<!-- <CompaniesSummary /> -->
		<CompaniesCards companies={data.companies} {bestRegions} />
	</div>
{/if}
