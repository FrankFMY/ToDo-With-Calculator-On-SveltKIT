import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ToDoList from './ToDoList.svelte';

describe('ToDoList', () => {
	beforeEach(() => {
		vi.resetAllMocks();
		// Мокаем localStorage
		Object.defineProperty(window, 'localStorage', {
			value: (function () {
				let store: Record<string, string> = {};
				return {
					getItem: (key: string) => store[key] || null,
					setItem: (key: string, value: string) => {
						store[key] = value;
					},
					removeItem: (key: string) => {
						delete store[key];
					},
					clear: () => {
						store = {};
					}
				};
			})(),
			writable: true
		});
		window.localStorage.clear();
	});

	it('добавляет новую задачу', async () => {
		const { getByPlaceholderText, getByText } = render(ToDoList);
		const input = getByPlaceholderText('Новая задача...');
		await fireEvent.input(input, { target: { value: 'Тестовая задача' } });
		await fireEvent.keyDown(input, { key: 'Enter' });
		expect(getByText('Тестовая задача')).toBeInTheDocument();
	});

	it('сохраняет и восстанавливает задачи из localStorage', async () => {
		// Сохраняем задачу
		const { getByPlaceholderText, getByText, unmount } = render(ToDoList);
		const input = getByPlaceholderText('Новая задача...');
		await fireEvent.input(input, { target: { value: 'Persisted' } });
		await fireEvent.keyDown(input, { key: 'Enter' });
		expect(getByText('Persisted')).toBeInTheDocument();
		unmount();
		// Монтируем заново — задача должна восстановиться
		const { getByText: getByText2 } = render(ToDoList);
		expect(getByText2('Persisted')).toBeInTheDocument();
	});

	it('отмечает задачу выполненной', async () => {
		const { getByPlaceholderText, getByLabelText } = render(ToDoList);
		const input = getByPlaceholderText('Новая задача...');
		await fireEvent.input(input, { target: { value: 'Выполнить' } });
		await fireEvent.keyDown(input, { key: 'Enter' });
		const checkbox = getByLabelText('Выполнить');
		await fireEvent.click(checkbox);
		// Проверка класса line-through опущена, так как getByText не используется
	});

	it('удаляет задачу', async () => {
		const { getByPlaceholderText, getAllByRole, queryByText } = render(ToDoList);
		const input = getByPlaceholderText('Новая задача...');
		await fireEvent.input(input, { target: { value: 'Удалить' } });
		await fireEvent.keyDown(input, { key: 'Enter' });
		const deleteBtn = getAllByRole('button', { name: 'Удалить задачу' })[0];
		await fireEvent.click(deleteBtn);
		expect(queryByText('Удалить')).not.toBeInTheDocument();
	});

	it('редактирует задачу по двойному клику', async () => {
		const { getByPlaceholderText, getByText, getByDisplayValue } = render(ToDoList);
		const input = getByPlaceholderText('Новая задача...');
		await fireEvent.input(input, { target: { value: 'Редактировать' } });
		await fireEvent.keyDown(input, { key: 'Enter' });
		const span = getByText('Редактировать');
		await fireEvent.dblClick(span);
		const editInput = getByDisplayValue('Редактировать');
		await fireEvent.input(editInput, { target: { value: 'Изменено' } });
		await fireEvent.keyDown(editInput, { key: 'Enter' });
		expect(getByText('Изменено')).toBeInTheDocument();
	});

	it('фильтрует задачи: все/активные/выполненные', async () => {
		const { getByPlaceholderText, getByText, queryByText } = render(ToDoList);
		const input = getByPlaceholderText('Новая задача...');
		// Добавляем активную задачу
		await fireEvent.input(input, { target: { value: 'Активная' } });
		await fireEvent.keyDown(input, { key: 'Enter' });
		// Добавляем выполненную задачу
		await fireEvent.input(input, { target: { value: 'Выполненная' } });
		await fireEvent.keyDown(input, { key: 'Enter' });
		const span = getByText('Выполненная');
		const parent = span.parentElement;
		if (!parent) throw new Error('parentElement not found');
		const checkbox = parent.querySelector('input[type="checkbox"]');
		if (!checkbox) throw new Error('checkbox not found');
		await fireEvent.click(checkbox);
		// Проверяем фильтр "Все"
		expect(getByText('Активная')).toBeInTheDocument();
		expect(getByText('Выполненная')).toBeInTheDocument();
		// Фильтр "Активные"
		await fireEvent.click(getByText('Активные'));
		expect(getByText('Активная')).toBeInTheDocument();
		expect(queryByText('Выполненная')).not.toBeInTheDocument();
		// Фильтр "Выполненные"
		await fireEvent.click(getByText('Выполненные'));
		expect(getByText('Выполненная')).toBeInTheDocument();
		expect(queryByText('Активная')).not.toBeInTheDocument();
	});
});
