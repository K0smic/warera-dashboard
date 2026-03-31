import { getCompaniesId, batchFetch } from '$lib/services';
import type { CompanyResponse } from '$lib/types/api/schemas';
import { readStorage, writeStorage, clearStorage } from './helpers';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const COMPANIES_KEY = 'companies' as const;

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const state = $state({
	companies: readStorage<CompanyResponse[]>(COMPANIES_KEY),
	companiesLoading: false,
	companiesError: null as string | null
});

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
async function fetchCompanies(
	userId: string,
	fetchFn: typeof fetch = fetch,
	signal?: AbortSignal
): Promise<void> {
	if (!userId.trim()) {
		state.companiesError = 'userId required';
		return;
	}

	state.companiesLoading = true;
	state.companiesError = null;

	try {
		const fetchedCompanies = await getCompaniesId({ userId }, fetchFn, signal);

		const companies = await batchFetch(
			fetchedCompanies.items.map((companyId: string) => ({
				path: 'company.getById' as const,
				input: { companyId }
			})),
			fetchFn,
			signal
		);

		state.companies = companies;
		writeStorage(COMPANIES_KEY, companies);
	} catch (e) {
		state.companiesError = e instanceof Error ? e.message : 'Unknown error';
		state.companies = null;
		clearStorage(COMPANIES_KEY);
	} finally {
		state.companiesLoading = false;
	}
}

async function loadCompanies(companies: CompanyResponse[]): Promise<void> {
	if (!companies) {
		state.companiesError = 'Companies array required';
		return;
	}

	state.companiesLoading = true;
	state.companiesError = null;

	try {
		state.companies = companies;
		writeStorage(COMPANIES_KEY, companies);
	} catch (e) {
		state.companiesError = e instanceof Error ? e.message : 'Unknown error';
		state.companies = null;
		clearStorage(COMPANIES_KEY);
	} finally {
		state.companiesLoading = false;
	}
}

function setCompaniesError(e: unknown): void {
	state.companiesError = e instanceof Error ? e.message : 'Unknown error';
	state.companiesLoading = false;
}

function reset(): void {
	state.companies = null;
	state.companiesError = null;
	clearStorage(COMPANIES_KEY);
}

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------
export const companiesState = {
	get companies() {
		return state.companies;
	},
	get companiesLoading() {
		return state.companiesLoading;
	},
	get companiesError() {
		return state.companiesError;
	},

	// convenience
	get loading() {
		return state.companiesLoading;
	},
	get error() {
		return state.companiesError;
	},

	fetchCompanies,
	loadCompanies,
	setCompaniesError,
	reset
} as const;
