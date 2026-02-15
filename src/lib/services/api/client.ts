const BASE_URL = 'https://api2.warera.io/trpc';

export async function trpcFetch<TInput, TOutput>(path: string, input: TInput): Promise<TOutput> {
	const url = new URL(`${BASE_URL}/${path}`);

	url.searchParams.set('input', JSON.stringify(input));

	const res = await fetch(url.toString(), {
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
