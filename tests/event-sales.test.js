import test from 'node:test';
import assert from 'node:assert/strict';
import {
	eventHasEnded,
	isEventOnSale,
	validateCart,
	validDate
} from '../src/lib/utils/event-sales.js';
import { parseEventForm } from '../src/lib/utils/event-form.js';

const date = '2030-10-22';
const beforeMidnight = new Date('2030-10-22T22:59:59.999Z');
const atMidnight = new Date('2030-10-22T23:00:00.000Z');
const event = {
	id: 'event',
	title: 'Lagos Live',
	status: 'published',
	date,
	venue: 'Eko',
	city: 'Lagos',
	tiers: [{ id: 'regular', name: 'Regular', price: 5000, available: 10 }]
};
function form(overrides = {}) {
	const values = {
		title: 'Lagos Live',
		category: 'music',
		date,
		time: '18:00',
		venue: 'Eko',
		city: 'Lagos',
		description: 'Live music',
		status: 'published',
		tiers: JSON.stringify([
			{ id: 'regular', name: 'Regular', price: 0, quantity: 10 }
		]),
		...overrides
	};
	const data = new FormData();
	for (const [key, value] of Object.entries(values)) data.set(key, value);
	return data;
}
const now = new Date('2030-10-21T12:00:00Z');
test('sales close exactly at midnight after the event date in Lagos', () => {
	assert.equal(eventHasEnded(event, beforeMidnight), false);
	assert.equal(isEventOnSale(event, beforeMidnight), true);
	assert.equal(eventHasEnded(event, atMidnight), true);
	assert.equal(isEventOnSale(event, atMidnight), false);
});
test('draft and invalid-date events are never on sale', () => {
	assert.equal(
		isEventOnSale({ ...event, status: 'draft' }, beforeMidnight),
		false
	);
	assert.equal(isEventOnSale({ ...event, date: '' }, beforeMidnight), false);
	assert.equal(validDate('2030-02-30'), false);
});
test('an overnight cart is rejected at checkout', () => {
	const items = [{ eventId: 'event', tierId: 'regular', qty: 1 }];
	assert.equal(validateCart(items, [event], beforeMidnight).length, 1);
	assert.throws(
		() => validateCart(items, [event], atMidnight),
		/no longer on sale/
	);
});
test('checkout re-prices tickets from server data', () => {
	const [item] = validateCart(
		[{ eventId: 'event', tierId: 'regular', qty: 2, price: 1 }],
		[event],
		beforeMidnight
	);
	assert.equal(item.price, 5000);
});
test('duplicate cart lines cannot bypass stock limits', () => {
	assert.throws(
		() =>
			validateCart(
				[
					{ eventId: 'event', tierId: 'regular', qty: 6 },
					{ eventId: 'event', tierId: 'regular', qty: 6 }
				],
				[event],
				beforeMidnight
			),
		/Not enough/
	);
});
test('invalid quantities and missing tiers are rejected', () => {
	for (const qty of [0, -1, 0.5, NaN, Infinity, '1'])
		assert.throws(() =>
			validateCart(
				[{ eventId: 'event', tierId: 'regular', qty }],
				[event],
				beforeMidnight
			)
		);
	assert.throws(() =>
		validateCart(
			[{ eventId: 'event', tierId: 'missing', qty: 1 }],
			[event],
			beforeMidnight
		)
	);
});
test('free tickets can be published', () => {
	const result = parseEventForm(form(), now);
	assert.deepEqual(result.errors, []);
	assert.equal(result.values.tiers[0].price, 0);
});
test('partial drafts can be saved and retain missing tier fields', () => {
	const result = parseEventForm(
		form({
			status: 'draft',
			date: '',
			time: '',
			venue: '',
			city: '',
			description: '',
			tiers: JSON.stringify([
				{ id: 'regular', name: '', price: '', quantity: '' }
			])
		}),
		now
	);
	assert.deepEqual(result.errors, []);
	assert.equal(result.values.tiers[0].price, null);
});
test('publishing requires full details and a current or future date', () => {
	assert.ok(parseEventForm(form({ date: '2030-10-20' }), now).errors.length);
	assert.ok(parseEventForm(form({ description: '' }), now).errors.length);
	assert.ok(parseEventForm(form({ status: 'unknown' }), now).errors.length);
});
test('negative prices, fractional capacities and duplicate tier IDs are rejected', () => {
	for (const tier of [
		{ id: 'regular', name: 'Regular', price: -1, quantity: 10 },
		{ id: 'regular', name: 'Regular', price: 1, quantity: 1.5 }
	])
		assert.ok(
			parseEventForm(form({ tiers: JSON.stringify([tier]) }), now).errors.length
		);
	const tier = { id: 'regular', name: 'Regular', price: 1, quantity: 10 };
	assert.ok(
		parseEventForm(form({ tiers: JSON.stringify([tier, tier]) }), now).errors
			.length
	);
});
test('native form fields save ticket values without client JSON serialization', () => {
	const data = form();
	data.delete('tiers');
	data.append('tierId', 'regular');
	data.append('tierName', 'Regular');
	data.append('tierPrice', '0');
	data.append('tierQuantity', '10');
	data.append('tierPerks', '[]');
	assert.deepEqual(parseEventForm(data, now).errors, []);
});
test('unsafe poster URLs and malformed dates are rejected', () => {
	assert.ok(
		parseEventForm(form({ image: 'javascript:alert(1)' }), now).errors.length
	);
	assert.ok(parseEventForm(form({ date: '2030-02-30' }), now).errors.length);
});
