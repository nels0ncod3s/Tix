// Event dates use Africa/Lagos. Sales close when that calendar date has passed.
export function lagosDate(now = new Date()) {
	const parts = new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Africa/Lagos',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).formatToParts(now);
	const get = (type) => parts.find((p) => p.type === type).value;
	return `${get('year')}-${get('month')}-${get('day')}`;
}
export function validDate(date) {
	return (
		typeof date === 'string' &&
		/^\d{4}-\d{2}-\d{2}$/.test(date) &&
		!Number.isNaN(Date.parse(date)) &&
		new Date(date).toISOString().slice(0, 10) === date
	);
}
export function eventHasEnded(event, now = new Date()) {
	return !validDate(event.date) || event.date < lagosDate(now);
}
export function isEventOnSale(event, now = new Date()) {
	return event.status === 'published' && !eventHasEnded(event, now);
}
export function validateCart(items, events, now = new Date()) {
	if (!Array.isArray(items) || !items.length || items.length > 50)
		throw new Error('Choose at least one ticket (maximum 50 ticket types).');
	const combined = new Map();
	for (const item of items) {
		if (!item || !Number.isSafeInteger(item.qty) || item.qty < 1)
			throw new Error('Ticket quantities must be positive whole numbers.');
		const key = `${item.eventId}:${item.tierId}`;
		const previous = combined.get(key);
		combined.set(key, { ...item, qty: (previous?.qty ?? 0) + item.qty });
	}
	return [...combined.values()].map((item) => {
		const event = events.find((e) => e.id === item.eventId);
		if (!event || !isEventOnSale(event, now))
			throw new Error(
				'An event in your cart is no longer on sale. Remove it to continue.'
			);
		const tier = event.tiers.find((t) => t.id === item.tierId);
		if (!tier || !Number.isSafeInteger(item.qty) || item.qty > tier.available)
			throw new Error(`Not enough tickets available for ${event.title}.`);
		return {
			eventId: event.id,
			tierId: tier.id,
			qty: item.qty,
			title: event.title,
			tierName: tier.name,
			price: tier.price,
			available: tier.available,
			date: event.date,
			venue: `${event.venue}, ${event.city}`
		};
	});
}
