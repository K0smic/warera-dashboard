import { trpcBatchFetch } from './client';

/* =======================
 * Batch helper
 * ======================= */

interface BatchRequest {
	path: string;
	input: unknown;
}

/**
 * Execute multiple API request in Batch mode
 * @param requests Array of objects with path and input
 * @param fetchFn Custom fetch, use it with Svelte load functions (optional)
 * @returns Results array ordered by path
 * @example
 * const [companies, bonus] = await batchFetch([
 *   { path: 'company.getCompanies', input: { userId: '123' } },
 *   { path: 'company.getProductionBonus', input: { companyId: '456' } }
 * ]);
 */
/**
 * Execute multiple API request in Batch mode
 * @param requests Array of objects with path and input
 * @param fetchFn Custom fetch, use it with Svelte load functions (optional)
 * @returns Results array ordered by path (typed as `any[]` by default)
 */
export async function batchFetch<T extends any[] = any[]>(
	requests: BatchRequest[],
	fetchFn: typeof fetch = fetch
): Promise<T> {
	return (await trpcBatchFetch(requests, fetchFn)) as unknown as T;
}
