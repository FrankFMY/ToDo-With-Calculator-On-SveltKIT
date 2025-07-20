import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Page from '../src/routes/+page.svelte';

describe('sum test', () => {
	it('adds 1 + 2 to equal 3', () => {
		expect(1 + 2).toBe(3);
	});
});

describe('Интеграция: ToDoList + Calculator', () => {
	it('отображает ToDoList и кнопку калькулятора', () => {
		const { getByText } = render(Page);
		expect(getByText('Тудушник')).toBeInTheDocument();
		expect(getByText('Калькулятор')).toBeInTheDocument();
	});

	it('открывает калькулятор по кнопке', async () => {
		const { getByText } = render(Page);
		const btn = getByText('Калькулятор');
		await fireEvent.click(btn);
		expect(getByText('Калькулятор')).toBeInTheDocument(); // заголовок модалки
		expect(getByText('=')).toBeInTheDocument();
	});
});
