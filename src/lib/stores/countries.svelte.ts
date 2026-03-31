import { getCountries } from '$lib/services';
import type { AllCountriesResponse, CountryResponse } from '$lib/types/api/schemas';
import { readStorage, writeStorage, clearStorage } from './helpers';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const COUNTRIES_KEY = 'countries' as const;

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const state = $state({
	countries: readStorage<AllCountriesResponse>(COUNTRIES_KEY),
	countriesLoading: false,
	countriesError: null as string | null
});

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
async function loadCountries(fetchFn: typeof fetch = fetch, signal?: AbortSignal): Promise<void> {
	state.countriesLoading = true;
	state.countriesError = null;

	try {
		const countries = await getCountries({}, fetchFn, signal);
		state.countries = countries;
		writeStorage(COUNTRIES_KEY, countries);
	} catch (e) {
		state.countriesError = e instanceof Error ? e.message : 'Unknown error';
		state.countries = null;
		clearStorage(COUNTRIES_KEY);
	} finally {
		state.countriesLoading = false;
	}
}

function getCountryById(id: string | undefined): CountryResponse | undefined {
	if (!id) return undefined;
	return state.countries?.find((country) => country._id === id);
}

function setError(e: unknown): void {
	state.countriesError = e instanceof Error ? e.message : 'Unknown error';
	state.countriesLoading = false;
}

function resetCountries(): void {
	state.countries = null;
	state.countriesError = null;
	clearStorage(COUNTRIES_KEY);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
export const countriesState = {
	get countries() {
		return state.countries;
	},
	get countriesLoading() {
		return state.countriesLoading;
	},
	get countriesError() {
		return state.countriesError;
	},

	// convenience
	get loading() {
		return state.countriesLoading;
	},
	get error() {
		return state.countriesError;
	},

	loadCountries,
	getCountryById,
	setError,
	resetCountries
} as const;
