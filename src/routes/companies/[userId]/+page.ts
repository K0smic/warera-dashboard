import type { PageLoad } from './$types';
import { getCompaniesId, batchFetch } from '$lib/services';

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

	return { companies };
};
