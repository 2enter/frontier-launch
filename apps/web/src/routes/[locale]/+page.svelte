<script lang="ts">
	import { onMount } from 'svelte';
	import { getSysState } from '@/states';
	import { Pages } from './pages';
	import { fade } from 'svelte/transition';

	let { data } = $props();
	const { locale } = data;

	const sysState = getSysState();

	const Page = $derived(Pages[sysState.pageNum]);

	onMount(() => {
		sysState.locale = locale;
	});
</script>

{#key sysState.pageNum}
	<div in:fade class="center-content flex-col" class:mix-blend-multiply={sysState.pageNum !== 5}>
		<Page />
	</div>
{/key}
