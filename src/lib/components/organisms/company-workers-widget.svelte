<script lang="ts">
	import { setContext } from 'svelte';
	import { BREAK_EVEN_WAGE_CTX, type BreakEvenWageContext } from '$lib/types';

	import { CompanyWage, CompanyWorkers } from '$lib/components/molecules';

	const breakEvenWage = $state({
		isModified: false,
		wage: 0,
		getByFidelity: (f: number) => 0
	});

	setContext(BREAK_EVEN_WAGE_CTX, breakEvenWage);

	let { marketPrice, inputPrice, productionPoints, totalBonus, workers, tax } = $props();
</script>

<CompanyWage {marketPrice} {inputPrice} {productionPoints} {totalBonus} />

<CompanyWorkers {workers} {tax} />
