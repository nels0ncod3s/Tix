import { categories } from '../data/events.js';
import { validDate, lagosDate } from './event-sales.js';
const text = (value, max) =>
	typeof value === 'string' ? value.trim().slice(0, max) : '';
export function parseEventForm(form, now = new Date()) {
	const status = form.get('status');
	const values = {
		title: text(form.get('title'), 160),
		category: text(form.get('category'), 30),
		tagline: text(form.get('tagline'), 240),
		event_date: text(form.get('date'), 10) || null,
		event_time: text(form.get('time'), 5) || null,
		venue: text(form.get('venue'), 200),
		city: text(form.get('city'), 100),
		description: text(form.get('description'), 10000),
		image: text(form.get('image'), 2000),
		lineup: text(form.get('lineup'), 5000)
			.split('\n')
			.map((x) => x.trim())
			.filter(Boolean)
			.slice(0, 100),
		status,
		tiers: []
	};
	const errors = [];
	if (!['draft', 'published'].includes(status))
		errors.push('Choose Save draft or Publish.');
	if (!values.title) errors.push('Give your event a title.');
	if (!categories.some((c) => c.id === values.category))
		errors.push('Choose an event category.');
	if (values.event_date && !validDate(values.event_date))
		errors.push('Enter a valid event date.');
	if (values.event_time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(values.event_time))
		errors.push('Enter a valid event time.');
	if (values.image) {
		try {
			if (new URL(values.image).protocol !== 'https:') throw new Error();
		} catch {
			errors.push('Poster URLs must use HTTPS.');
		}
	}
	try {
		const idsFromForm = form.getAll('tierId');
		const raw = idsFromForm.length
			? JSON.stringify(
					idsFromForm.map((id, i) => ({
						id,
						name: form.getAll('tierName')[i],
						price: form.getAll('tierPrice')[i],
						quantity: form.getAll('tierQuantity')[i],
						perks: JSON.parse(String(form.getAll('tierPerks')[i] ?? '[]'))
					}))
				)
			: String(form.get('tiers') ?? '[]');
		if (raw.length > 20000) throw new Error();
		const tiers = JSON.parse(raw);
		if (!Array.isArray(tiers) || tiers.length < 1 || tiers.length > 20)
			throw new Error();
		const ids = new Set();
		values.tiers = tiers.map((t) => {
			const id = text(t.id, 64);
			if (!/^[a-zA-Z0-9-]{1,64}$/.test(id) || ids.has(id)) throw new Error();
			ids.add(id);
			const number = (v) =>
				v === '' || v === null || v === undefined ? null : Number(v);
			const price = number(t.price),
				available = number(t.quantity ?? t.available);
			if (
				(price !== null &&
					(!Number.isFinite(price) ||
						price < 0 ||
						price > 100000000 ||
						Math.abs(price * 100 - Math.round(price * 100)) > 0.00001)) ||
				(available !== null &&
					(!Number.isSafeInteger(available) ||
						available < 1 ||
						available > 1000000))
			)
				throw new Error();
			return {
				id,
				name: text(t.name, 100),
				price,
				available,
				perks: Array.isArray(t.perks)
					? t.perks.map((p) => text(p, 200)).slice(0, 20)
					: []
			};
		});
	} catch {
		errors.push(
			'Use 1–20 ticket tiers with valid prices and positive whole-number quantities.'
		);
	}
	if (status === 'published') {
		if (!values.event_date || values.event_date < lagosDate(now))
			errors.push('Choose today or a future date before publishing.');
		if (
			!values.event_time ||
			!values.venue ||
			!values.city ||
			!values.description
		)
			errors.push(
				'Add the time, venue, city, and description before publishing.'
			);
		if (
			!values.tiers.length ||
			values.tiers.some(
				(t) => !t.name || t.price === null || t.available === null
			)
		)
			errors.push(
				'Complete every ticket tier before publishing. Free tickets can cost ₦0.'
			);
	}
	return { values, errors };
}
