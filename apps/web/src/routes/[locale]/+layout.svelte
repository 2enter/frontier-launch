<script lang="ts">
	import { toFixedDigit } from '@repo/lib/utils/calc';

	import moment from 'moment';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { navigating } from '$app/stores';
	import { dev } from '$app/environment';

	import { sysState } from '@/states';
	import { LAUNCH_TIMEOUT } from '@/config';
	import { FullscreenChecker } from '@/components';

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

<div class="fixed top-0 z-[1000] w-full text-center">
	{#if launchCountDown}
		{@const time = moment(launchCountDown)}
		{toFixedDigit(time.minute())}:{toFixedDigit(time.second())}
	{/if}
</div>

<div class="center-content fixed bottom-0 z-[1000] w-full">
	<img src="/ui/texts/2enter.png" class="h-10" alt="" />
</div>

<div class="full-screen center-content bg-contain bg-center bg-no-repeat" style:background-image="url({sysState.bg})">
	{@render children()}
</div>

<FullscreenChecker />

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

<button class="btn btn-secondary fixed left-0 top-0 z-[3000]" onclick={() => window.location.reload()}>reload</button>
