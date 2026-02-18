import { getGameConfig } from '$lib/services';

export function createGameConfigs() {
	const STORAGE_KEY = 'gameConfigs';

	function getGameConfigsFromStorage() {
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

	let state = $state({
		configs: getGameConfigsFromStorage(),
		loading: false,
		error: null as string | null
	});

	async function loadConfigs(fetchFn: typeof fetch = fetch) {
		state.loading = true;
		state.error = null;

		try {
			const fetchedConfigs = await getGameConfig({}, fetchFn);
			state.configs = fetchedConfigs;
			localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedConfigs));
		} catch (e) {
			state.error = e instanceof Error ? e.message : 'Unknown error';
			state.configs = null;
			localStorage.removeItem(STORAGE_KEY);
		} finally {
			state.loading = false;
		}
	}

	function reset() {
		state.error = null;
		state.configs = null;
		localStorage.removeItem(STORAGE_KEY);
	}

	return {
		get configs() {
			return state.configs;
		},
		get loading() {
			return state.loading;
		},
		get error() {
			return state.error;
		},
		loadConfigs,
		reset
	};
}
