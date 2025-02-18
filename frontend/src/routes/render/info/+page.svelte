<script lang="ts">
	import { type Cargo, CargoStatus } from '@/types/model';

	import { CronJob } from 'cron';
	import { Marquee } from '@2enter/web-kit/components';
	import { toFixedDigit } from '@2enter/web-kit/calc';
	import { getTodayCargoes } from '@/api';
	import { getLaunchCountDown } from '@/time';
	import { DEFAULT_CRON_CONFIG } from '@/config';

	let cargoes = $state<Cargo[]>([]);

	const text = $derived.by<string>(() => {
		if (!cargoes.length) return '';
		const countDown = getLaunchCountDown();
		const { min, sec } = countDown;

		const info = Object.values(CargoStatus).map(
			(status) => cargoes.filter((cargo) => cargo.status === status).length
		);

		return (
			`距離下次火箭發射還有${toFixedDigit(min)}分${toFixedDigit(sec)}秒，今日貨物狀況：` +
			`已發射${info[0] ?? 0}件、待發射${info[1] ?? 0}件、集運中${info[2] ?? 0}件~~~`
		);
	});

	CronJob.from({
		cronTime: '*/20 * * * * *',
		onTick: async () => {
			const { data } = await getTodayCargoes();
			if (!data) return;
			console.log(data);
			cargoes = data;
		},
		...DEFAULT_CRON_CONFIG
	});
</script>

<svelte:head>
	<title>Console Info</title>
</svelte:head>

<div
	class="flex items-center whitespace-nowrap bg-rose-800 text-[85vh] tracking-widest text-amber-500 full-screen font-dot-gothic"
>
	{#if cargoes.length}
		<Marquee {text} timeout={500} />
	{/if}
</div>
