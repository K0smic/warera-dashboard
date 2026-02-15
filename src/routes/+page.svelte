<script>
	// import { onMount } from 'svelte';

	// onMount(async () => {
	// 	try {
	// 		const response = await fetch('https://api2.warera.io/trpc/country.getAllCountries', {
	// 			method: 'GET'
	// 		});
	// 		const data = await response.json();
	// 		console.log('Countries:', data);
	// 	} catch (error) {
	// 		console.error('Error fetching countries:', error);
	// 	}
	// });
</script>

<div class="flex flex-1 flex-col gap-4 p-4">
	<div class="grid auto-rows-min gap-4 md:grid-cols-3">
		<div class="aspect-video rounded-xl bg-muted/50"></div>
		<div class="aspect-video rounded-xl bg-muted/50"></div>
		<div class="aspect-video rounded-xl bg-muted/50"></div>
	</div>
	<div class="aspect-video h-fit min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min"></div>
</div>
