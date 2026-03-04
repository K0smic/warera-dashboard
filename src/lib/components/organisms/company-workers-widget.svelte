<script lang="ts">
	import { setContext } from 'svelte';
	import { CompanyWage, CompanyWorkers } from '$lib/components/molecules';

	let breakEvenWage = $state({
		getByFidelity: null as null | ((fidelity: number) => number)
	});
	setContext('breakEvenWage', breakEvenWage);

	let { marketPrice, inputPrice, productionPoints, totalBonus, workers, tax } = $props();
</script>

<CompanyWage {marketPrice} {inputPrice} {productionPoints} {totalBonus} />

<CompanyWorkers {workers} {tax} />
