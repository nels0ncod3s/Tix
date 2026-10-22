import { error } from '@sveltejs/kit';
export function toEvent(row) {
	const tiers = row.tiers ?? [];
	return {
		id: row.id,
		title: row.title,
		category: row.category,
		tagline: row.tagline,
		date: row.event_date,
		time: row.event_time?.slice(0, 5) ?? '',
		venue: row.venue,
		city: row.city,
		description: row.description,
		image: row.image || '/event-placeholder.svg',
		lineup: row.lineup ?? [],
		status: row.status,
		featured: row.status === 'published',
		tiers,
		price: tiers.length
			? Math.min(...tiers.map((t) => Number(t.price) || 0))
			: 0,
		createdAt: row.created_at,
		ticketsSold: 0,
		revenue: 0,
		views: 0,
		ticketsTotal: tiers.reduce((n, t) => n + (Number(t.available) || 0), 0)
	};
}
export async function publicEvents(supabase) {
	if (!supabase) return [];
	const { data, error: dbError } = await supabase
		.from('tix_events')
		.select('*')
		.eq('status', 'published')
		.order('event_date');
	if (dbError) {
		console.error('Tix event lookup failed:', dbError.code);
		error(503, 'Events are temporarily unavailable. Please try again.');
	}
	return data.map(toEvent);
}
export async function hostEvents(supabase, ownerId) {
	const { data, error: dbError } = await supabase
		.from('tix_events')
		.select('*')
		.eq('owner_id', ownerId)
		.order('created_at', { ascending: false });
	if (dbError) {
		console.error('Tix host events failed:', dbError.code);
		error(503, 'Your events could not be loaded. Please try again.');
	}
	return data.map(toEvent);
}
