<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	import { getContext, setContext } from 'svelte';

	import * as Sidebar from '$lib/components/atoms/sidebar/index.js';
	import AppSidebar from '$lib/components/organisms/sidebar.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<Sidebar.Provider>
	<AppSidebar />
	<main>
		<Sidebar.Trigger />
		{@render children?.()}
	</main>
</Sidebar.Provider>
