<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import favicon96 from '$lib/assets/favicon-96x96.png';
	import faviconIco from '$lib/assets/favicon.ico';
	import faviconTouch from '$lib/assets/apple-touch-icon.png';
	import manifest from '$lib/assets/site.webmanifest';

	import * as Sidebar from '$lib/components/atoms/sidebar/index.js';
	import AppSidebar from '$lib/components/organisms/sidebar.svelte';
	import Header from '$lib/components/molecules/header.svelte';

	import { ModeWatcher } from 'mode-watcher';
	import { usePolling } from '$lib/services';

	let { children } = $props();

	usePolling(['layout:configs', 'layout:countries', 'layout:regions', 'layout:bonuses'], 5 * 60000);
</script>

<svelte:head>
	<link rel="icon" type="image/png" href={favicon96} sizes="96x96" />
	<link rel="icon" href={favicon} />
	<link rel="shortcut icon" href={faviconIco} />
	<link rel="apple-touch-icon" sizes="180x180" href={faviconTouch} />
	<link rel="manifest" href={manifest} />
</svelte:head>

<Sidebar.Provider>
	<ModeWatcher />
	<AppSidebar />
	<Sidebar.Inset>
		<Header />
		<div class="@container/main flex w-full max-w-screen flex-1 flex-col gap-2">
			<div class="flex h-full w-full flex-col gap-4 p-4 md:gap-6 md:py-6 lg:px-6">
				{@render children?.()}
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
