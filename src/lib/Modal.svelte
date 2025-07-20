<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { browser } from '$app/environment';
	const dispatch = createEventDispatcher();
	export let open = false;

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			dispatch('close');
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			dispatch('close');
		}
	}

	onMount(() => {
		if (browser && open) {
			window.addEventListener('keydown', handleKeydown);
			return () => window.removeEventListener('keydown', handleKeydown);
		}
	});
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<div
			class="animate-fade-in max-w-full min-w-[320px] rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900 dark:shadow-2xl"
		>
			<button
				class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300"
				onclick={() => dispatch('close')}
				aria-label="Закрыть">✕</button
			>
			<slot></slot>
		</div>
	</div>
{/if}

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	.animate-fade-in {
		animation: fade-in 0.15s ease;
	}
</style>
