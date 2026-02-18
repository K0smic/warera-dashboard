<script lang="ts">
	import * as Sidebar from '$lib/components/atoms/sidebar/index.js';
	import { Separator } from '$lib/components/atoms/separator/index.js';
</script>

<!-- class="sticky top-0 flex h-16 w-full shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12" -->
<header
	class="sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
>
	<div class="flex items-center gap-2 px-4">
		<Sidebar.Trigger class="-ms-1" title="Toggle sidebar" />
		<Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />
		<!-- <Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item class="hidden md:block">
					<Breadcrumb.Link href="##">Building Your Application</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator class="hidden md:block" />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Data Fetching</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root> -->
	</div>
</header>
