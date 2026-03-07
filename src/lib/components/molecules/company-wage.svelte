<script lang="ts">
	import { getContext } from 'svelte';
	import * as Card from '$lib/components/atoms/card';
	import * as InputGroup from '$lib/components/atoms/input-group/index.js';
	import Button from '$lib/components/atoms/button/button.svelte';

	import MdiBitcoin from '~icons/mdi/bitcoin';
	import MdiPickaxe from '~icons/mdi/pickaxe';

	interface Props {
		marketPrice?: number;
		inputPrice?: number;
		productionPoints?: number;
		totalBonus?: number;
		fidelity?: number;
		margin?: number;
	}

	const props: Props = $props();

	const breakEvenWageConnector = getContext<{
		wage: number;
		getByFidelity: (fidelity: number) => number;
	}>('breakEvenWage');

	let marketPrice = $derived(props.marketPrice ?? 0);
	let inputPrice = $derived(props.inputPrice ?? 0);
	let productionPoints = $derived(props.productionPoints ?? 1);
	let totalBonus = $derived(props.totalBonus ?? 0);
	let fidelity = $derived(props.fidelity ?? 1);
	let margin = $derived(props.margin ?? 0);

	const initialValues = {
		marketPrice: props.marketPrice ?? 0,
		inputPrice: props.inputPrice ?? 0,
		productionPoints: props.productionPoints ?? 1,
		totalBonus: props.totalBonus ?? 0,
		fidelity: props.fidelity ?? 1,
		margin: props.margin ?? 0
	};

	// let breakEvenWage = $derived(
	// 	(marketPrice - productionPoints * inputPrice) / (productionPoints / (1 + totalBonus / 100))
	// );

	// let breakEvenWageWithFidelity = $derived(
	// 	(marketPrice - productionPoints * inputPrice) /
	// 		(productionPoints / (1 + fidelity / 100) / (1 + totalBonus / 100))
	// );

	// let breakEvenWageWithMargin = $derived(
	// 	(marketPrice - productionPoints * inputPrice) /
	// 		((productionPoints * (1 + margin / 100)) / (1 + totalBonus / 100))
	// );
	// let breakEvenWageWithFidelityAndMargin = $derived(
	// 	(marketPrice - productionPoints * inputPrice) /
	// 		(((productionPoints / (1 + fidelity / 100)) * (1 + margin / 100)) / (1 + totalBonus / 100))
	// );

	// Production without global production bonuses
	let baseProductionOutput = $derived(productionPoints / (1 + totalBonus / 100));

	// Production adjusted by worker fidelity
	// Higher fidelity increases the economic value per production point
	let productionAdjustedByFidelity = $derived(baseProductionOutput / (1 + fidelity / 100));

	// Production adjusted to include a safety margin
	// Higher margin lowers the sustainable wage
	let productionWithMargin = $derived(baseProductionOutput * (1 + margin / 100));

	// Production adjusted by both fidelity and margin
	let productionWithFidelityAndMargin = $derived(productionAdjustedByFidelity * (1 + margin / 100));

	// Break-even wage calculation per production point
	// Returns the maximum sustainable wage without losses
	function calculateBreakEvenWage(inputCost: number, productionCapacity: number) {
		return (marketPrice - inputCost) / productionCapacity;
	}

	// Base break-even wage
	let breakEvenWage = $derived(calculateBreakEvenWage(inputPrice, baseProductionOutput));

	// Break-even wage adjusted by fidelity
	let breakEvenWageWithFidelity = $derived(
		calculateBreakEvenWage(inputPrice, productionAdjustedByFidelity)
	);

	// Break-even wage adjusted by margin
	let breakEvenWageWithMargin = $derived(calculateBreakEvenWage(inputPrice, productionWithMargin));

	// Final break-even wage adjusted by both fidelity and margin
	let breakEvenWageWithFidelityAndMargin = $derived(
		calculateBreakEvenWage(inputPrice, productionWithFidelityAndMargin)
	);

	// $effect(() => {
	// 	breakEvenWageConnector.wage = breakEvenWage;
	// });

	breakEvenWageConnector.getByFidelity = (fidelity: number) => {
		const productionAdjustedByFidelity = baseProductionOutput / (1 + fidelity / 100);

		return calculateBreakEvenWage(inputPrice, productionAdjustedByFidelity);
	};

	function handleReset() {
		marketPrice = initialValues.marketPrice;
		inputPrice = initialValues.inputPrice;
		productionPoints = initialValues.productionPoints;
		totalBonus = initialValues.totalBonus;
		fidelity = initialValues.fidelity;
		margin = initialValues.margin;
	}
</script>

<Card.Root class="col-span-2 xl:col-span-1">
	<Card.Header>
		<Card.Title>Wages</Card.Title>
		<Card.Description>Wages calculator</Card.Description>
	</Card.Header>
	<Card.Content>
		<form class="space-y-4">
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
				<div class="space-y-2">
					<label for="market-price" class="text-sm font-medium">Market price</label>
					<InputGroup.Root>
						<InputGroup.Input
							min="0"
							id="market-price"
							type="number"
							step=".001"
							placeholder="Enter market price"
							bind:value={marketPrice}
						/>
						<InputGroup.Addon align="inline-end">
							<MdiBitcoin />
						</InputGroup.Addon>
					</InputGroup.Root>
				</div>

				<div class="space-y-2">
					<label for="input-price" class="text-sm font-medium">Input price</label>
					<InputGroup.Root>
						<InputGroup.Input
							min="0"
							id="input-price"
							type="number"
							step=".001"
							placeholder="Enter input price (optional)"
							bind:value={inputPrice}
						/>
						<InputGroup.Addon align="inline-end">
							<MdiBitcoin />
						</InputGroup.Addon></InputGroup.Root
					>
				</div>

				<div class="space-y-2">
					<label for="production-points" class="text-sm font-medium">Production points</label>
					<InputGroup.Root>
						<InputGroup.Input
							min="0"
							id="production-points"
							type="number"
							placeholder="Enter production points"
							bind:value={productionPoints}
						/>
						<InputGroup.Addon align="inline-end">
							<MdiPickaxe />
						</InputGroup.Addon></InputGroup.Root
					>
				</div>

				<div class="space-y-2">
					<label for="total-bonus" class="text-sm font-medium">Total bonus</label>
					<InputGroup.Root>
						<InputGroup.Input
							min="0"
							id="total-bonus"
							type="number"
							placeholder="Enter total bonus"
							bind:value={totalBonus}
						/>
						<InputGroup.Addon align="inline-end">
							<InputGroup.Text>%</InputGroup.Text>
						</InputGroup.Addon>
					</InputGroup.Root>
				</div>
				<div class="space-y-2">
					<label for="fidelity" class="text-sm font-medium">Fidelity</label>
					<InputGroup.Root>
						<InputGroup.Input
							min="0"
							id="fidelity"
							type="number"
							placeholder="Enter total fidelity"
							max="10"
							bind:value={fidelity}
						/>
						<InputGroup.Addon align="inline-end">
							<InputGroup.Text>%</InputGroup.Text>
						</InputGroup.Addon>
					</InputGroup.Root>
				</div>
				<div class="space-y-2">
					<label for="margin" class="text-sm font-medium">Margin</label>
					<InputGroup.Root>
						<InputGroup.Input
							min="0"
							id="margin"
							type="number"
							placeholder="Enter total margin"
							max="10"
							bind:value={margin}
						/>
						<InputGroup.Addon align="inline-end">
							<InputGroup.Text>%</InputGroup.Text>
						</InputGroup.Addon></InputGroup.Root
					>
				</div>
			</div>

			<div class="flex flex-wrap gap-3">
				<div class="grow rounded-lg bg-muted p-4">
					<p class="mb-2 text-sm font-medium">Max salary</p>
					<div class="flex flex-row justify-between space-y-3">
						<div>
							<p class="mb-1 text-xs text-muted-foreground">Without fidelity</p>
							<p class="text-2xl font-bold">
								{isFinite(breakEvenWage) ? breakEvenWage.toFixed(4) : 0}
							</p>
						</div>
						<div>
							<p class="mb-1 text-xs text-muted-foreground">With fidelity (+{fidelity}%)</p>
							<p class="text-2xl font-bold text-green-600">
								{isFinite(breakEvenWageWithFidelity) ? breakEvenWageWithFidelity.toFixed(4) : 0}
							</p>
							<p class="mt-1 text-xs text-muted-foreground">
								Value: {isFinite(breakEvenWageWithFidelity - breakEvenWage)
									? (breakEvenWageWithFidelity - breakEvenWage).toFixed(4)
									: 0}
							</p>
						</div>
					</div>
				</div>
				<div class="grow rounded-lg bg-muted p-4">
					<p class="mb-2 text-sm font-medium">Max salary with margins</p>
					<div class="flex flex-row justify-between space-y-3">
						<div>
							<p class="mb-1 text-xs text-muted-foreground">Without fidelity</p>
							<p class="text-2xl font-bold">
								{isFinite(breakEvenWageWithMargin) ? breakEvenWageWithMargin.toFixed(4) : 0}
							</p>
							<p class="mt-1 text-xs text-muted-foreground">
								Value: {isFinite(breakEvenWageWithMargin - breakEvenWage)
									? (breakEvenWageWithMargin - breakEvenWage).toFixed(4)
									: 0}
							</p>
						</div>
						<div>
							<p class="mb-1 text-xs text-muted-foreground">With fidelity (+{fidelity}%)</p>
							<p class="text-2xl font-bold text-green-600">
								{isFinite(breakEvenWageWithFidelityAndMargin)
									? breakEvenWageWithFidelityAndMargin.toFixed(4)
									: 0}
							</p>
							<p class="mt-1 text-xs text-muted-foreground">
								Value: {isFinite(breakEvenWageWithFidelityAndMargin - breakEvenWage)
									? (breakEvenWageWithFidelityAndMargin - breakEvenWage).toFixed(4)
									: 0}
							</p>
						</div>
					</div>
				</div>
			</div>

			<Button onclick={handleReset} variant="outline" class="w-full">Reset</Button>
		</form>
	</Card.Content>
</Card.Root>
