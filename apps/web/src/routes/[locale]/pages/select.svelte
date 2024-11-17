<script lang="ts">
	import { inputState, sysState } from '@/states';
	import { CargoesTypeOptions } from '@repo/lib/pb';

	const CARGO_TYPES = Object.values(CargoesTypeOptions);

	function choose(type: CargoesTypeOptions) {
		inputState.cargoType = type;
		sysState.navigate(1);
	}
</script>

<div class="center-content w-1/2 flex-wrap gap-3">
	{#each CARGO_TYPES as type}
		<button aria-label="button" class="size-32 bg-black" onclick={() => choose(type)}></button>
	{/each}
</div>
