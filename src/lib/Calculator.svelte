<script lang="ts">
	import { evaluate, format } from 'mathjs';
	let display = $state('');
	let result = $state('');
	let copySuccess = $state(false);
	let containerRef = $state<HTMLDivElement | null>(null);

	function append(val: string) {
		if (result) {
			display = '';
			result = '';
		}
		display += val;
	}
	function clear() {
		display = '';
		result = '';
	}
	function del() {
		display = display.slice(0, -1);
	}
	function calculate() {
		try {
			// math.js безопасно парсит выражения, поддерживает скобки, дроби, edge-cases
			const raw = evaluate(display.replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-'));
			// Ограничиваем длину результата и форматируем вывод
			result = format(raw, { precision: 14 });
			if (!isFinite(Number(result))) result = 'Ошибка';
		} catch {
			result = 'Ошибка';
		}
	}
	async function copyResult() {
		if (result && result !== 'Ошибка') {
			await navigator.clipboard.writeText(result);
			copySuccess = true;
			setTimeout(() => (copySuccess = false), 1500);
		}
	}
	function handleKey(e: KeyboardEvent) {
		if (e.ctrlKey || e.metaKey || e.altKey) return;
		if (e.key >= '0' && e.key <= '9') append(e.key);
		else if ('+-*/().'.includes(e.key)) append(e.key);
		else if (e.key === 'Enter' || e.key === '=') calculate();
		else if (e.key === 'Backspace') del();
		else if (e.key === 'Escape') clear();
	}
	$effect(() => {
		if (containerRef) {
			containerRef.onkeydown = handleKey;
			// containerRef.tabIndex = 0; // удалено для a11y
		}
	});
</script>

<div
	class="mx-auto w-full max-w-xs rounded-xl bg-white p-4 shadow-lg outline-none sm:max-w-sm sm:p-6 dark:bg-gray-800"
	bind:this={containerRef}
	aria-label="Калькулятор"
	role="region"
>
	<h2 class="mb-2 text-center text-xl font-bold dark:text-gray-100">Калькулятор</h2>
	<div
		class="mb-2 min-h-[2.5rem] text-right font-mono text-2xl text-gray-700 dark:text-gray-100"
		aria-label="Ввод"
	>
		{display || '0'}
	</div>
	<div
		class="mb-4 flex min-h-[1.5rem] items-center justify-end gap-2 text-right font-mono text-lg text-blue-600 dark:text-blue-400"
	>
		<span aria-label="Результат">{result}</span>
		<button
			class="rounded border border-gray-200 bg-gray-100 px-2 py-1 text-xs text-gray-600 transition hover:bg-blue-100 dark:border-gray-700 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-blue-900"
			onclick={copyResult}
			aria-label="Скопировать результат"
			title="Скопировать результат"
			disabled={!result || result === 'Ошибка'}
		>
			{copySuccess ? '✔' : '⧉'}
		</button>
		{#if copySuccess}
			<span class="animate-fade text-xs text-green-500 dark:text-green-400">Скопировано!</span>
		{/if}
	</div>
	<div class="grid grid-cols-4 gap-2">
		<button
			class="rounded-lg bg-gray-100 p-2 font-mono text-lg transition hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			onclick={clear}>C</button
		>
		<button
			class="rounded-lg bg-gray-100 p-2 font-mono text-lg transition hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			onclick={del}>⌫</button
		>
		<button
			class="rounded-lg bg-gray-100 p-2 font-mono text-lg transition hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			onclick={() => append('(')}>(</button
		>
		<button
			class="rounded-lg bg-gray-100 p-2 font-mono text-lg transition hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			onclick={() => append(')')}>)</button
		>
		<button
			class="rounded-lg bg-gray-100 p-2 font-mono text-lg transition hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			onclick={() => append('7')}>7</button
		>
		<button
			class="rounded-lg bg-gray-100 p-2 font-mono text-lg transition hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			onclick={() => append('8')}>8</button
		>
		<button
			class="rounded-lg bg-gray-100 p-2 font-mono text-lg transition hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			onclick={() => append('9')}>9</button
		>
		<button
			class="rounded-lg bg-gray-100 p-2 font-mono text-lg transition hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			onclick={() => append('/')}>÷</button
		>
		<button
			class="rounded-lg bg-gray-100 p-2 font-mono text-lg transition hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			onclick={() => append('4')}>4</button
		>
		<button
			class="rounded-lg bg-gray-100 p-2 font-mono text-lg transition hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			onclick={() => append('5')}>5</button
		>
		<button
			class="rounded-lg bg-gray-100 p-2 font-mono text-lg transition hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			onclick={() => append('6')}>6</button
		>
		<button
			class="rounded-lg bg-gray-100 p-2 font-mono text-lg transition hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			onclick={() => append('*')}>×</button
		>
		<button
			class="rounded-lg bg-gray-100 p-2 font-mono text-lg transition hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			onclick={() => append('1')}>1</button
		>
		<button
			class="rounded-lg bg-gray-100 p-2 font-mono text-lg transition hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			onclick={() => append('2')}>2</button
		>
		<button
			class="rounded-lg bg-gray-100 p-2 font-mono text-lg transition hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			onclick={() => append('3')}>3</button
		>
		<button
			class="rounded-lg bg-gray-100 p-2 font-mono text-lg transition hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			onclick={() => append('-')}>−</button
		>
		<button
			class="rounded-lg bg-gray-100 p-2 font-mono text-lg transition hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			onclick={() => append('0')}>0</button
		>
		<button
			class="rounded-lg bg-gray-100 p-2 font-mono text-lg transition hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			onclick={() => append('.')}>.</button
		>
		<button
			class="col-span-2 rounded-lg bg-blue-500 p-2 font-mono text-white transition hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
			onclick={calculate}>=</button
		>
		<button
			class="rounded-lg bg-gray-100 p-2 font-mono text-lg transition hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
			onclick={() => append('+')}>+</button
		>
	</div>
</div>

<style>
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.animate-fade {
		animation: fade 0.5s;
	}
</style>
