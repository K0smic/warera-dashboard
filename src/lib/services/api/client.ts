import type {
	EndpointPath,
	EndpointInput,
	EndpointOutput,
	BatchOutput
} from '$lib/types/api/registry';

const BASE_URL = 'https://api2.warera.io/trpc';

// ---------------------------------------------------------------------------
// Single fetch — fully typed via registry
// ---------------------------------------------------------------------------

/**
 * Typed tRPC GET fetch.
 * Input and output types are inferred automatically from the registry.
 *
 * @example
 * const company = await trpcFetch('company.getById', { companyId: '123' });
 * //    ^? CompanyResponse  ← IDE shows full shape on hover
 */
export async function trpcFetch<P extends EndpointPath>(
	path: P,
	input: EndpointInput<P>,
	fetchFn: typeof fetch = fetch
): Promise<EndpointOutput<P>> {
	const url = new URL(`${BASE_URL}/${path}`);
	url.searchParams.set('input', JSON.stringify(input));

	const res = await fetchFn(url.toString(), {
		method: 'GET',
		headers: { accept: 'application/json' }
	});

	if (!res.ok) {
		throw new Error(`API error ${res.status}: ${await res.text()}`);
	}

	const json = await res.json();
	return json.result?.data ?? json;
}

// ---------------------------------------------------------------------------
// Batch fetch — tuple output inferred from path array
// ---------------------------------------------------------------------------

type BatchRequest<P extends EndpointPath> = {
	path: P;
	input: EndpointInput<P>;
};

/**
 * Typed tRPC batch fetch.
 * Pass a `const` array of requests and get back a typed tuple.
 *
 * @example
 * const [company, region] = await trpcBatchFetch([
 *   { path: 'company.getById',  input: { companyId: '123' } },
 *   { path: 'region.getById',   input: { regionId: '456' } },
 * ] as const);
 * //  company ^? CompanyResponse
 * //  region  ^? RegionResponse
 */
export async function trpcBatchFetch<
	const Requests extends ReadonlyArray<BatchRequest<EndpointPath>>
>(
	requests: Requests,
	fetchFn: typeof fetch = fetch
): Promise<BatchOutput<{ [K in keyof Requests]: Requests[K]['path'] }>> {
	const paths = requests.map((r) => r.path).join(',');
	const url = new URL(`${BASE_URL}/${paths}`);
	url.searchParams.set('batch', '1');

	const batchInput: Record<string, unknown> = {};
	requests.forEach((req, i) => {
		batchInput[i.toString()] = req.input;
	});
	url.searchParams.set('input', JSON.stringify(batchInput));

	const res = await fetchFn(url.toString(), {
		method: 'GET',
		headers: { accept: 'application/json' }
	});

	if (!res.ok) {
		throw new Error(`API error ${res.status}: ${await res.text()}`);
	}

	const json = await res.json();
	const results = Array.isArray(json) ? json : [json];
	return results.map(
		(item: { result?: { data?: unknown } }) => item.result?.data ?? item
	) as BatchOutput<{ [K in keyof Requests]: Requests[K]['path'] }>;
}
