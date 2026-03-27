/**
 * A resolved sub-item used at render time.
 */
export interface NavSubItem {
	id: string;
	title: string;
	itemCode?: string;
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
	items?: NavSubItem[] | [];
}

export interface NavSubItemDef {
	id: string;
	title: string;
	itemCode?: string;
	buildUrl: (userId?: string, companyId?: string) => string;
}

export interface NavItemDef {
	title: string;
	icon?: any;
	isActive?: boolean;
	requiresUser?: boolean;
	buildUrl: (userId?: string, companyId?: string) => string;
	items?: NavSubItemDef[];
}
