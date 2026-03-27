<script lang="ts">
	import * as Sidebar from '$lib/components/atoms/sidebar/index.js';
	import SideHeader from '$lib/components/molecules/sidebar-header.svelte';
	import NavUser from '$lib/components/molecules/sidebar-user.svelte';
	import SideNav from '$lib/components/molecules/sidebar-nav.svelte';
	import Social from '$lib/components/molecules/sidebar-social.svelte';
	import { userState } from '$lib/stores/user.svelte';
	import { companiesState } from '$lib/stores/companies.svelte';
	import { navItems } from '$lib/config/navigation';
	import type { ComponentProps } from 'svelte';
	import { getIcon } from '$lib/config/icons';

	const companyItems = $derived(
		(companiesState.companies ?? []).map((company) => ({
			title: company.name,
			companyId: company._id,
			itemCode: company.itemCode
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
							itemCode: company.itemCode,
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

	const sideSocial = $derived([
		{
			title: 'GitHub',
			url: 'https://github.com/K0smic/warera-dashboard',
			icon: getIcon('github')
		},
		{
			title: 'War Era',
			url: 'https://app.warera.io?referrerId=696f3823bcd04419d1f91460',
			icon: getIcon('currency')
		}
	]);

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
		<Social items={sideSocial} class="mt-auto" />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser />
	</Sidebar.Footer>
</Sidebar.Root>
