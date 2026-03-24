/**
 * Centralized icon registry.
 *
 * Maps semantic keys to unplugin-icons MDI components.
 * Import `getIcon` or `iconMap` wherever you need a dynamic icon.
 *
 * Usage:
 *   import { getIcon } from '$lib/config/icons';
 *   const Icon = getIcon('production');
 *   // → <Icon class="size-4" />
 *
 * Or use the <Icon> component directly:
 *   import Icon from '$lib/components/atoms/icon/icon.svelte';
 *   // → <Icon name="production" class="size-4" />
 */

import type { Component } from 'svelte';
// Bars
import MdiHeart from '~icons/mdi/heart';
import MdiFoodForkDrink from '~icons/mdi/food-fork-drink';
import MdiLightningBolt from '~icons/mdi/lightning-bolt';
import MdiLightbulb from '~icons/mdi/lightbulb';

// ── Economy ──────────────────────────────────────────────────────────────────
import BoxiconsCoinFilled from '~icons/boxicons/coin-filled';
import MdiPickaxe from '~icons/mdi/pickaxe';
import MdiFactory from '~icons/mdi/factory';
import MdiChartLine from '~icons/mdi/chart-line';
import MdiStorefront from '~icons/mdi/storefront';

// ── Navigation & UI ──────────────────────────────────────────────────────────
import MdiUser from '~icons/mdi/user';
import MdiUserSearch from '~icons/mdi/user-search';
import MdiSearch from '~icons/mdi/search';
import MdiHome from '~icons/mdi/home';
import MdiMap from '~icons/mdi/map';
import MdiEarth from '~icons/mdi/earth';
import MdiInformationBox from '~icons/mdi/information-box';
import MdiSettings from '~icons/mdi/settings';

// ── Actions ──────────────────────────────────────────────────────────────────
import MdiExitRun from '~icons/mdi/exit-run';
import MdiKeyVariant from '~icons/mdi/key-variant';
import MdiCompassRose from '~icons/mdi/compass-rose';
import MdiRefresh from '~icons/mdi/refresh';

// ── Military / Battle ────────────────────────────────────────────────────────
import MdiSwordCross from '~icons/mdi/sword-cross';
import MdiShield from '~icons/mdi/shield';
import MdiTrophy from '~icons/mdi/trophy';
import MdiStar from '~icons/mdi/star';
import MdiTarget from '~icons/mdi/target';

// ── Theme ────────────────────────────────────────────────────────────────────
import MdiWhiteBalanceSunny from '~icons/mdi/white-balance-sunny';
import MdiMoonAndStars from '~icons/mdi/moon-and-stars';

// ── Fallback ─────────────────────────────────────────────────────────────────
import MdiHelpCircle from '~icons/mdi/help-circle';
import MdiErrorOutline from '~icons/mdi/error-outline';

// ── Social ───────────────────────────────────────────────────────────────────
import MdiGithub from '~icons/mdi/github';

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const iconMap = {
	// Bars
	health: MdiHeart,
	hunger: MdiFoodForkDrink,
	entrepreneurship: MdiLightbulb,
	energy: MdiLightningBolt,

	// Economy
	currency: BoxiconsCoinFilled,
	production: MdiPickaxe,
	fidelity: MdiHeart,
	company: MdiFactory,
	chart: MdiChartLine,
	market: MdiStorefront,

	// Navigation & UI
	user: MdiUser,
	'user-search': MdiUserSearch,
	search: MdiSearch,
	home: MdiHome,
	map: MdiMap,
	earth: MdiEarth,
	country: MdiEarth,
	globe: MdiEarth,
	info: MdiInformationBox,
	settings: MdiSettings,
	error: MdiErrorOutline,

	// Actions
	logout: MdiExitRun,
	key: MdiKeyVariant,
	navigate: MdiCompassRose,
	refresh: MdiRefresh,

	// Military / Battle
	battle: MdiSwordCross,
	defense: MdiShield,
	ranking: MdiTrophy,
	star: MdiStar,
	target: MdiTarget,

	// Theme
	light: MdiWhiteBalanceSunny,
	dark: MdiMoonAndStars,

	// Social
	github: MdiGithub
} as const satisfies Record<string, Component>;

export type IconName = keyof typeof iconMap;

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

/**
 * Returns the icon component for the given key.
 * Falls back to a help-circle icon if the key is not found.
 *
 * @example
 * const Icon = getIcon('production');
 * // <Icon class="size-4" />
 */
export function getIcon(name: string): Component {
	return (iconMap as Record<string, Component>)[name] ?? MdiHelpCircle;
}

/**
 * Type guard — true when `name` is a recognised icon key.
 */
export function isIconName(name: string): name is IconName {
	return name in iconMap;
}
