<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	import * as Sidebar from '$lib/components/atoms/sidebar/index.js';
	import AppSidebar from '$lib/components/organisms/sidebar.svelte';
	import Header from '$lib/components/molecules/header.svelte';

	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<Sidebar.Provider>
	<ModeWatcher />
	<AppSidebar />
	<Sidebar.Inset>
		<Header />
		<main>
			{@render children?.()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
