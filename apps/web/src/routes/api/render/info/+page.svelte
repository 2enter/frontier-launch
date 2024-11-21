<script lang="ts">
	import { Marquee } from '@repo/ui';
	import { TimerState } from '@repo/lib/utils/runtime';
	import moment from 'moment';
	import { LAUNCH_TIMEOUT } from '@/config';

	let info = $state<ConsoleInfo>();
	const countDown = $derived(LAUNCH_TIMEOUT - (info?.duration ?? 0));
	const text = $derived.by<string>(() => {
		if (!info) return '';
		const time = moment(countDown);
		const minute = time.minute();
		const second = time.second();
		const { cargoes } = info;
		return (
			`距離下次火箭發射還有${minute}分${second}秒，今日貨物狀況：` +
			`已發射${cargoes.launched ?? 0}件、待發射${cargoes.shipped ?? 0}件、集運中${cargoes.shipping ?? 0}件      `
		);
	});

	const timer: TimerState = new TimerState({
		triggers: [
			{
				check: () => moment(timer.duration).second() % 10 === 0,
				action: async () => {
					const data = (await fetch('/api/console/info')
						.then((res) => res.json().then((data) => data))
						.catch((_) => null)) as ConsoleInfo | null;

					if (!data) return;
					info = data;
				}
			}
		]
	});
</script>

{#if info}
	<div class="full-screen font-dot-gothic flex items-center whitespace-nowrap bg-rose-800 text-[85vh] tracking-widest text-amber-500">
		<Marquee {text} timeout={500} />
	</div>
{/if}
