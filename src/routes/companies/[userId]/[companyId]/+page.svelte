<script lang="ts">
	import { page } from '$app/state';

	import { usePolling } from '$lib/services';
	import CompanyDashboard from '$lib/components/organisms/company-dashboard.svelte';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	usePolling(() => `company-dashboard:${page.params.companyId}`);
</script>

<CompanyDashboard {data} />
