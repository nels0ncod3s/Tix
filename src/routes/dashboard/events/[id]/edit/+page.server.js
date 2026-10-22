import { error } from '@sveltejs/kit';
import { requireHost } from '$lib/server/host.js';
import { toEvent } from '$lib/server/events.js';
import { saveEvent } from '$lib/server/save-event.js';
export async function load({ locals, params, url }) {
	const user = await requireHost(locals);
	const { data, error: dbError } = await locals.supabase
		.from('tix_events')
		.select('*')
		.eq('id', params.id)
		.eq('owner_id', user.id)
		.maybeSingle();
	if (dbError?.code === '22P02' || (!dbError && !data))
		error(404, 'Event not found');
	if (dbError) error(503, 'Your event could not be loaded. Please try again.');
	return {
		event: toEvent(data),
		saved: ['draft', 'published'].includes(url.searchParams.get('saved'))
			? url.searchParams.get('saved')
			: null
	};
}
export const actions = { save: saveEvent };
