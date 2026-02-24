const BASE_URL = 'https://api2.warera.io/trpc';

export async function trpcFetch<TInput, TOutput>(
	path: string,
	input: TInput,
	fetchFn: typeof fetch = fetch
): Promise<TOutput> {
	const url = new URL(`${BASE_URL}/${path}`);

	url.searchParams.set('input', JSON.stringify(input));

	const res = await fetchFn(url.toString(), {
		method: 'GET',
		headers: {
			accept: 'application/json'
		}
	});

	if (!res.ok) {
		throw new Error(`API error ${res.status}: ${await res.text()}`);
	}

	const json = await res.json();

	// tRPC-style response
	return json.result?.data ?? json;
}

export async function trpcBatchFetch<T extends Array<{ path: string; input: unknown }>>(
	requests: T,
	fetchFn: typeof fetch = fetch
): Promise<Array<unknown>> {
	const paths = requests.map((req) => req.path).join(',');
	const url = new URL(`${BASE_URL}/${paths}`);
	url.searchParams.set('batch', '1');

	const batchInput: Record<string, unknown> = {};
	requests.forEach((req, index) => {
		batchInput[index.toString()] = req.input;
	});

	url.searchParams.set('input', JSON.stringify(batchInput));

	const res = await fetchFn(url.toString(), {
		method: 'GET',
		headers: {
			accept: 'application/json'
		}
	});

	if (!res.ok) {
		throw new Error(`API error ${res.status}: ${await res.text()}`);
	}

	const json = await res.json();

	if (Array.isArray(json)) {
		return json.map((item: any) => item.result?.data ?? item);
	}

	return [json.result?.data ?? json];
}
