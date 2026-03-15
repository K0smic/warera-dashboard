import { resolve } from '$app/paths';
import MdiIndustrial from '~icons/mdi/industrial';
import type { NavItemDef } from '$lib/types/common/navigation';

/**
 * Central definition of every sidebar navigation item.
 *
 * Add new routes here — the sidebar organism resolves URLs and
 * applies user-visibility filtering automatically.
 *
 * @example
 * {
 *   title: 'Battles',
 *   icon: MdiSword,
 *   requiresUser: false,          // visible even when logged out
 *   buildUrl: () => resolve('/battles'),
 * }
 */
export const navItems: NavItemDef[] = [
	{
		title: 'Companies',
		icon: MdiIndustrial,
		isActive: true,
		requiresUser: true,
		buildUrl: (userId) => (userId ? resolve(`/companies/${userId}`) : resolve('/'))
		// items: [
		// 	{
		// 		title: 'Overview',
		// 		url: '#'
		// 	}
		// ]
	}
];
