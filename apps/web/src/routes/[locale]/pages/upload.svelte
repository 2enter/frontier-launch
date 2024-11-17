<script lang="ts">
	import { enhance } from '$app/forms';
	import { dexie } from '@/dexie';
	import { makeEnhanceHandler } from '@/form';
	import { inputState, sysState } from '@/states';

	const enhanceHandler = makeEnhanceHandler({
		handlers: {
			success: async () => {
				console.log('success');
			},
			failure: async () => {
				console.log('failure');
				sysState.popError('failure');
			}
		}
	});

	async function getImage() {
		const versions = await dexie.versions.toArray();
		console.log(versions);
		return versions[0];
	}
</script>

{#await getImage()}
	loading
{:then img}
	{#if img}
		{@const imgUrl = img.value}
		<img src={imgUrl} alt="" class="pointer-events-none fixed h-auto w-full" />
		<form id="dkd" hidden action="?/submit" method="post" use:enhance={enhanceHandler}>
			<input type="text" name="paint" value={imgUrl} readonly />
			<input type="text" name="cargo_type" value={inputState.cargoType} readonly />
			<input type="number" name="draw_duration" value={inputState.drawDuration ?? 0} readonly />
		</form>
		<button class="btn btn-primary z-[1000]" form="dkd" type="submit">submit</button>
	{:else}
		img not found
	{/if}
{/await}
