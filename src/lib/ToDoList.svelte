<script lang="ts">
	// Svelte 5 runes API
	type Todo = { id: number; text: string; completed: boolean };
	let newTodo = $state('');
	let nextId = $state(1);
	let todos = $state<Todo[]>([]);
	let editingId = $state<number | null>(null);
	let editingText = $state('');
	let filter = $state<'all' | 'active' | 'completed'>('all');
	let editInputRef = $state<HTMLInputElement | null>(null);

	// localStorage sync (инициализация)
	$effect(() => {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('todos');
			if (saved) {
				try {
					const parsed: Todo[] = JSON.parse(saved);
					todos = parsed;
					nextId = parsed.reduce((max, t) => Math.max(max, t.id), 0) + 1;
				} catch {
					/* ignore parse error, fallback to empty list */
				}
			}
		}
	});
	// localStorage sync (обновление)
	$effect(() => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('todos', JSON.stringify(todos));
		}
	});

	// filteredTodos — $derived
	let filteredTodos = $derived(
		todos.filter((todo) =>
			filter === 'all' ? true : filter === 'active' ? !todo.completed : todo.completed
		)
	);

	function addTodo() {
		if (newTodo.trim()) {
			todos = [...todos, { id: nextId, text: newTodo.trim(), completed: false }];
			nextId = nextId + 1;
			newTodo = '';
		}
	}
	function removeTodo(id: number) {
		todos = todos.filter((todo) => todo.id !== id);
	}
	function toggleTodo(id: number) {
		todos = todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
	}
	function startEdit(todo: Todo) {
		editingId = todo.id;
		editingText = todo.text;
	}
	function saveEdit(todo: Todo) {
		if (editingText.trim()) {
			todos = todos.map((t) => (t.id === todo.id ? { ...t, text: editingText.trim() } : t));
		}
		editingId = null;
		editingText = '';
	}
	function cancelEdit() {
		editingId = null;
		editingText = '';
	}
	$effect(() => {
		if (editingId !== null && editInputRef) {
			editInputRef.focus();
		}
	});

	// Для поддержки {@render actions()}:
	// (объявление не требуется, {@render actions()} работает автоматически)
</script>

<div
	class="mx-auto mt-4 w-full max-w-md rounded-xl bg-white p-4 shadow-md sm:mt-8 sm:p-6 dark:bg-gray-800"
>
	<h2 class="mb-4 text-center text-2xl font-bold dark:text-gray-100">
		To-Do & Calculator on SvelteKIT
	</h2>
	<div class="mb-4 flex flex-col gap-2 sm:flex-row">
		<input
			class="flex-1 rounded border px-3 py-2 focus:border-blue-400 focus:ring focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
			type="text"
			placeholder="Новая задача..."
			bind:value={newTodo}
			onkeydown={(e) => e.key === 'Enter' && addTodo()}
			aria-label="Добавить задачу"
		/>
		<button
			class="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 sm:mt-0"
			onclick={addTodo}
			aria-label="Добавить задачу"
			>+
		</button>
	</div>
	<div class="mb-4 flex justify-center gap-2">
		<button
			class="rounded border px-3 py-1 text-sm font-medium transition focus:border-blue-400 focus:ring focus:outline-none {filter ===
			'all'
				? 'bg-blue-500 text-white'
				: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'}"
			onclick={() => (filter = 'all')}
			aria-pressed={filter === 'all'}>Все</button
		>
		<button
			class="rounded border px-3 py-1 text-sm font-medium transition focus:border-blue-400 focus:ring focus:outline-none {filter ===
			'active'
				? 'bg-blue-500 text-white'
				: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'}"
			onclick={() => (filter = 'active')}
			aria-pressed={filter === 'active'}>Активные</button
		>
		<button
			class="rounded border px-3 py-1 text-sm font-medium transition focus:border-blue-400 focus:ring focus:outline-none {filter ===
			'completed'
				? 'bg-blue-500 text-white'
				: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600'}"
			onclick={() => (filter = 'completed')}
			aria-pressed={filter === 'completed'}>Выполненные</button
		>
	</div>
	<ul>
		{#each filteredTodos as todo (todo.id)}
			<li
				class="group flex items-center justify-between border-b py-2 last:border-b-0 dark:border-gray-700"
			>
				<label class="flex flex-1 cursor-pointer items-center gap-2">
					<input type="checkbox" checked={todo.completed} onchange={() => toggleTodo(todo.id)} />
					{#if editingId === todo.id}
						<input
							class="flex-1 rounded border px-2 py-1 focus:border-blue-400 focus:ring focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
							bind:value={editingText}
							bind:this={editInputRef}
							onkeydown={(e) => {
								if (e.key === 'Enter') saveEdit(todo);
								else if (e.key === 'Escape') cancelEdit();
							}}
							onblur={() => saveEdit(todo)}
						/>
					{:else}
						<span
							class={todo.completed
								? 'text-gray-400 line-through dark:text-gray-500'
								: 'dark:text-gray-100'}
							ondblclick={() => startEdit(todo)}
							title="Двойной клик для редактирования"
							role="button"
							tabindex="0"
							onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && startEdit(todo)}
							>{todo.text}</span
						>
					{/if}
				</label>
				<button
					class="text-red-500 opacity-0 transition group-hover:opacity-100 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
					onclick={() => removeTodo(todo.id)}
					aria-label="Удалить задачу"
					>✕
				</button>
			</li>
		{/each}
	</ul>
	<!-- actions-слот убран -->
</div>
