<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	import { sysState } from '@/states';

	let line = $state(0);

	onMount(() => {
		const interval = setInterval(() => {
			line++;
			console.log(line);
			if (line === 7) clearInterval(interval);
		}, 2000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

{#each { length: line + 1 } as _, i}
	<img in:fade src="/ui/texts/description_page/{i}.png" class="fixed w-11/12" alt={i.toString()} />
{/each}

<button
	class="full-screen z-[2000]"
	aria-label="button"
	onclick={() => {
		if (line < 7) {
			line = 7;
			return;
		}
		sysState.navigate(1);
	}}
></button>
