<script lang="ts">
	import moment from 'moment';
	import { onMount } from 'svelte';
	import { Previous } from 'runed';
	import { makeWSClient, Timer } from '@2enter/web-kit/runtime';
	import { toFixedDigit } from '@2enter/web-kit/calc';
	import { SpeedTester } from '@2enter/web-kit/browser';
	import { dev } from '$app/environment';
	import { page } from '$app/state';
	import { apiUrl, getCargoes, getSysTemp } from '@/api';

	async function init() {
		const { data } = await getCargoes();
		if (!data) return;
		cargoIds = data;
	}

	const speedTester = new SpeedTester({
		configs: {
			measureUploadLoadedLatency: false,
			measureDownloadLoadedLatency: false,
			measurements: [{ type: 'download', bytes: 1e5, count: 17 }],
			autoStart: false
		},
		onFinish: (result) => {
			const summary = result.getSummary();
			const { download } = summary;
			if (download) {
				info.windSpeed = +(download / 3000000).toFixed(1);
			}
		}
	});

	const timer: Timer = new Timer({
		triggers: [
			{
				// update info.temperature
				check: () => moment(timer.now).second() % 3 === 0,
				action: async () => {
					const { data } = await getSysTemp();
					if (!data) return;
					info.temperature = data;
				}
			},
			{
				// update info.windSpeed
				check: () => moment(timer.now).second() % 10 === 0,
				action: () => speedTester.test()
			}
			// {
			// 	// update info.raining (only for testing)
			// 	check: () => moment(timer.now).seconds() % 8 === 0,
			// 	action: () => (info.raining = !info.raining)
			// }
		]
	});

	const info = $state({
		raining: false,
		temperature: 0,
		population: 0,
		windSpeed: 0
	});

	const speedDegree = $derived.by<'slow' | 'medium' | 'fast'>(() => {
		if (info.windSpeed > 6) return 'fast';
		else if (info.windSpeed > 3) return 'medium';
		else return 'slow';
	});

	let cargoIds = $state<string[]>([]);
	let weatherBg = $state<'sun' | 'rain'>('rain');

	const previousRaining = new Previous(() => info.raining);

	$effect(() => {
		if (info.raining !== previousRaining.current) {
			console.log('switching weather');
			weatherBg = previousRaining.current ? 'sun' : 'rain';
		}
	});

	const wsUrl = dev
		? `ws://${page.url.hostname}:3080/ws`
		: page.url.hostname.includes('2enter')
			? `wss://${page.url.hostname}/ws`
			: `ws://${page.url.hostname}:3080/ws`;

	onMount(async () => {
		await init();

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
						info.population = data.amount * 10 + ~~(Math.random() * 10);
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

		return {
			destroy() {
				console.log('destroy');
				ws.close();
				timer.stop();
			}
		};
	});
</script>

<svelte:head>
	<title>CCTV</title>
</svelte:head>

<div
	class="full-screen bg-contain bg-center bg-no-repeat"
	style:background-image="url(/ui/layouts/tv_bg.webp)"
>
	{#if timer}
		{@const time = moment(timer.now)}
		<div class="fixed right-0 top-0 p-8 text-7xl font-bold tracking-wider">
			{toFixedDigit(time.hour())}:{toFixedDigit(time.minute())}
		</div>
	{/if}
	<div class="fixed bottom-[8.7vh] right-0 flex h-[16vh] w-[200vw] justify-end gap-2 pr-2">
		{#each cargoIds as cargoId}
			<img src={apiUrl(`/storage/texture/${cargoId}.jpg`)} alt="" />
		{/each}
	</div>

	<div class="info-value center-content left-[68vw] top-[5vh] gap-4">
		<i class="fa-solid fa-alien-8bit"></i>
		{info.population}
	</div>

	<div class="info-value left-[74vw] top-[5vh] flex">
		<img src="/ui/cctv/wind_{speedDegree}.webp" class="w-20" alt="" />{info.windSpeed} mph
	</div>

	<div class="fixed -right-16 top-[10vh]">
		<img src="/ui/cctv/{weatherBg}.webp" class="h-64" alt="" />
	</div>

	<div
		class="info-value right-[2vw] top-[35vh] flex flex-col items-end justify-end gap-4 tracking-tighter"
	>
		<i class="fa-solid fa-temperature-list text-5xl"></i>
		{info.temperature}°C
	</div>
</div>

<style lang="postcss">
	* {
		color: white;
	}

	.info-value {
		@apply tracking-tighter;
		font-size: 1.8rem;
		position: fixed;
	}
</style>
