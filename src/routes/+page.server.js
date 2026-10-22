import { publicEvents } from '$lib/server/events.js';
import { isEventOnSale } from '$lib/utils/event-sales.js';
export async function load({ locals }) {
	return {
		events: (await publicEvents(locals.supabase)).filter((e) =>
			isEventOnSale(e)
		)
	};
}
