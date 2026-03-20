<script lang="ts">
	import * as Sidebar from '$lib/components/atoms/sidebar/index.js';
	import { Separator } from '$lib/components/atoms/separator/index.js';

	const sidebarState = Sidebar.useSidebar();
</script>

<header
	class="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
>
	<div class="flex items-center gap-2 px-4">
		<Sidebar.Trigger class="-ms-1 {sidebarState.open ? 'rotate-180' : ''}" title="Toggle sidebar" />
		<Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
	</div>
	<div>
		<span class="glitch text-2xl font-bold text-destructive" data-text="ALPHA">ALPHA</span>
	</div>
</header>
