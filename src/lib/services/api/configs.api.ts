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

export function getGameConfig(
	input: RequestBody<'/gameConfig.getGameConfig'>,
	fetchFn: typeof fetch = fetch
) {
	return trpcFetch<RequestBody<'/gameConfig.getGameConfig'>, responses['responses']>(
		'gameConfig.getGameConfig',
		input,
		fetchFn
	);
}
