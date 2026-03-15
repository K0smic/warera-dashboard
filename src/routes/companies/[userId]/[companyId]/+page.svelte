<script lang="ts">
	import type { PageProps } from './$types';
	import CompanyDashboard from '$lib/components/organisms/company-dashboard.svelte';

	let { data }: PageProps = $props();
</script>

<CompanyDashboard {data} />
