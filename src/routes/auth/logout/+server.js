import { redirect, error } from '@sveltejs/kit';
export async function POST({ locals }) {
	const result = await locals.supabase?.auth.signOut({ scope: 'local' });
	if (result?.error) error(503, 'Could not sign out. Please try again.');
	redirect(303, '/auth/login');
}
