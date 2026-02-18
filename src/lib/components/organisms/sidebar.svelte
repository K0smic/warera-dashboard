<script lang="ts">
	import * as Sidebar from '$lib/components/atoms/sidebar/index.js';
	import SideHeader from '$lib/components/molecules/sidebar-header.svelte';
	import NavUser from '$lib/components/molecules/sidebar-user.svelte';
	import SideNav from '$lib/components/molecules/sidebar-nav.svelte';
	import { createUserState } from '$lib/stores/user.svelte';
	import type { ComponentProps } from 'svelte';

	import MdiCartVariant from '~icons/mdi/cart-variant';
	import MdiIndustrial from '~icons/mdi/industrial';

	// Sample data

	const userState = createUserState();
	let userId: string = '';
	if (userState.user) {
		userId = userState.user._id;
	}

	const sideNav = [
		{
			title: 'Market',
			url: '#',
			icon: MdiCartVariant,
			isActive: true,
			items: [
				{
					title: 'Home',
					url: '#'
				}
			]
		},
		{
			title: 'Companies',
			url: '#',
			icon: MdiIndustrial,
			isActive: true,
			items: [
				{
					title: 'Overview',
					url: '/companies/' + userId
				},
				{
					title: 'Wages',
					url: '#'
				}
			]
		}
	];

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
