import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Calculator from './Calculator.svelte';

describe('Calculator', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
	});

	it('складывает числа', async () => {
		const { getByText } = render(Calculator);
		await fireEvent.click(getByText('1'));
		await fireEvent.click(getByText('+'));
		await fireEvent.click(getByText('2'));
		await fireEvent.click(getByText('='));
		expect(getByText('3')).toBeInTheDocument();
	});

	it('вычитает числа', async () => {
		const { getByText } = render(Calculator);
		await fireEvent.click(getByText('5'));
		await fireEvent.click(getByText('−'));
		await fireEvent.click(getByText('3'));
		await fireEvent.click(getByText('='));
		expect(getByText('2')).toBeInTheDocument();
	});

	it('делит на ноль', async () => {
		const { getByText } = render(Calculator);
		await fireEvent.click(getByText('7'));
		await fireEvent.click(getByText('÷'));
		await fireEvent.click(getByText('0'));
		await fireEvent.click(getByText('='));
		expect(getByText('Ошибка')).toBeInTheDocument();
	});

	it('работает с клавиатурой', async () => {
		const { getByText } = render(Calculator);
		const region = document.querySelector('div[role="region"]');
		if (!region) throw new Error('region not found');
		(region as HTMLElement).focus();
		await fireEvent.keyDown(region, { key: '1' });
		await fireEvent.keyDown(region, { key: '+' });
		await fireEvent.keyDown(region, { key: '2' });
		await fireEvent.keyDown(region, { key: 'Enter' });
		expect(getByText('3')).toBeInTheDocument();
	});

	it('копирует результат', async () => {
		const { getByText } = render(Calculator);
		// Мокаем clipboard
		Object.assign(navigator, { clipboard: { writeText: vi.fn() } });
		await fireEvent.click(getByText('1'));
		await fireEvent.click(getByText('+'));
		await fireEvent.click(getByText('2'));
		await fireEvent.click(getByText('='));
		await fireEvent.click(getByText('⧉'));
		expect(navigator.clipboard.writeText).toHaveBeenCalledWith('3');
		// Проверяем смену иконки на ✔
		expect(getByText('✔')).toBeInTheDocument();
	});

	it('очищает по Escape', async () => {
		const { getByText } = render(Calculator);
		const region = document.querySelector('div[role="region"]');
		if (!region) throw new Error('region not found');
		(region as HTMLElement).focus();
		await fireEvent.keyDown(region, { key: '1' });
		await fireEvent.keyDown(region, { key: 'Escape' });
		expect(getByText('0')).toBeInTheDocument();
	});

	it('вычисляет выражения со скобками', async () => {
		const { getByText } = render(Calculator);
		await fireEvent.click(getByText('('));
		await fireEvent.click(getByText('2'));
		await fireEvent.click(getByText('+'));
		await fireEvent.click(getByText('3'));
		await fireEvent.click(getByText(')'));
		await fireEvent.click(getByText('×'));
		await fireEvent.click(getByText('4'));
		await fireEvent.click(getByText('='));
		expect(getByText('20')).toBeInTheDocument();
	});

	it('работает с дробными числами', async () => {
		const { getByText } = render(Calculator);
		await fireEvent.click(getByText('0'));
		await fireEvent.click(getByText('.'));
		await fireEvent.click(getByText('1'));
		await fireEvent.click(getByText('+'));
		await fireEvent.click(getByText('0'));
		await fireEvent.click(getByText('.'));
		await fireEvent.click(getByText('2'));
		await fireEvent.click(getByText('='));
		expect(getByText('0.3')).toBeInTheDocument();
	});

	it('корректно считает 0.1 + 0.2', async () => {
		const { getByText } = render(Calculator);
		await fireEvent.click(getByText('0'));
		await fireEvent.click(getByText('.'));
		await fireEvent.click(getByText('1'));
		await fireEvent.click(getByText('+'));
		await fireEvent.click(getByText('0'));
		await fireEvent.click(getByText('.'));
		await fireEvent.click(getByText('2'));
		await fireEvent.click(getByText('='));
		expect(getByText('0.3')).toBeInTheDocument();
	});

	it('обрабатывает ошибку синтаксиса', async () => {
		const { getByText } = render(Calculator);
		await fireEvent.click(getByText('+'));
		await fireEvent.click(getByText('+'));
		await fireEvent.click(getByText('2'));
		await fireEvent.click(getByText('='));
		expect(getByText('Ошибка')).toBeInTheDocument();
	});

	it('обрабатывает деление на ноль', async () => {
		const { getByText } = render(Calculator);
		await fireEvent.click(getByText('1'));
		await fireEvent.click(getByText('÷'));
		await fireEvent.click(getByText('0'));
		await fireEvent.click(getByText('='));
		expect(getByText('Ошибка')).toBeInTheDocument();
	});

	it('обрабатывает пустой ввод', async () => {
		const { getByText } = render(Calculator);
		await fireEvent.click(getByText('='));
		expect(getByText('Ошибка')).toBeInTheDocument();
	});

	it('работает с большими числами', async () => {
		const { getByText } = render(Calculator);
		await fireEvent.click(getByText('9'));
		for (let i = 0; i < 10; i++) await fireEvent.click(getByText('9'));
		await fireEvent.click(getByText('×'));
		await fireEvent.click(getByText('9'));
		await fireEvent.click(getByText('='));
		expect(getByText(/\d+/)).toBeInTheDocument();
	});
});
