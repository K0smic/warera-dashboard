import { getCountries, getRegions } from '$lib/services';
import type {
	AllCountriesResponse,
	CountryResponse,
	AllRegionsResponse
} from '$lib/types/api/schemas';

const COUNTRIES_KEY = 'countries';
const REGIONS_KEY = 'regions';

function getCountriesFromStorage() {
	if (typeof localStorage === 'undefined') return null;

	const stored = localStorage.getItem(COUNTRIES_KEY);
	if (!stored) return null;

	try {
		return JSON.parse(stored);
	} catch {
		localStorage.removeItem(COUNTRIES_KEY);
		return null;
	}
}

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

async function loadCountries(fetchFn: typeof fetch = fetch, signal?: AbortSignal) {
	state.loading = true;
	state.error = null;

	try {
		const fetchedCountries = await getCountries({}, fetchFn);
		state.countries = fetchedCountries;
		localStorage.setItem(COUNTRIES_KEY, JSON.stringify(fetchedCountries));
	} catch (e) {
		state.error = e instanceof Error ? e.message : 'Unknown error';
		state.countries = null;
		localStorage.removeItem(COUNTRIES_KEY);
	} finally {
		state.loading = false;
	}
}

async function loadRegions(fetchFn: typeof fetch = fetch, signal?: AbortSignal) {
	state.loading = true;
	state.error = null;

	try {
		const fetchedRegions = await getRegions({}, fetchFn);
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

function getCountryById(id: string | undefined) {
	if (!id) return undefined;
	return state.countries?.find((country: CountryResponse) => country._id === id);
}
function resetCountries() {
	state.error = null;
	state.countries = null;
	localStorage.removeItem(COUNTRIES_KEY);
}
function resetRegions() {
	state.error = null;
	state.countries = null;
	localStorage.removeItem(REGIONS_KEY);
}

const state = $state({
	countries: getCountriesFromStorage() as AllCountriesResponse | null,
	regions: getRegionsFromStorage() as AllRegionsResponse | null,
	loading: false,
	error: null as string | null
});

export const countriesState = {
	get countries() {
		return state.countries;
	},
	get loading() {
		return state.loading;
	},
	get error() {
		return state.error;
	},
	loadCountries,
	getCountryById,
	resetCountries,
	resetRegions
};

export const regionsState = {
	get regions() {
		return state.regions;
	},
	get loading() {
		return state.loading;
	},
	get error() {
		return state.error;
	},
	loadRegions,
	resetCountries,
	resetRegions
};
