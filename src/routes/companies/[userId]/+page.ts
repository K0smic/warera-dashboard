import type { PageLoad } from './$types';
import { getCompaniesId, getCompany } from '$lib/services';

export const load: PageLoad = async ({ fetch, params }) => {
	const fetchedCompanies = await getCompaniesId({ userId: params.userId }, fetch);
	const companiesIds = fetchedCompanies.items;
	const companies = await Promise.all(
		companiesIds.map((companyId) => getCompany({ companyId }, fetch))
	);

	return { companies };
};
