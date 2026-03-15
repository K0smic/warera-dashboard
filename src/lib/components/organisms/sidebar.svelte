<script lang="ts">
	import * as Sidebar from '$lib/components/atoms/sidebar/index.js';
	import SideHeader from '$lib/components/molecules/sidebar-header.svelte';
	import NavUser from '$lib/components/molecules/sidebar-user.svelte';
	import SideNav from '$lib/components/molecules/sidebar-nav.svelte';
	import { createUserState } from '$lib/stores/user.svelte';
	import { navItems } from '$lib/config/navigation';
	import type { ComponentProps } from 'svelte';

	const userState = createUserState();

	const sideNav = $derived(
		navItems
			.filter((item) => !item.requiresUser || userState.user)
			.map((item) => ({
				title: item.title,
				icon: item.icon,
				isActive: item.isActive,
				items: item.items,
				url: item.buildUrl(userState.user?._id)
			}))
	);

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root {collapsible} {...restProps}>
	<Sidebar.Header>
		<SideHeader />
	</Sidebar.Header>
	<Sidebar.Separator />
	<Sidebar.Content>
		<SideNav items={sideNav} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser />
	</Sidebar.Footer>
</Sidebar.Root>
