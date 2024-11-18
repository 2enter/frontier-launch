<script lang="ts">
	import { makeWSClient } from '@repo/lib/utils/runtime';

	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { page } from '$app/stores';

	const wsUrl = dev
		? `ws://${$page.url.hostname}:8001/ws`
		: $page.url.hostname.includes('2enter')
			? `wss://${$page.url.hostname}/ws`
			: `ws://${$page.url.hostname}:3000/ws`;

	onMount(() => {
		let ws = makeWSClient<WSData>({
			url: wsUrl,
			onmessage: async (data) => {
				console.log(data);
			}
		});
	});
</script>
