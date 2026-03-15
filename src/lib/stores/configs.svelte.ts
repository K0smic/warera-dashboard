import { getGameConfig } from '$lib/services/api/configs.api';
import type { GameConfigResponse } from '$lib/types/api/schemas';

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

	async loadConfigs(fetchFn: typeof fetch = fetch) {
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
