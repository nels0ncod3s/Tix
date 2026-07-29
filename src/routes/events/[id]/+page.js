import { error } from '@sveltejs/kit';
import { getEvent } from '$lib/data/events.js';

export function load({ params }) {
	const event = getEvent(params.id);
	if (!event) {
		error(404, 'Event not found');
	}
	return { event };
}
