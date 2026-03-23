import { resolve } from '$app/paths';
import type { NavItemDef } from '$lib/types/common/navigation';
import { getIcon } from './icons';

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
		title: 'Profile',
		icon: getIcon('user'),
		isActive: false,
		requiresUser: true,
		buildUrl: (userId?: string) => (userId ? resolve(`/user/${userId}`) : resolve('/'))
		// items: []
	},
	{
		title: 'Companies',
		icon: getIcon('company'),
		isActive: true,
		requiresUser: true,
		buildUrl: (userId?: string, companyId?: string) => {
			if (!companyId) {
				return userId ? resolve(`/companies/${userId}`) : resolve('/');
			}
			return userId && companyId ? resolve(`/companies/${userId}/${companyId}`) : resolve('/');
		}
	}
];
