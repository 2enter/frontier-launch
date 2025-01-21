<script lang="ts">
	import { enhance } from '$app/forms';
	import { dexie } from '@/dexie';
	import { makeEnhanceHandler } from '@repo/lib/utils/browser';
	import { getInputState, getSysState } from '@/states';
	import { ImgBtn } from '@/components/index.js';

	const [inputState, sysState] = [getInputState(), getSysState()];

	const enhanceHandler = makeEnhanceHandler<SubmitResult>({
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
		},
		onstart: () => (sysState.processing = true),
		onfinish: () => (sysState.processing = false),
		validate: () => inputState.submittable,
		getFiles: async () => {
			const url = inputState.resultImgUrl;
			if (!url) return null;
			const blob = await fetch(url).then((res) => res.blob());
			return [{ name: 'paint', file: new File([blob], 'paint.png') }];
		}
	});

	async function getImage() {
		// const versions = await dexie.versions.toArray();
		// return versions[0].value;
		return inputState.resultImgUrl;
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
	圖片載入中
{:then img}
	{#if img}
		{#if !inputState.result}
			<img src={img} alt="" class="pointer-events-none fixed h-auto w-full" />
			<form id="form" hidden action="?/submit" method="post" enctype="multipart/form-data" use:enhance={enhanceHandler}>
				<input type="text" name="cargo_type" value={inputState.cargoType} readonly />
				<input type="number" name="draw_duration" value={inputState.drawDuration ?? 0} readonly />
			</form>
			{#if !sysState.processing}
				<ImgBtn src="/ui/buttons/upload.png" class="z-[2000]" form="form" type="submit" />
			{/if}
		{:else}
			<img use:lightBeam class="h-[50vh] w-screen" src="/ui/animations/light_beam.webp" alt="" />
		{/if}
	{:else}
		載入失敗
	{/if}
{/await}
