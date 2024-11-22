<script lang="ts">
	import { enhance } from '$app/forms';
	import { dexie } from '@/dexie';
	import { makeEnhanceHandler } from '@/form';
	import { inputState, sysState } from '@/states';
	import { ImgBtn } from '@/components/index.js';

	const enhanceHandler = makeEnhanceHandler({
		handlers: {
			success: async (data) => {
				console.log('success');
				if (!data) return;
				inputState.result = data;
			},
			failure: async () => {
				console.log('failure');
				sysState.popError('failure');
			}
		}
	});

	async function getImage() {
		const versions = await dexie.versions.toArray();
		return versions[0];
	}

	const lightBeam = (node: HTMLImageElement) => {
		let num = 2;
		const interval = setInterval(() => {
			num += num;
			node.style.marginBottom = `${num}px`;
			if (num > window.innerHeight * 1.5) {
				sysState.navigate();
			}
		}, 100);

		return {
			destroy() {
				clearInterval(interval);
			}
		};
	};
</script>

{#await getImage()}
	loading
{:then img}
	{#if img}
		{#if !inputState.result}
			{@const imgUrl = img.value}
			<img src={imgUrl} alt="" class="pointer-events-none fixed h-auto w-full" />
			<form id="form" hidden action="?/submit" method="post" use:enhance={enhanceHandler}>
				<input type="text" name="paint" value={imgUrl} readonly />
				<input type="text" name="cargo_type" value={inputState.cargoType} readonly />
				<input type="number" name="draw_duration" value={inputState.drawDuration ?? 0} readonly />
			</form>
			<ImgBtn src="/ui/buttons/upload.png" class="z-[2000]" form="form" type="submit" />
		{:else}
			<img use:lightBeam class="h-[50vh] w-screen" src="/ui/animations/light_beam.webp" alt="" />
		{/if}
	{:else}
		img not found
	{/if}
{/await}
