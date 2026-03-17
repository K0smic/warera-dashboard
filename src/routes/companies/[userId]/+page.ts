import type { PageLoad } from './$types';
import { getCompaniesId, batchFetch } from '$lib/services';
import { userState } from '$lib/stores/user.svelte';
import { companiesState } from '$lib/stores/companies.svelte';

export const load: PageLoad = async ({ fetch, params }) => {
	const fetchedCompanies = await getCompaniesId({ userId: params.userId }, fetch);
	const companiesIds = fetchedCompanies.items;

	const companies = await batchFetch(
		companiesIds.map((companyId) => ({
			path: 'company.getById',
			input: { companyId }
		})),
		fetch
	);

	if (params.userId === userState.user?._id) {
		companiesState.loadCompanies(companies);
	}

	return { companies };
};
