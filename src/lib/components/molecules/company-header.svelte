<script lang="ts">
	import { Badge } from '$lib/components/atoms/badge';
	import { camelCaseToNormalText } from '$lib/utils';

	interface Props {
		companyName: string;
		itemCode: string;
		regionName: string;
		estimatedValue: number;
	}

	let { companyName, itemCode, regionName, estimatedValue }: Props = $props();
</script>

<div class="item-center flex justify-between">
	<div>
		<h1 class="text-3xl font-bold">{companyName}</h1>
		<p class="text-muted-foreground">
			{camelCaseToNormalText(itemCode)} production · Region {regionName}
		</p>
	</div>

	<Badge variant="secondary">
		Estimated value: {estimatedValue.toFixed(2)}
	</Badge>
</div>
