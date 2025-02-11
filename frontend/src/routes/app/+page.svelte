<script lang="ts">
	import { getSysState } from '@/states';
	import { Pages } from './pages';
	import { fade } from 'svelte/transition';

	const sysState = getSysState();

	const Page = $derived(Pages[sysState.pageNum]);

</script>

{#key sysState.pageNum}
	<div in:fade class="center-content flex-col" class:mix-blend-multiply={sysState.pageNum !== 5}>
		<Page />
	</div>
{/key}
