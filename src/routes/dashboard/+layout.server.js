import { requireHost } from '$lib/server/host.js';
import { hostEvents } from '$lib/server/events.js';
export async function load({ locals, depends }) {
	depends('tix:events');
	const user = await requireHost(locals);
	return {
		host: { email: user.email, name: user.user_metadata?.name || user.email },
		hostEvents: await hostEvents(locals.supabase, user.id)
	};
}
