<!-- <script lang="ts">
	import Separator from '$lib/components/atoms/separator/separator.svelte';
	import Icon from '../atoms/icon/icon.svelte';
</script>

<Separator />
<div class="flex items-center justify-center gap-3">
	<div title="GitHub">
		<a href="https://github.com/K0smic/warera-dashboard" target="_blank">
			<Icon name="github" class="size-4.5" />
		</a>
	</div>
	<div title="War Era">
		<a href="https://app.warera.io/user/696f3823bcd04419d1f91460" target="_blank">
			<Icon name="globe" />
		</a>
	</div>
	<div title="War Era - Support me">
		<a href="https://app.warera.io?referrerId=696f3823bcd04419d1f91460" target="_blank">
			<Icon name="currency" class="size-4.5" />
		</a>
	</div>
</div> -->

<script lang="ts">
	import * as Sidebar from '$lib/components/atoms/sidebar/index.js';
	import type { WithoutChildren } from '$lib/utils.js';
	import type { ComponentProps } from 'svelte';

	let {
		items,
		...restProps
	}: { items: { title: string; url: string; icon: any }[] } & WithoutChildren<
		ComponentProps<typeof Sidebar.Group>
	> = $props();
</script>

<Sidebar.Group {...restProps}>
	<Sidebar.GroupContent>
		<Sidebar.GroupLabel>Support me</Sidebar.GroupLabel>
		<Sidebar.Menu>
			{#each items as item (item.title)}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						{#snippet child({ props })}
							<a href={item.url} target="_blank" {...props}>
								<item.icon />
								<span>{item.title}</span>
							</a>
						{/snippet}
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			{/each}
		</Sidebar.Menu>
	</Sidebar.GroupContent>
</Sidebar.Group>
