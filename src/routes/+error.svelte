<script lang="ts">
	import { page } from '$app/state';
	import MdiErrorOutline from '~icons/mdi/error-outline';
</script>

<div
	class="grid h-full content-center justify-center gap-4 text-center text-destructive *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card"
>
	<MdiErrorOutline class="size-96 w-full" />
	<h1 class="text-5xl md:text-9xl">{page.status}: {page.error?.message}</h1>
</div>
