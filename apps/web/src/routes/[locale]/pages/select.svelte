<script lang="ts">
	import { inputState, sysState } from '@/states';
	import { SuppliesTypeOptions } from '@repo/lib/pb';

	const SUPPLY_TYPES = Object.values(SuppliesTypeOptions);

	function chooseSupplyType(type: SuppliesTypeOptions) {
		inputState.supplyType = type;
		sysState.navigate(1);
	}
</script>

<div class="center-content w-1/2 flex-wrap gap-3">
	{#each SUPPLY_TYPES as type}
		<button aria-label="button" class="size-32 bg-black" onclick={() => chooseSupplyType(type)}></button>
	{/each}
</div>
