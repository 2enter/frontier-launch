<script lang="ts">
	import { onMount } from 'svelte';
	import { sysState } from '@/states';
	import { Pages } from './pages';
	import { fade } from 'svelte/transition';

	let { data } = $props();
	const { locale } = data;
	const Page = $derived(Pages[sysState.pageNum]);

	onMount(() => {
		sysState.locale = locale;
	});
</script>

{#key sysState.pageNum}
	<div in:fade class="center-content flex-col mix-blend-multiply">
		<Page />
	</div>
{/key}
