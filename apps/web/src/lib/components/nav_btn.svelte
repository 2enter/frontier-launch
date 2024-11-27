<script lang="ts">
	import type { Snippet } from 'svelte';
	import { sysState } from '@/states';

	interface Props {
		children?: Snippet;
		action: -1 | 1;
		class?: string;
		onclick?: Function;
	}

	let { children, action, class: className, onclick }: Props = $props();
</script>

{#if children}
	<button
		onclick={async () => {
			await onclick?.();
			sysState.navigate(action);
		}}
		class={className}
		aria-label="button"
	>
		{@render children()}
	</button>
{:else}
	<button
		onclick={async () => {
			await onclick?.();
			sysState.navigate(action);
		}}
		class="{className} btn btn-primary"
		aria-label="button"
	>
		<i class="fa-solid text-xl" class:fa-arrow-right={action === 1} class:fa-arrow-left={action === -1}></i>
	</button>
{/if}
