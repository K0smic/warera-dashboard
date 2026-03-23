<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { getIcon } from '$lib/config/icons';
	import { cn } from '$lib/utils';

	interface Props extends HTMLAttributes<SVGElement> {
		/** Semantic icon key from the icon registry (e.g. "production", "currency"). */
		name: string;
		class?: string;
	}

	let { name, class: className, ...restProps }: Props = $props();

	const Icon = $derived(getIcon(name));
</script>

<Icon class={cn(className)} {...restProps} />
