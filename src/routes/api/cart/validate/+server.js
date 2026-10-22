import { json } from '@sveltejs/kit';
import { toEvent } from '$lib/server/events.js';
import { validateCart } from '$lib/utils/event-sales.js';
export async function POST({ request, locals, url }) {
	if (request.headers.get('origin') !== url.origin)
		return json({ error: 'Invalid request origin.' }, { status: 403 });
	if (!locals.supabase)
		return json(
			{ error: 'Checkout is temporarily unavailable.' },
			{ status: 503 }
		);
	let items;
	try {
		const raw = await request.text();
		if (raw.length > 20000) throw new Error();
		items = JSON.parse(raw).items;
		if (!Array.isArray(items) || !items.length || items.length > 50)
			throw new Error();
	} catch {
		return json({ error: 'Invalid cart.' }, { status: 400 });
	}
	const ids = [...new Set(items.map((i) => i?.eventId))];
	if (ids.some((id) => typeof id !== 'string' || !/^[0-9a-f-]{36}$/i.test(id)))
		return json({ error: 'Invalid event in cart.' }, { status: 400 });
	const { data, error } = await locals.supabase
		.from('tix_events')
		.select('*')
		.in('id', ids)
		.eq('status', 'published');
	if (error)
		return json(
			{ error: 'Could not check availability. Please try again.' },
			{ status: 503 }
		);
	try {
		const validated = validateCart(items, data.map(toEvent));
		return json({
			items: validated,
			total: validated.reduce((sum, item) => sum + item.price * item.qty, 0)
		});
	} catch (error) {
		return json({ error: error.message }, { status: 409 });
	}
}
