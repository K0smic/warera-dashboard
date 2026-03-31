import { ITEM_CODES } from '$lib/config/items';
import { batchFetch, getRegions } from '$lib/services';
import type { AllRegionsResponse } from '$lib/types/api/schemas';
import type { BestBonusRegions } from '$lib/types/components/companies';
import { readStorage, writeStorage, clearStorage } from './helpers';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const REGIONS_KEY = 'regions' as const;
const BONUSES_KEY = 'bonuses' as const;

// ---------------------------------------------------------------------------
// State — separate loading/error per resource to avoid cross-contamination
// ---------------------------------------------------------------------------
const state = $state({
	regions: readStorage<AllRegionsResponse>(REGIONS_KEY),
	regionsLoading: false,
	regionsError: null as string | null,

	bonuses: readStorage<BestBonusRegions>(BONUSES_KEY),
	bonusesLoading: false,
	bonusesError: null as string | null
});

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
async function loadRegions(fetchFn: typeof fetch = fetch, signal?: AbortSignal): Promise<void> {
	state.regionsLoading = true;
	state.regionsError = null;

	try {
		const regions = await getRegions({}, fetchFn, signal);
		state.regions = regions;
		writeStorage(REGIONS_KEY, regions);
	} catch (e) {
		state.regionsError = e instanceof Error ? e.message : 'Unknown error';
		state.regions = null;
		clearStorage(REGIONS_KEY);
	} finally {
		state.regionsLoading = false;
	}
}

async function loadBonuses(fetchFn: typeof fetch = fetch, signal?: AbortSignal): Promise<void> {
	state.bonusesLoading = true;
	state.bonusesError = null;

	try {
		const results = await batchFetch(
			ITEM_CODES.map((itemCode) => ({
				path: 'company.getRecommendedRegionIdsByItemCode' as const,
				input: { itemCode }
			})),
			fetchFn,
			signal
		);

		const bonuses = Object.fromEntries(
			results.map((result, i) => [ITEM_CODES[i], result])
		) as BestBonusRegions;

		state.bonuses = bonuses;
		writeStorage(BONUSES_KEY, bonuses);
	} catch (e) {
		state.bonusesError = e instanceof Error ? e.message : 'Unknown error';
		state.bonuses = null;
		clearStorage(BONUSES_KEY);
	} finally {
		state.bonusesLoading = false;
	}
}

// Exposed for fire-and-forget error handling in +layout.ts (from the plan)
function setRegionsError(e: unknown): void {
	state.regionsError = e instanceof Error ? e.message : 'Unknown error';
	state.regionsLoading = false;
}

function setBonusesError(e: unknown): void {
	state.bonusesError = e instanceof Error ? e.message : 'Unknown error';
	state.bonusesLoading = false;
}

function resetRegions(): void {
	state.regions = null;
	state.regionsError = null;
	clearStorage(REGIONS_KEY);
}

function resetBonuses(): void {
	state.bonuses = null;
	state.bonusesError = null;
	clearStorage(BONUSES_KEY);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
export const regionsState = {
	// Granular getters — prefer these in components
	get regions() {
		return state.regions;
	},
	get regionsLoading() {
		return state.regionsLoading;
	},
	get regionsError() {
		return state.regionsError;
	},

	get bonuses() {
		return state.bonuses;
	},
	get bonusesLoading() {
		return state.bonusesLoading;
	},
	get bonusesError() {
		return state.bonusesError;
	},

	// Combined convenience getters — used by +layout.svelte isBootstrapping
	get loading() {
		return state.regionsLoading || state.bonusesLoading;
	},
	get error() {
		return state.regionsError ?? state.bonusesError;
	},

	loadRegions,
	loadBonuses,
	setRegionsError,
	setBonusesError,
	resetRegions,
	resetBonuses
} as const;
