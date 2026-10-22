import { error, redirect } from '@sveltejs/kit';
export async function requireHost(locals) {
	if (!locals.supabase)
		error(
			503,
			'Host accounts are temporarily unavailable. Please try again later.'
		);
	const user = await locals.getUser();
	if (!user) redirect(303, '/auth/login');
	return user;
}
