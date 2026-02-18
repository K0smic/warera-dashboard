import type { PageLoad } from './$types';
import { createGameConfigs } from '$lib/stores/configs.svelte';

const configsState = createGameConfigs();

export const load: PageLoad = async ({ fetch }) => {
	if (!configsState.configs) {
		configsState.loadConfigs(fetch);
		return;
	}
};
