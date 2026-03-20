import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';

import { getUserLite } from '$lib/services';
import { ApiError } from '$lib/services';
import { queryCache } from '$lib/stores/cache.svelte';
import { userState } from '$lib/stores/user.svelte';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// User profile data includes rankings and skills that update frequently.
const CACHE_TTL_MS = 30_000;

export const ssr = false;
export const prerender = false;

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------

export const load: PageLoad = async ({ fetch, params, depends }) => {
	const { userId } = params;
	const cacheKey = `user-profile:${userId}`;

	depends(cacheKey);

	// ── Own profile: read directly from userState (already polled) ──────────
	// No extra fetch needed — userState keeps itself fresh via its own polling.
	if (userId === userState.user?._id && userState.user) {
		return { user: userState.user };
	}

	// ── SWR: return cached data if still fresh ───────────────────────────────
	if (!queryCache.isStale(cacheKey)) {
		const cached = queryCache.get(cacheKey);
		if (cached) return { user: cached };
	}

	// ── Fetch ────────────────────────────────────────────────────────────────
	const controller = new AbortController();

	try {
		const user = await getUserLite({ userId }, fetch, controller.signal);

		queryCache.set(cacheKey, user, CACHE_TTL_MS);

		return { user };
	} catch (e) {
		if (e instanceof DOMException && e.name === 'AbortError') {
			const stale = queryCache.get(cacheKey);
			if (stale) return { user: stale };
			error(503, 'Request cancelled');
		}

		if (e instanceof ApiError) {
			error(e.status === 404 ? 404 : 500, e.message);
		}

		throw e;
	}
};
