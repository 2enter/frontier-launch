<script lang="ts">
	import { Marquee } from '@repo/ui';
	import { onMount } from 'svelte';

	let { data } = $props();
	const { title } = data;
	let dir = $state<'ver' | 'hor' | null>(null);

	onMount(() => {
		const { innerWidth: width, innerHeight: height } = window;
		dir = width > height ? 'hor' : 'ver';
	});
</script>

<svelte:head>
	<title>News</title>
</svelte:head>

{#if dir}
	<div class="full-screen center-content font-dot-gothic whitespace-nowrap {dir}" style:background-color="hsl({+(Math.random() * 200)}, 100%, 80%)">
		<Marquee text={title} timeout={500} />
	</div>
{/if}

<style>
	.ver {
		writing-mode: vertical-rl;
		text-orientation: mixed;
		font-size: 90vw;
	}

	.hor {
		font-size: 90vh;
	}
</style>
