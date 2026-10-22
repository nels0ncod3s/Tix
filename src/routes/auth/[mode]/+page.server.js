import { error, fail, redirect } from '@sveltejs/kit';
export async function load({ params, locals, url }) {
	if (!['login', 'signup'].includes(params.mode)) error(404, 'Page not found');
	if (await locals.getUser()) redirect(303, '/dashboard');
	return {
		mode: params.mode,
		configured: Boolean(locals.supabase),
		confirmationFailed: url.searchParams.get('confirmation') === 'failed'
	};
}
export const actions = {
	default: async ({ request, params, locals, url }) => {
		if (!['login', 'signup'].includes(params.mode))
			error(404, 'Page not found');
		if (!locals.supabase)
			return fail(503, {
				error:
					'Host accounts are temporarily unavailable. Please try again later.'
			});
		const form = await request.formData();
		const email = String(form.get('email') ?? '')
			.trim()
			.toLowerCase();
		const password = String(form.get('password') ?? '');
		const name = String(form.get('name') ?? '').trim();
		if (
			!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
			email.length > 254 ||
			password.length < 8 ||
			password.length > 128 ||
			(params.mode === 'signup' && (!name || name.length > 100))
		)
			return fail(400, {
				email,
				error: 'Enter a valid email, name, and a password of 8–128 characters.'
			});
		const result =
			params.mode === 'signup'
				? await locals.supabase.auth.signUp({
						email,
						password,
						options: {
							data: { name },
							emailRedirectTo: `${url.origin}/auth/callback`
						}
					})
				: await locals.supabase.auth.signInWithPassword({ email, password });
		if (result.error)
			return fail(400, {
				email,
				error:
					params.mode === 'login'
						? 'Sign-in failed. Check your email and password and confirm your email first.'
						: 'Could not create your account. Try again or sign in if you already have an account.'
			});
		if (!result.data.session)
			return {
				message: 'Check your email to confirm your account, then sign in here.',
				email
			};
		redirect(303, '/dashboard');
	}
};
