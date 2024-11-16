<script lang="ts">
	import { dexie } from '@/dexie';

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
		<img src={img.value} alt="" class="mix-blend-hard-light" />
	{:else}
		img not found
	{/if}
{/await}
