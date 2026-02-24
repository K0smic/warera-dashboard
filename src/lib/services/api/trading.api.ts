// src/lib/api/user.api.ts
import type { paths, responses } from '$lib/services/index';
import { trpcFetch } from './client';

/* =======================
 * Helpers
 * ======================= */

type RequestBody<P extends keyof paths> = NonNullable<
	paths[P]['get']['requestBody']
>['content']['application/json'];

/* =======================
 * User endpoints
 * ======================= */

export function getTopOrders(
	input: RequestBody<'/tradingOrder.getTopOrders'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch<RequestBody<'/tradingOrder.getTopOrders'>, responses['responses']>(
		'tradingOrder.getTopOrders',
		input,
		fetchFn
	);
}
