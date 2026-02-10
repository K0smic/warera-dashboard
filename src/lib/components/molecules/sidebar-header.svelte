<script lang="ts">
	import * as Sidebar from '$lib/components/atoms/sidebar/index.js';
	import Item from '$lib/components/atoms/item/item.svelte';
	import IconWorld from 'virtual:icons/mdi/world';
	// This should be `Component` after @lucide/svelte updates types
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<Sidebar.MenuButton
			size="lg"
			class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
			tabindex={-1}
		>
			<div
				class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
			>
				<IconWorld class="size-7" />
			</div>
			<div class="grid flex-1 text-start text-sm leading-tight">
				<span class="truncate font-medium">War Era</span>
				<span class="truncate text-xs">Dashboard</span>
			</div>
		</Sidebar.MenuButton>
	</Sidebar.MenuItem>
</Sidebar.Menu>
