<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	let theme: 'light' | 'dark' = 'light';
	let mounted = false;

	function setThemeClass(newTheme: 'light' | 'dark') {
		document.documentElement.classList.toggle('dark', newTheme === 'dark');
		document.body.classList.toggle('dark', newTheme === 'dark');
	}

	function syncTheme(newTheme: 'light' | 'dark') {
		theme = newTheme;
		localStorage.setItem('theme', theme);
		setThemeClass(theme);
	}

	function toggleTheme() {
		syncTheme(theme === 'dark' ? 'light' : 'dark');
	}

	onMount(() => {
		let saved = localStorage.getItem('theme');
		if (saved === 'dark' || saved === 'light') {
			theme = saved;
			setThemeClass(theme);
		} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			theme = 'dark';
			setThemeClass('dark');
		} else {
			theme = 'light';
			setThemeClass('light');
		}
		mounted = true;
	});
</script>

<div
	class="flex min-h-screen flex-col bg-gray-100 text-gray-900 transition-colors duration-300 dark:bg-gray-900 dark:text-gray-100"
>
	<button
		class="fixed right-6 top-6 z-50 rounded-full bg-gray-200 p-2 shadow transition hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:hover:bg-gray-700"
		onclick={toggleTheme}
		aria-label="Переключить тему"
		title="Переключить тему"
	>
		{#if mounted && theme === 'dark'}
			<!-- Moon icon -->
			<svg
				class="h-7 w-7 transition-transform duration-300"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
				/>
			</svg>
		{:else}
			<!-- Sun icon -->
			<svg
				class="h-7 w-7 transition-transform duration-300"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<circle cx="12" cy="12" r="5" stroke-width="2" />
				<path
					stroke-linecap="round"
					stroke-width="2"
					d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.05 6.05L4.64 4.64m12.02 0l-1.41 1.41M6.05 17.95l-1.41 1.41"
				/>
			</svg>
		{/if}
	</button>
	<slot />
</div>
