<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		src: string;
		onclick?: () => void;
		class?: string;
	}

	let { class: className, src, onclick }: Props = $props();

	let btn = $state<HTMLButtonElement>();
	let img = $state<HTMLImageElement>();

	onMount(() => {
		if (!btn) return;
		btn.addEventListener('touchstart', (e) => {
			if (!img) return;
			img.style.transform = 'scale(0.9)';
		});

		btn.addEventListener('touchend', (e) => {
			if (!img) return;
			img.style.transform = 'scale(1)';
		});

		return () => {
			if (!btn) return;
			btn.removeEventListener('touchstart', (e) => {
				if (!img) return;
				img.style.transform = 'scale(0.9)';
			});
			btn.removeEventListener('touchend', (e) => {
				if (!img) return;
				img.style.transform = 'scale(1)';
			});
		};
	});
</script>

<button bind:this={btn} class="{className} " {onclick}>
	<img bind:this={img} {src} alt="" class="transition-transform duration-100" />
</button>
