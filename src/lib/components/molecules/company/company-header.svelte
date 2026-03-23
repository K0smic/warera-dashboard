<script lang="ts">
	import { camelCaseToNormalText } from '$lib/utils';

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
</div>
