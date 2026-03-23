import { trpcFetch } from './client';
import type { EndpointInput } from '$lib/types/api/registry';

/* =======================
 * Game config endpoints
 * ======================= */

export function getGameConfig(
	input: EndpointInput<'gameConfig.getGameConfig'>,
	fetchFn: typeof fetch = fetch,
	signal?: AbortSignal
) {
	return trpcFetch('gameConfig.getGameConfig', input, fetchFn, signal);
}
