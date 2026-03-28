import { ITEM_CODES } from '$lib/config/items';
import { batchFetch, getRegions } from '$lib/services';
import type { AllRegionsResponse } from '$lib/types/api/schemas';
import type { bestBonusRegions } from '$lib/types/components/companies';

const REGIONS_KEY = 'regions';
const BONUSES_KEY = 'bonuses';

function getRegionsFromStorage() {
	if (typeof localStorage === 'undefined') return null;

	const stored = localStorage.getItem(REGIONS_KEY);
	if (!stored) return null;

	try {
		return JSON.parse(stored);
	} catch {
		localStorage.removeItem(REGIONS_KEY);
		return null;
	}
}

function getBonusesFromStorage() {
	if (typeof localStorage === 'undefined') return null;

	const stored = localStorage.getItem(BONUSES_KEY);
	if (!stored) return null;

	try {
		return JSON.parse(stored);
	} catch {
		localStorage.removeItem(BONUSES_KEY);
		return null;
	}
}

async function loadRegions(fetchFn: typeof fetch = fetch, signal?: AbortSignal) {
	state.loading = true;
	state.error = null;

	try {
		const fetchedRegions = await getRegions({}, fetchFn, signal);
		state.regions = fetchedRegions;
		localStorage.setItem(REGIONS_KEY, JSON.stringify(fetchedRegions));
	} catch (e) {
		state.error = e instanceof Error ? e.message : 'Unknown error';
		state.regions = null;
		localStorage.removeItem(REGIONS_KEY);
	} finally {
		state.loading = false;
	}
}

async function loadBonuses(fetchFn: typeof fetch = fetch, signal?: AbortSignal) {
	state.loading = true;
	state.error = null;

	try {
		const bonuses = Object.fromEntries(
			(
				await batchFetch(
					ITEM_CODES.map((itemCode) => ({
						path: 'company.getRecommendedRegionIdsByItemCode' as const,
						input: { itemCode }
					})),
					fetchFn,
					signal
				)
			).map((result, i) => [ITEM_CODES[i], result])
		) as bestBonusRegions;

		state.bonuses = bonuses;
		localStorage.setItem(BONUSES_KEY, JSON.stringify(bonuses));
	} catch (e) {
		state.error = e instanceof Error ? e.message : 'Unknown error';
		state.regions = null;
		localStorage.removeItem(BONUSES_KEY);
	} finally {
		state.loading = false;
	}
}

function resetRegions() {
	state.error = null;
	localStorage.removeItem(REGIONS_KEY);
}

function resetBonuses() {
	state.error = null;
	localStorage.removeItem(BONUSES_KEY);
}

const state = $state({
	regions: getRegionsFromStorage() as AllRegionsResponse | null,
	bonuses: getBonusesFromStorage() as bestBonusRegions | null,
	loading: false,
	error: null as string | null
});

export const regionsState = {
	get regions() {
		return state.regions;
	},
	get bonuses() {
		return state.bonuses;
	},
	get loading() {
		return state.loading;
	},
	get error() {
		return state.error;
	},
	loadRegions,
	loadBonuses,
	resetRegions,
	resetBonuses
};
