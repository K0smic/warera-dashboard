<script lang="ts">
	import { page } from '$app/state';
	import type { PageProps } from './$types';

	import { usePolling } from '$lib/services';
	import CompanyDashboard from '$lib/components/organisms/company-dashboard.svelte';

	let { data }: PageProps = $props();

	$effect(() => {
		usePolling(`company-dashboard:${page.params.companyId}`);
	});
</script>

<CompanyDashboard {data} />
