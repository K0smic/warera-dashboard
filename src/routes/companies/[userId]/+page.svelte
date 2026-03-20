<script lang="ts">
	import { resolve } from '$app/paths';

	import CompaniesCards from '$lib/components/molecules/companies-cards.svelte';
	import { usePolling } from '$lib/services';

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

	usePolling(() => `companies:${data.companies[0].user}`, 60000);
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
		{#each data.companies as company (company._id)}
			<a href={resolve(`/companies/${company.user}/${company._id}`)}>
				<CompaniesCards {...company} />
			</a>
		{/each}
	</div>
{/if}
