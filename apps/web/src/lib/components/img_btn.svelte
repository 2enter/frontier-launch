<script lang="ts">
	interface Props {
		src: string;
		onclick?: () => void;
		ontouchstart?: () => void;
		ontouchend?: () => void;
		class?: string;
	}

	let { class: className, src, onclick = () => {}, ontouchstart, ontouchend }: Props = $props();

	let img = $state<HTMLImageElement>();

	function scaleImg(num: number) {
		if (!img) return;
		img.style.transform = `scale(${num})`;
	}
</script>

<button
	class="{className} "
	{onclick}
	ontouchstart={() => {
		scaleImg(0.9);
		ontouchstart?.();
	}}
	ontouchend={() => {
		scaleImg(1);
		ontouchend?.();
	}}
>
	<img bind:this={img} {src} alt="" class="transition-transform duration-100" />
</button>
