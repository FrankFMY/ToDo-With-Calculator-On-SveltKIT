import { render, fireEvent } from '@testing-library/svelte';
import { describe, it, expect, vi } from 'vitest';
import Modal from './Modal.svelte';
import type { SvelteComponent } from 'svelte';

describe('Modal', () => {
	it('отображает содержимое при open=true', () => {
		const { getByText } = render(Modal, { props: { open: true } });
		expect(getByText(/Калькулятор|Calculator|./)).toBeInTheDocument();
	});

	it('закрывается по кнопке ✕', async () => {
		const { getByLabelText, component } = render(Modal, { props: { open: true } });
		const close = getByLabelText('Закрыть');
		const closeHandler = vi.fn();
		(component as SvelteComponent).$on('close', closeHandler);
		await fireEvent.click(close);
		expect(closeHandler).toHaveBeenCalled();
	});
});
