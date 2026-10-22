import { fail, redirect } from '@sveltejs/kit';
import { randomUUID } from 'node:crypto';
import { requireHost } from './host.js';
import { parseEventForm } from '../utils/event-form.js';
export async function saveEvent({ request, locals, params }) {
	const user = await requireHost(locals);
	const { values, errors } = parseEventForm(await request.formData());
	if (errors.length) return fail(400, { errors, values });
	const id = params.id ?? randomUUID();
	const payload = { ...values, updated_at: new Date().toISOString() };
	const query = params.id
		? locals.supabase
				.from('tix_events')
				.update(payload)
				.eq('id', id)
				.eq('owner_id', user.id)
		: locals.supabase
				.from('tix_events')
				.insert({ ...payload, id, owner_id: user.id });
	const { data, error } = await query.select('id').maybeSingle();
	if (error || !data) {
		console.error('Tix event save failed:', error?.code ?? 'not_owned');
		return fail(error?.code === '42501' || (!data && !error) ? 403 : 503, {
			errors: [
				'Your event could not be saved. Check your connection and try again.'
			],
			values
		});
	}
	redirect(303, `/dashboard/events/${id}/edit?saved=${values.status}`);
}
