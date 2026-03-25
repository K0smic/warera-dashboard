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

const STORAGE_KEY = 'gameConfigs';

function getFromStorage() {
	if (typeof localStorage === 'undefined') return null;
	const stored = localStorage.getItem(STORAGE_KEY);
	if (!stored) return null;
	try {
		return JSON.parse(stored);
	} catch {
		localStorage.removeItem(STORAGE_KEY);
		return null;
	}
}

// $state at module level → true singleton, one instance for the whole app
const state = $state({
	configs: getFromStorage() as GameConfigResponse | null,
	loading: false,
	error: null as string | null
});

export const configsState = {
	get configs() {
		return state.configs;
	},
	get loading() {
		return state.loading;
	},
	get error() {
		return state.error;
	},

	upgradesConfig(key: keyof GameConfigUpgradesConfig) {
		return state.configs?.upgradesConfig[key];
	},

	items<K extends keyof GameConfigItemsMap>(key: K) {
		return state.configs?.items[key];
	},

	productibleItem<K extends keyof GameConfigProdItemsMap>(key: K) {
		if (!state.configs) throw error(404, 'state.configs is not found');

		const item = state.configs.items[key];

		if (item.type === 'raw' || item.type === 'product') {
			return item;
		}

		throw error(400, 'Item is not productible');
	},

	rawItem(key: GameConfigRawItem['code']) {
		if (!state.configs) throw error(404, 'state.configs is not found');

		const item = state.configs.items[key];

		if (item.type === 'raw') {
			return item;
		}

		throw error(400, 'Item is not raw');
	},

	prodItem(key: GameConfigProductItem['code']) {
		if (!state.configs) throw error(404, 'state.configs is not found');

		const item = state.configs.items[key];

		if (item.type === 'product') {
			return item;
		}

		throw error(400, 'Item is not a product');
	},

	async loadConfigs(fetchFn: typeof fetch = fetch, signal?: AbortSignal) {
		state.loading = true;
		state.error = null;
		try {
			state.configs = await getGameConfig({}, fetchFn);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state.configs));
		} catch (e) {
			state.error = e instanceof Error ? e.message : 'Unknown error';
			state.configs = null;
			localStorage.removeItem(STORAGE_KEY);
		} finally {
			state.loading = false;
		}
	},

	reset() {
		state.configs = null;
		state.error = null;
		localStorage.removeItem(STORAGE_KEY);
	}
};
