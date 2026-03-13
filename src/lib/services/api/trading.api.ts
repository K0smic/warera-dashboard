import { trpcFetch } from './client';
import type { EndpointInput } from '$lib/types/api/registry';

/* =======================
 * User endpoints
 * ======================= */

export function getTopOrders(
	input: EndpointInput<'tradingOrder.getTopOrders'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch('tradingOrder.getTopOrders', input, fetchFn);
}
