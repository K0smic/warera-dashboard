import type {
	EndpointPath,
	EndpointInput,
	EndpointOutput,
	BatchOutput
} from '$lib/types/api/registry';

const BASE_URL = 'https://api2.warera.io/trpc';

// ---------------------------------------------------------------------------
// Typed API error
// Lets call sites branch on HTTP status without string-matching the message.
// ---------------------------------------------------------------------------

export class ApiError extends Error {
	constructor(
		public readonly status: number,
		public readonly body: string,
		public readonly path: string
	) {
		super(`[${status}] ${path}: ${body}`);
		this.name = 'ApiError';
	}

	/** True for errors worth showing to the user (not transient network issues). */
	get isClientError(): boolean {
		return this.status >= 400 && this.status < 500 && this.status !== 429;
	}
}

// ---------------------------------------------------------------------------
// Retry — exponential backoff, only on transient / rate-limit errors
// ---------------------------------------------------------------------------

/** HTTP statuses that are safe to retry. */
const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);

async function withRetry<T>(
	fn: () => Promise<T>,
	signal: AbortSignal | undefined,
	maxAttempts = 3
): Promise<T> {
	let lastError: unknown;

	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

		try {
			return await fn();
		} catch (err) {
			lastError = err;

			// Non-retryable API error — bubble up immediately.
			if (err instanceof ApiError && !RETRYABLE_STATUSES.has(err.status)) throw err;

			// Navigation cancelled — no point retrying.
			if (err instanceof DOMException && err.name === 'AbortError') throw err;

			// Exponential backoff: 200 ms, 400 ms, 800 ms.
			const delay = 200 * 2 ** attempt;
			await new Promise<void>((resolve, reject) => {
				const timer = setTimeout(resolve, delay);
				signal?.addEventListener('abort', () => {
					clearTimeout(timer);
					reject(new DOMException('Aborted', 'AbortError'));
				});
			});
		}
	}

	throw lastError;
}

// ---------------------------------------------------------------------------
// Response unwrapper
// tRPC wraps results in { result: { data: T } }; handle both shapes.
// ---------------------------------------------------------------------------

function unwrap<T>(json: unknown): T {
	if (
		json !== null &&
		typeof json === 'object' &&
		'result' in json &&
		json.result !== null &&
		typeof json.result === 'object' &&
		'data' in json.result
	) {
		return (json as { result: { data: T } }).result.data;
	}
	return json as T;
}

// ---------------------------------------------------------------------------
// Single fetch
// ---------------------------------------------------------------------------

/**
 * Typed tRPC GET fetch.
 * Input and output types are inferred automatically from the registry.
 *
 * @example
 * const company = await trpcFetch('company.getById', { companyId: '123' });
 * //    ^? CompanyResponse
 */
export async function trpcFetch<P extends EndpointPath>(
	path: P,
	input: EndpointInput<P>,
	fetchFn: typeof fetch = fetch,
	signal?: AbortSignal
): Promise<EndpointOutput<P>> {
	return withRetry(
		async () => {
			const url = new URL(`${BASE_URL}/${path}`);
			url.searchParams.set('input', JSON.stringify(input));

			const res = await fetchFn(url.toString(), {
				method: 'GET',
				headers: { accept: 'application/json' },
				signal
			});

			if (!res.ok) {
				throw new ApiError(res.status, await res.text(), path);
			}

			return unwrap<EndpointOutput<P>>(await res.json());
		},
		signal,
		3
	);
}

// ---------------------------------------------------------------------------
// Batch fetch
// ---------------------------------------------------------------------------

type BatchRequest<P extends EndpointPath> = {
	path: P;
	input: EndpointInput<P>;
};

/**
 * Typed tRPC batch fetch.
 * Pass a `const` array of requests and get back a fully typed tuple.
 *
 * @example
 * const [company, region] = await trpcBatchFetch([
 *   { path: 'company.getById', input: { companyId: '123' } },
 *   { path: 'region.getById',  input: { regionId:  '456' } },
 * ] as const);
 * //  company ^? CompanyResponse
 * //  region  ^? RegionResponse
 */
export async function trpcBatchFetch<
	const Requests extends ReadonlyArray<BatchRequest<EndpointPath>>
>(
	requests: Requests,
	fetchFn: typeof fetch = fetch,
	signal?: AbortSignal
): Promise<BatchOutput<{ [K in keyof Requests]: Requests[K]['path'] }>> {
	const paths = requests.map((r) => r.path).join(',');

	return withRetry(
		async () => {
			const url = new URL(`${BASE_URL}/${paths}`);
			url.searchParams.set('batch', '1');

			const batchInput: Record<string, unknown> = {};
			requests.forEach((req, i) => {
				batchInput[String(i)] = req.input;
			});
			url.searchParams.set('input', JSON.stringify(batchInput));

			const res = await fetchFn(url.toString(), {
				method: 'GET',
				headers: { accept: 'application/json' },
				signal
			});

			if (!res.ok) {
				throw new ApiError(res.status, await res.text(), paths);
			}

			const json = await res.json();
			const items: unknown[] = Array.isArray(json) ? json : [json];

			return items.map((item) => unwrap(item)) as BatchOutput<{
				[K in keyof Requests]: Requests[K]['path'];
			}>;
		},
		signal,
		3
	);
}
