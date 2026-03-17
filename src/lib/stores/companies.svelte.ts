import { getCompaniesId, batchFetch } from '$lib/services';
import type { CompanyResponse } from '$lib/types/api/schemas';

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
	companies: getCompaniesFromStorage() as CompanyResponse[] | null,
	loading: false,
	error: null as string | null
});

async function fetchCompanies(userId: string) {
	if (!userId.trim()) {
		state.error = 'userId required';
		return;
	}

	state.loading = true;
	state.error = null;

	try {
		const fetchedCompanies = await getCompaniesId({ userId });
		const companies = await batchFetch(
			fetchedCompanies.items.map((companyId: string) => ({
				path: 'company.getById',
				input: { companyId }
			}))
		);
		state.companies = companies;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
	} catch (e) {
		state.error = e instanceof Error ? e.message : 'Unknown error';
		state.companies = null;
		localStorage.removeItem(STORAGE_KEY);
	} finally {
		state.loading = false;
	}
}

async function loadCompanies(companies: CompanyResponse[]) {
	if (!companies) {
		state.error = 'Companies array required';
		return;
	}

	state.loading = true;
	state.error = null;

	try {
		state.companies = companies;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
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
	fetchCompanies,
	loadCompanies,
	reset
};
