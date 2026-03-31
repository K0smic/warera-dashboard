import { getGameConfig } from '$lib/services/api/configs.api';
import type {
	GameConfigResponse,
	GameConfigUpgradesConfig,
	GameConfigItemsMap,
	GameConfigProdItemsMap,
	GameConfigRawItem,
	GameConfigProductItem
} from '$lib/types/api/schemas';
import { error } from '@sveltejs/kit';
import { readStorage, writeStorage, clearStorage } from './helpers';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const CONFIGS_KEY = 'gameConfigs' as const;

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const state = $state({
	configs: readStorage<GameConfigResponse>(CONFIGS_KEY),
	configsLoading: false,
	configsError: null as string | null
});

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
async function loadConfigs(fetchFn: typeof fetch = fetch, signal?: AbortSignal): Promise<void> {
	state.configsLoading = true;
	state.configsError = null;

	try {
		const configs = await getGameConfig({}, fetchFn, signal);
		state.configs = configs;
		writeStorage(CONFIGS_KEY, configs);
	} catch (e) {
		state.configsError = e instanceof Error ? e.message : 'Unknown error';
		state.configs = null;
		clearStorage(CONFIGS_KEY);
	} finally {
		state.configsLoading = false;
	}
}

function setError(e: unknown): void {
	state.configsError = e instanceof Error ? e.message : 'Unknown error';
	state.configsLoading = false;
}

function reset(): void {
	state.configs = null;
	state.configsError = null;
	clearStorage(CONFIGS_KEY);
}

// ---------------------------------------------------------------------------
// Selectors (domain logic)
// ---------------------------------------------------------------------------
function upgradesConfig(key: keyof GameConfigUpgradesConfig) {
	return state.configs?.upgradesConfig[key];
}

function items<K extends keyof GameConfigItemsMap>(key: K) {
	return state.configs?.items[key];
}

function productibleItem<K extends keyof GameConfigProdItemsMap>(key: K) {
	if (!state.configs) throw error(404, 'state.configs is not found');

	const item = state.configs.items[key];

	if (item.type === 'raw' || item.type === 'product') {
		return item;
	}

	throw error(400, 'Item is not productible');
}

function rawItem(key: GameConfigRawItem['code']) {
	if (!state.configs) throw error(404, 'state.configs is not found');

	const item = state.configs.items[key];

	if (item.type === 'raw') {
		return item;
	}

	throw error(400, 'Item is not raw');
}

function prodItem(key: GameConfigProductItem['code']) {
	if (!state.configs) throw error(404, 'state.configs is not found');

	const item = state.configs.items[key];

	if (item.type === 'product') {
		return item;
	}

	throw error(400, 'Item is not a product');
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
export const configsState = {
	get configs() {
		return state.configs;
	},
	get configsLoading() {
		return state.configsLoading;
	},
	get configsError() {
		return state.configsError;
	},

	// convenience
	get loading() {
		return state.configsLoading;
	},
	get error() {
		return state.configsError;
	},

	loadConfigs,
	setError,
	reset,

	// domain selectors
	upgradesConfig,
	items,
	productibleItem,
	rawItem,
	prodItem
} as const;
