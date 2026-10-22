import { error } from '@sveltejs/kit';
import { toEvent, publicEvents } from '$lib/server/events.js';
export async function load({ params, locals }) {
	if (!locals.supabase) error(404, 'Event not found');
	const { data, error: dbError } = await locals.supabase
		.from('tix_events')
		.select('*')
		.eq('id', params.id)
		.eq('status', 'published')
		.maybeSingle();
	if (dbError?.code === '22P02' || (!dbError && !data))
		error(404, 'Event not found');
	if (dbError) error(503, 'Event could not be loaded. Please try again.');
	const event = toEvent(data);
	return {
		event,
		related: (await publicEvents(locals.supabase)).filter(
			(e) => e.id !== event.id && e.category === event.category
		)
	};
}
