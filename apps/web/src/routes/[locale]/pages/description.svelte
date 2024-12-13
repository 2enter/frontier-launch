<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { getSysState } from '@/states';

	const sysState = getSysState();

	let line = $state(0);

	onMount(() => {
		const interval = setInterval(() => {
			if (line === 7) {
				clearInterval(interval);
				return;
			}
			line++;
			console.log(line);
		}, 1500);

		return () => {
			clearInterval(interval);
		};
	});
</script>

{#each { length: line + 1 } as _, i}
	<img in:fade src="/ui/texts/description_page/{i}.webp" class="fixed w-11/12" alt={i.toString()} />
{/each}

<button
	class="full-screen z-[2000]"
	aria-label="button"
	onclick={() => {
		if (line < 7) {
			line = 7;
			return;
		}
		sysState.navigate();
	}}
></button>
