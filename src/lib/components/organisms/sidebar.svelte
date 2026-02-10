<script lang="ts">
	import * as Sidebar from '$lib/components/atoms/sidebar/index.js';
	import SideHeader from '$lib/components/molecules/sidebar-header.svelte';
	import NavUser from '$lib/components/molecules/sidebar-user.svelte';
	import { getContext } from 'svelte';

	// Sample data
	const user = {
		name: 'shadcn',
		email: 'm@example.com',
		avatar: 'https://media.warera.io/avatars/68701aa04aa54debc00634bc-1754993317506-bw41hwno.jpg'
	};
</script>

<Sidebar.Root collapsible="icon">
	<Sidebar.Header>
		<SideHeader />
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group />
		<Sidebar.Group />
	</Sidebar.Content>
	<Sidebar.Footer>
		{#if user}
			<NavUser {user} />
		{/if}
	</Sidebar.Footer>
</Sidebar.Root>
