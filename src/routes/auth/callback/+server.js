import { redirect } from '@sveltejs/kit';
export async function GET({ url, locals }) {
	const code = url.searchParams.get('code');
	if (code && locals.supabase) {
		const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
		if (!error) redirect(303, '/dashboard');
	}
	redirect(303, '/auth/login?confirmation=failed');
}
