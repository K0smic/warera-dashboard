/**
 * A resolved sub-item used at render time.
 */
export interface NavSubItem {
	title: string;
	url: string;
}

/**
 * A fully resolved nav item ready to be passed to SideNav.
 * The `url` is already computed — no dynamic logic left.
 */
export interface NavItem {
	title: string;
	url: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	icon?: any;
	isActive?: boolean;
	items?: NavSubItem[];
}

/**
 * Raw nav item definition stored in the config.
 * `buildUrl` is resolved at runtime with the current user id (if any).
 * `requiresUser` gates visibility when no user is logged in.
 */
export interface NavItemDef extends Omit<NavItem, 'url'> {
	requiresUser?: boolean;
	buildUrl: (userId?: string) => string;
}
