import { publicEvents } from '$lib/server/events.js';
export async function load({ locals }) {
	return { events: await publicEvents(locals.supabase) };
}
