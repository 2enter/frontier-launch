<script lang="ts">
	import type { Cargo } from '@/types/model';
	import moment from 'moment';
	import { onMount } from 'svelte';
	import { getCargoes } from '@/api';
	import { page } from '$app/state';

	let cargoes = $state<Cargo[]>([]);
	const asMask = $derived(page.url.hash === '#mask');

	onMount(() => {
		console.log(page.url);
		const interval = setInterval(async () => {
			const { data, error } = await getCargoes();
			if (error) {
				console.error(error);
				return;
			}

			cargoes = data ?? [];
		}, 1000);

		return () => {
			clearInterval(interval);
		};
	});
</script>

<div class="bg-black px-3 text-white full-screen center-content">
	<div class="flex w-fit flex-row gap-2 overflow-x-hidden">
		{#each cargoes as { id, createdAt }}
			<div class="flex h-72 w-48 flex-col justify-center text-center *:font-dot-gothic">
				<span class:text-black={!asMask}>{moment(createdAt).format('YY/MM/DD HH:mm')}</span>
				<div class="size-48 bg-white">
					{#if !asMask}
						<img src="/api/storage/texture/{id}.jpg" class="size-48" alt="" />
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=DotGothic16&display=swap');
</style>
