<script lang="ts">
	import Separator from '$lib/components/atoms/separator/separator.svelte';
	import Icon from '../atoms/Icon/icon.svelte';
</script>

<Separator />
<div class="flex items-center justify-center gap-3">
	<div title="GitHub">
		<a href="https://github.com/K0smic/warera-dashboard" target="_blank">
			<Icon name="github" />
		</a>
	</div>
	<!-- <div title="War Era">
		<a href="https://app.warera.io/user/696f3823bcd04419d1f91460" target="_blank">
			<Icon name="globe" />
		</a>
	</div> -->
	<div title="War Era - Support me">
		<a href="https://app.warera.io?referrerId=696f3823bcd04419d1f91460" target="_blank">
			<Icon name="currency" />
		</a>
	</div>
</div>
