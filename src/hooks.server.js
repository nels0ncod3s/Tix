import { createServerClient } from '@supabase/ssr';
import { env } from '$env/dynamic/public';

export async function handle({ event, resolve }) {
	const configured = Boolean(
		env.PUBLIC_SUPABASE_URL && env.PUBLIC_SUPABASE_PUBLISHABLE_KEY
	);
	event.locals.supabase = configured
		? createServerClient(
				env.PUBLIC_SUPABASE_URL,
				env.PUBLIC_SUPABASE_PUBLISHABLE_KEY,
				{
					cookieOptions: {
						name: 'tix-auth',
						httpOnly: true,
						sameSite: 'lax',
						secure: event.url.protocol === 'https:'
					},
					cookies: {
						getAll: () => event.cookies.getAll(),
						setAll: (cookies) =>
							cookies.forEach(({ name, value, options }) =>
								event.cookies.set(name, value, { ...options, path: '/' })
							)
					}
				}
			)
		: null;
	let userPromise;
	event.locals.getUser = () =>
		(userPromise ??= event.locals.supabase
			? event.locals.supabase.auth
					.getUser()
					.then(({ data, error }) =>
						error || data.user?.is_anonymous ? null : data.user
					)
			: Promise.resolve(null));
	const response = await resolve(event, {
		filterSerializedResponseHeaders: (name) =>
			name === 'content-range' || name === 'x-supabase-api-version'
	});
	// This app can refresh session cookies on server requests. Never cache a response with those cookies.
	response.headers.set('cache-control', 'private, no-store');
	return response;
}
