<script lang="ts">
	import { setContext } from 'svelte';
	import { BREAK_EVEN_WAGE_CTX, type BreakEvenWageContext } from '$lib/types';

	import { CompanyWage, CompanyWorkers } from '$lib/components/molecules';

	setContext<BreakEvenWageContext>(BREAK_EVEN_WAGE_CTX, {
		wage: 0,
		getByFidelity: null
	});

	let { marketPrice, inputPrice, productionPoints, totalBonus, workers, tax } = $props();
</script>

<CompanyWage {marketPrice} {inputPrice} {productionPoints} {totalBonus} />

<CompanyWorkers {workers} {tax} />
