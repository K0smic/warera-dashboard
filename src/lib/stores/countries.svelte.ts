import { getCountries } from '$lib/services';
import type { AllCountriesResponse, CountryResponse } from '$lib/types/api/schemas';

const COUNTRIES_KEY = 'countries';

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

function getCountryById(id: string | undefined) {
	if (!id) return undefined;
	return state.countries?.find((country: CountryResponse) => country._id === id);
}
function resetCountries() {
	state.error = null;
	state.countries = null;
	localStorage.removeItem(COUNTRIES_KEY);
}

const state = $state({
	countries: getCountriesFromStorage() as AllCountriesResponse | null,
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
	resetCountries
};
