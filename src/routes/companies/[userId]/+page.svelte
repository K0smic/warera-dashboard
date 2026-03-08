<script lang="ts">
	import { goto } from '$app/navigation';
	import CompaniesCards from '$lib/components/molecules/companies-cards.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div
	class="grid gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-3 dark:*:data-[slot=card]:bg-card"
>
	{#each data.companies as company}
		<a
			href="/companies/{company.user}/{company._id}"
			onclick={(e) => {
				e.preventDefault();
				goto(`/companies/${company.user}/${company._id}`);
			}}
		>
			<CompaniesCards {...company} />
		</a>
	{/each}
</div>
