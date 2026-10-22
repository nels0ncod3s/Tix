import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { compileModule } from 'svelte/compiler';
const source = await readFile(
	new URL('../src/lib/stores/cart.svelte.js', import.meta.url),
	'utf8'
);
const compiled = compileModule(source, {
	filename: 'cart.svelte.js',
	generate: 'client'
})
	.js.code.replace(
		/(['"])svelte\/internal\/client\1/g,
		JSON.stringify(import.meta.resolve('svelte/internal/client'))
	)
	.replace(
		/(['"])\.\.\/utils\/event-sales.js\1/g,
		JSON.stringify(
			new URL('../src/lib/utils/event-sales.js', import.meta.url).href
		)
	);
async function freshCart() {
	return (
		await import(
			'data:text/javascript;base64,' +
				Buffer.from(compiled).toString('base64') +
				'#' +
				crypto.randomUUID()
		)
	).cart;
}
const ticket = {
	eventId: 'event',
	tierId: 'regular',
	price: 0,
	qty: 6,
	available: 10,
	eventDate: '2099-01-01',
	status: 'published'
};
test('repeated cart additions cannot exceed stock', async () => {
	const cart = await freshCart();
	assert.equal(cart.add(ticket), true);
	assert.equal(cart.add(ticket), false);
	assert.equal(cart.count, 6);
});
test('cart edits enforce whole numbers and available stock', async () => {
	const cart = await freshCart();
	cart.add(ticket);
	for (const qty of [1000, 1.5, NaN]) {
		cart.updateQty('event', 'regular', qty);
		assert.equal(cart.count, 6);
	}
	cart.updateQty('event', 'regular', 10);
	assert.equal(cart.count, 10);
});
test('past and unpublished tickets cannot be added', async () => {
	const cart = await freshCart();
	assert.equal(cart.add({ ...ticket, eventDate: '2000-01-01' }), false);
	assert.equal(cart.add({ ...ticket, status: 'draft' }), false);
	assert.equal(cart.count, 0);
});
