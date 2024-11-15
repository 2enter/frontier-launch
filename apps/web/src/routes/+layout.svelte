<script lang="ts">
	import '@repo/config/app.css';
	import '../app.css';

	import { parseTime, toFixedDigit } from '@repo/lib/utils/calc';

	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { PUBLIC_FA_KIT_URL } from '$env/static/public';
	import { navigating } from '$app/stores';
	import { dev } from '$app/environment';

	import { sysState } from '@/states';
	import { LAUNCH_TIMEOUT } from '@/config';

	let { children } = $props();
	let launchCountDown = $state<number>();

	onMount(async () => {
		if (dev) {
			const eruda = (await import('eruda')).default;
			eruda.init();
		}

		const interval = setInterval(async () => {
			launchCountDown = LAUNCH_TIMEOUT - (await fetch('/api/console/duration').then((data) => data.json().then((result) => result)));
		}, 1000);

		return {
			destroy() {
				clearInterval(interval);
			}
		};
	});
</script>

<svelte:head>
	{#if PUBLIC_FA_KIT_URL}
		<script src={PUBLIC_FA_KIT_URL} crossorigin="anonymous"></script>
	{/if}
</svelte:head>

<div class="fixed top-0 z-[1000] w-full text-center">
	{#if launchCountDown}
		{@const { minute, second } = parseTime(launchCountDown)}
		{toFixedDigit(minute)}:{toFixedDigit(second)}
	{/if}
</div>
<div class="full-screen center-content">
	{@render children()}
</div>

<dialog bind:this={sysState.dialog} class="modal modal-middle">
	<div class="modal-box">
		<h1>{sysState.localization.error}</h1>
		<p>{sysState.errorMessage}</p>
		<div class="modal-action">
			<form method="dialog">
				<button class="btn btn-secondary" onclick={sysState.closeError}>
					{sysState.localization.close}
				</button>
			</form>
		</div>
	</div>
</dialog>

{#if sysState.processing || $navigating}
	<div transition:fade class="full-screen center-content z-[100000] bg-black/10 backdrop-blur-sm">
		<i class="fa-solid fa-loader fa-duotone animate-spin text-8xl"></i>
	</div>
{/if}
