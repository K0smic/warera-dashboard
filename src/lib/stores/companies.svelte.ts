import { getCompaniesId } from '$lib/services/api/companies.api';

const STORAGE_KEY = 'companies';

function getCompaniesFromStorage() {
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
	companies: getCompaniesFromStorage(),
	loading: false,
	error: null as string | null
});

async function loadCompanies(userId: string) {
	if (!userId.trim()) {
		state.error = 'userId required';
		return;
	}

	state.loading = true;
	state.error = null;

	try {
		const fetchedCompanies = await getCompaniesId({ userId });
		state.companies = fetchedCompanies;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedCompanies));
	} catch (e) {
		state.error = e instanceof Error ? e.message : 'Unknown error';
		state.companies = null;
		localStorage.removeItem(STORAGE_KEY);
	} finally {
		state.loading = false;
	}
}

function reset() {
	state.error = null;
	state.companies = null;
	localStorage.removeItem(STORAGE_KEY);
}

export const companiesState = {
	get companies() {
		return state.companies;
	},
	get loading() {
		return state.loading;
	},
	get error() {
		return state.error;
	},
	loadCompanies,
	reset
};
