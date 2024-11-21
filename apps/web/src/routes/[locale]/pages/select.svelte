<script lang="ts">
	import { CargoesTypeOptions } from '@repo/lib/pb';

	import { inputState, sysState } from '@/states';
	import { ImgBtn } from '@/components';

	const CARGO_TYPES = Object.values(CargoesTypeOptions);

	function choose(type: CargoesTypeOptions) {
		inputState.cargoType = type;
		sysState.navigate();
	}
</script>

<div class="center-content flex-wrap gap-3 px-14">
	<img src="/ui/texts/select_cargo.png" alt="" />
	{#each CARGO_TYPES as type}
		<ImgBtn src="/cargoes/{type}_select.png" class="w-2/5" onclick={() => choose(type)}></ImgBtn>
	{/each}
</div>
