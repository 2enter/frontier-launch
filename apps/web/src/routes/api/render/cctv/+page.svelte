<script lang="ts">
	import { makeWSClient, TimerState } from '@repo/lib/utils/runtime';
	import { toFixedDigit } from '@repo/lib/utils/calc';
	import { SpeedTester } from '@repo/lib/utils/browser';

	import moment from 'moment';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { page } from '$app/stores';

	let { data } = $props();

	const speedTester = new SpeedTester({
		configs: {
			measureUploadLoadedLatency: false,
			measureDownloadLoadedLatency: false,
			measurements: [{ type: 'download', bytes: 1e5, count: 10 }],
			autoStart: false
		},
		onFinish: (result) => {
			const summary = result.getSummary();
			info.windSpeed = summary.download ?? 0;
		}
	});

	const timer: TimerState = new TimerState({
		triggers: [
			{
				check: () => moment(timer.now).minute() % 10 === 0 && moment(timer.now).second() === 0,
				action: () => (info.temperature = genTemp())
			}
		]
	});

	const genTemp = () => ~~(Math.random() * 10);

	const info = $state({
		raining: false,
		temperature: genTemp(),
		population: 0,
		windSpeed: 0
	});

	let cargoIds = $state<string[]>(data.cargoes);

	const wsUrl = dev
		? `ws://${$page.url.hostname}:8001/ws`
		: $page.url.hostname.includes('2enter')
			? `wss://${$page.url.hostname}/ws`
			: `ws://${$page.url.hostname}:3000/ws`;

	onMount(() => {
		timer.triggers.push({
			check: () => moment(timer.now).second() % 5 === 0,
			action: () => speedTester.test()
		});
		let ws = makeWSClient<WSData>({
			url: wsUrl,
			onmessage: ({ data, message }) => {
				if (message) console.log(message);
				if (!data) return;
				switch (data.type) {
					case 'weather':
						info.raining = data.raining;
						break;
					case 'population':
						info.population = data.amount;
						break;
					case 'cargo':
						cargoIds.push(data.id);
						while (cargoIds.length > 11) {
							cargoIds.shift();
						}
						break;
				}
			}
		});

		return () => {
			ws.close();
		};
	});
</script>

<div class="full-screen bg-contain bg-center bg-no-repeat" style:background-image="url(/ui/layouts/tv_bg.png)">
	{#if timer}
		{@const time = moment(timer.now)}
		<div class="fixed right-0 top-0 p-8 text-7xl font-bold tracking-widest">
			{toFixedDigit(time.hour())}:{toFixedDigit(time.minute())}
		</div>
	{/if}
	<div class="fixed bottom-[8.7vh] right-0 flex h-[16vh] w-[200vw] justify-end gap-2 pr-2">
		{#each cargoIds as cargoId}
			<img src="/api/texture/{cargoId}" alt="" />
		{/each}
	</div>
	{info.temperature}
	{info.windSpeed}
</div>

<style>
	* {
		color: white;
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
	}
</style>
