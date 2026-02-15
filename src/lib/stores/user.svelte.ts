import { getUserLite } from '$lib/services/api/user.api';

export function createUserState() {
	const STORAGE_KEY = 'user';

	function getUserFromStorage() {
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
		user: getUserFromStorage(),
		loading: false,
		error: null as string | null
	});

	async function loadUser(userId: string) {
		if (!userId.trim()) {
			state.error = 'userId required';
			return;
		}

		state.loading = true;
		state.error = null;

		try {
			const fetchedUser = await getUserLite({ userId });
			state.user = fetchedUser;
			localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedUser));
		} catch (e) {
			state.error = e instanceof Error ? e.message : 'Unknown error';
			state.user = null;
			localStorage.removeItem(STORAGE_KEY);
		} finally {
			state.loading = false;
		}
	}

	function reset() {
		state.error = null;
		state.user = null;
		localStorage.removeItem(STORAGE_KEY);
	}

	return {
		get user() {
			return state.user;
		},
		get loading() {
			return state.loading;
		},
		get error() {
			return state.error;
		},
		loadUser,
		reset
	};
}
