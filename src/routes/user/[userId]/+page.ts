import type { PageLoad } from './$types';
import { userState } from '$lib/stores/user.svelte';
import { getUserLite } from '$lib/services';

export const load = (async ({ fetch, params }) => {
	if (params.userId === userState.user?._id) {
		return {
			user: userState.user
		};
	}

	const user = await getUserLite({ userId: params.userId }, fetch);

	return { user };
}) satisfies PageLoad;
