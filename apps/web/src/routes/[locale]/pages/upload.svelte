<script lang="ts">
	import { dexie } from '@/dexie';
	import { sysState } from '@/states';

	async function getImage() {
		return dexie.versions.get(sysState.version);
	}
</script>

{#await getImage() then img}
	<img src={img.value} alt="" />
{/await}
