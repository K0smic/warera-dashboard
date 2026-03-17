<script lang="ts">
	import * as Sidebar from '$lib/components/atoms/sidebar/index.js';
	import SideHeader from '$lib/components/molecules/sidebar-header.svelte';
	import NavUser from '$lib/components/molecules/sidebar-user.svelte';
	import SideNav from '$lib/components/molecules/sidebar-nav.svelte';
	import { userState } from '$lib/stores/user.svelte';
	import { companiesState } from '$lib/stores/companies.svelte';
	import { navItems } from '$lib/config/navigation';
	import type { ComponentProps } from 'svelte';

	const companyItems = $derived(
		(companiesState.companies ?? []).map((company) => ({
			title: company.name,
			companyId: company._id
		}))
	);

	const sideNav = $derived(
		navItems
			.filter((item) => !item.requiresUser || userState.user)
			.map((item) => {
				const base = {
					title: item.title,
					icon: item.icon,
					isActive: item.isActive,
					url: item.buildUrl(userState.user?._id)
				};

				if (item.title === 'Companies') {
					return {
						...base,
						items: companyItems.map((company) => ({
							id: company.companyId,
							title: company.title,
							url: item.buildUrl(userState.user?._id, company.companyId)
						}))
					};
				}

				return {
					...base,
					items: item.items?.map((sub) => ({
						id: sub.id,
						title: sub.title,
						url: sub.buildUrl(userState.user?._id)
					}))
				};
			})
	);

	let {
		ref = $bindable(null),
		collapsible = 'icon',
		variant = 'sidebar',
		...restProps
	}: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root {collapsible} {variant} {...restProps}>
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
