<script lang="ts">
	// import { Badge } from '$lib/components/atoms/badge';
	import { camelCaseToNormalText } from '$lib/utils';

	// import MdiBitcoin from '~icons/mdi/bitcoin';

	interface Props {
		companyName: string;
		itemCode: string;
		regionName: string;
		estimatedValue?: number;
	}

	let { companyName, itemCode, regionName, estimatedValue }: Props = $props();
</script>

<div class="item-center flex justify-between">
	<div>
		<h1 class="text-3xl font-bold">{companyName}</h1>
		<p class="text-muted-foreground">
			{camelCaseToNormalText(itemCode)} production | {regionName}
		</p>
	</div>

	<!-- <Badge
		variant="secondary"
		class=" items-center rounded-sm text-2xl font-bold"
		title="Estimed Value"
	>
		<span class="flex flex-row items-center"
			>{estimatedValue.toFixed(0)} <MdiBitcoin class="size-5" /></span
		>
		<span class="sr-only">Estimated value</span>
	</Badge> -->
</div>
