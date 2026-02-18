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
		<main class="@container/main flex flex-1 flex-col gap-2">
			<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
				{@render children?.()}
			</div>
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
