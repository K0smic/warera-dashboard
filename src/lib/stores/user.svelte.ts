import { getUserLite } from '$lib/services/api/user.api';
import { queryCache } from '$lib/stores/cache.svelte';
import type { UserLiteResponse } from '$lib/types/api/schemas';
import { companiesState } from './companies.svelte';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'user';
const CACHE_TTL_MS = 5 * 60000;
const POLL_INTERVAL_MS = 5 * 60000;

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------

function getUserFromStorage(): UserLiteResponse | null {
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

function saveUserToStorage(user: UserLiteResponse): void {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function removeUserFromStorage(): void {
	localStorage.removeItem(STORAGE_KEY);
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const state = $state({
	user: getUserFromStorage() as UserLiteResponse | null,
	loading: false,
	error: null as string | null
});

// ---------------------------------------------------------------------------
// Polling
//
// Managed internally — this store is not tied to a SvelteKit route so
// SvelteKit's invalidate/depends cannot be used here.
// The interval starts when loadUser succeeds and stops on reset().
// Visibility gating avoids wasted requests while the tab is hidden.
// ---------------------------------------------------------------------------

let pollTimer: ReturnType<typeof setInterval> | null = null;
let currentUserId: string | null = null;

function startPolling(userId: string): void {
	stopPolling();
	currentUserId = userId;

	const tick = (): void => {
		if (document.hidden) return;
		// Force a refresh by evicting the cache entry before fetching.
		queryCache.invalidate(cacheKey(userId));
		fetchUser(userId);
	};

	pollTimer = setInterval(tick, POLL_INTERVAL_MS);

	document.addEventListener('visibilitychange', onVisibilityChange);
}

function stopPolling(): void {
	if (pollTimer !== null) {
		clearInterval(pollTimer);
		pollTimer = null;
	}
	document.removeEventListener('visibilitychange', onVisibilityChange);
	currentUserId = null;
}

function onVisibilityChange(): void {
	// When the tab becomes visible again, fetch immediately instead of
	// waiting for the next interval tick — the data may be stale.
	if (!document.hidden && currentUserId) {
		queryCache.invalidate(cacheKey(currentUserId));
		fetchUser(currentUserId);
	}
}

// ---------------------------------------------------------------------------
// Cache key
// ---------------------------------------------------------------------------

const cacheKey = (userId: string): string => `user:${userId}`;

// ---------------------------------------------------------------------------
// Core fetch — shared by loadUser and the polling tick
// ---------------------------------------------------------------------------

async function fetchUser(userId: string): Promise<void> {
	state.loading = true;
	state.error = null;

	try {
		const user = await getUserLite({ userId });

		state.user = user;
		saveUserToStorage(user);
		queryCache.set(cacheKey(userId), user, CACHE_TTL_MS);
	} catch (e) {
		state.error = e instanceof Error ? e.message : 'Unknown error';
		state.user = null;
		removeUserFromStorage();
	} finally {
		state.loading = false;
	}
}

// ---------------------------------------------------------------------------
// Public actions
// ---------------------------------------------------------------------------

async function loadUser(userId: string): Promise<void> {
	if (!userId.trim()) {
		state.error = 'userId required';
		return;
	}

	// Return early if the cache is still fresh.
	if (!queryCache.isStale(cacheKey(userId))) {
		const cached = queryCache.get<UserLiteResponse>(cacheKey(userId));
		if (cached) {
			state.user = cached;
			startPolling(userId);
			return;
		}
	}

	await fetchUser(userId);

	// Start polling only after a successful first load.
	if (state.user) startPolling(userId);
}

function reset(): void {
	stopPolling();
	queryCache.invalidate(cacheKey(state.user?._id ?? ''));
	state.error = null;
	state.user = null;
	removeUserFromStorage();
	companiesState.reset();
}

// ---------------------------------------------------------------------------
// Singleton export
// ---------------------------------------------------------------------------

export const userState = {
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
