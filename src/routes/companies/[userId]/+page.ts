import { error } from '@sveltejs/kit';

import { batchFetch, ApiError } from '$lib/services';
import { getCompaniesId } from '$lib/services';
import { queryCache } from '$lib/stores/cache.svelte';
import { userState } from '$lib/stores/user.svelte';
import { companiesState } from '$lib/stores/companies.svelte';

import type { PageLoad } from './$types';
import type { CompanyResponse } from '$lib/types/api/schemas';

// Cache TTL — 60 seconds is a reasonable default for company list pages.
// Lower this if you add a polling interval in the component.
const CACHE_TTL_MS = 60000;

export const ssr = false;
export const prerender = false;

export const load: PageLoad = async ({ fetch, params, depends }) => {
	// Register the dependency key so that invalidate(`companies:${userId}`)
	// from any component re-runs this load without a full page reload.
	const cacheKey: `${string}:${string}` = `companies:${params.userId}`;
	depends(cacheKey);

	// ── SWR: return cached data immediately if still fresh ──────────────────
	if (!queryCache.isStale(cacheKey)) {
		const cached = queryCache.get(cacheKey);
		if (cached) return { companies: cached as CompanyResponse[] };
	}

	// ── Fetch ────────────────────────────────────────────────────────────────
	// AbortController ties every fetch in this load to the navigation lifetime.
	// If the user navigates away before the response arrives, SvelteKit calls
	// controller.abort() and all pending requests are cancelled immediately.
	const controller = new AbortController();

	try {
		const { items: ids } = await getCompaniesId(
			{ userId: params.userId },
			fetch,
			controller.signal
		);

		const companies = await batchFetch(
			ids.map((companyId) => ({
				path: 'company.getById' as const,
				input: { companyId }
			})),
			fetch,
			controller.signal
		);

		// ── Cache the result ─────────────────────────────────────────────────
		queryCache.set(cacheKey, companies, CACHE_TTL_MS);

		// ── Side-effect: sync own companies into the global store ────────────
		// Only runs when the user is viewing their own company list, not when
		// browsing another user's profile.
		if (params.userId === userState.user?._id) {
			companiesState.loadCompanies(companies);
		}

		return { companies };
	} catch (e) {
		// Navigation cancelled — SvelteKit will discard this load anyway.
		if (e instanceof DOMException && e.name === 'AbortError') {
			return { companies: [] as CompanyResponse[] };
		}

		// Typed API error — map to SvelteKit error page.
		if (e instanceof ApiError) {
			error(e.status === 404 ? 404 : 500, e.message);
		}

		// Unexpected error — let SvelteKit's error boundary handle it.
		throw e;
	}
};
