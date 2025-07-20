<script lang="ts">
	import { ToDoList, Calculator } from '$lib';
	let showCalculator = false;
</script>

<div class="flex min-h-screen flex-1 items-center justify-center">
	<div class="flex w-full max-w-5xl flex-col items-start justify-center gap-6 md:flex-row">
		<div class="w-full max-w-md">
			<ToDoList />
			<div class="mt-4 flex justify-end">
				<button
					class="flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-white shadow transition hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
					onclick={() => (showCalculator = !showCalculator)}
					aria-label="Открыть калькулятор"
					title="Калькулятор"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						class="h-5 w-5"
					>
						<rect x="4" y="3" width="16" height="18" rx="2" stroke-width="2" />
						<rect x="8" y="7" width="8" height="2" rx="1" stroke-width="2" />
						<circle cx="8" cy="13" r="1" />
						<circle cx="12" cy="13" r="1" />
						<circle cx="16" cy="13" r="1" />
						<circle cx="8" cy="17" r="1" />
						<circle cx="12" cy="17" r="1" />
						<circle cx="16" cy="17" r="1" />
					</svg>
					Калькулятор
				</button>
			</div>
		</div>
		{#if showCalculator}
			<div class="mt-6 w-full max-w-xs md:ml-6 md:mt-0">
				<Calculator />
			</div>
		{/if}
	</div>
</div>
