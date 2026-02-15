<script lang="ts">
	import * as Sidebar from '$lib/components/atoms/sidebar/index.js';
	import SideHeader from '$lib/components/molecules/sidebar-header.svelte';
	import NavUser from '$lib/components/molecules/sidebar-user.svelte';
	import SideNav from '$lib/components/molecules/sidebar-nav.svelte';

	import MdiCartVariant from '~icons/mdi/cart-variant';
	import MdiIndustrial from '~icons/mdi/industrial';

	// Sample data

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
					url: '#'
				},
				{
					title: 'Wages',
					url: '#'
				}
			]
		}
	];
</script>

<Sidebar.Root collapsible="icon">
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
