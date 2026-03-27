<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type WithElementRef, type WithoutChildren } from '$lib/utils.js';
	import { getIcon } from '$lib/config/icons';

	interface Props extends HTMLAttributes<HTMLImageElement> {
		/** ItemCode from APIs response */
		item: string;
		alt: string;
		loading?: 'eager' | 'lazy' | null | undefined;
		class?: string;
	}

	let { item, alt, loading, class: className, ...restProps }: Props = $props();
</script>

<img
	src="https://app.warera.io/images/items/{item}.png"
	class={cn(className)}
	{alt}
	{loading}
	{...restProps}
/>
