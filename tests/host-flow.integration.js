// Exercises the production SvelteKit routes against an isolated Auth/Data API double.
// Database ownership policies are also verified separately against Supabase.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

const userA = {
	id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
	email: 'host-a@example.invalid',
	role: 'authenticated',
	aud: 'authenticated',
	user_metadata: { name: 'Test Host A' },
	app_metadata: {},
	created_at: new Date().toISOString()
};
const userB = {
	...userA,
	id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
	email: 'host-b@example.invalid',
	user_metadata: { name: 'Test Host B' }
};
const jwt = (user) =>
	`${Buffer.from('{"alg":"HS256"}').toString('base64url')}.${Buffer.from(JSON.stringify({ sub: user.id, exp: Math.floor(Date.now() / 1000) + 3600, role: 'authenticated' })).toString('base64url')}.test-signature`;
const tokens = new Map([
	[jwt(userA), userA],
	[jwt(userB), userB]
]);

test(
	'host login, private draft persistence, publishing, editing, logout and expired checkout',
	{ timeout: 60000 },
	async () => {
		const rows = [];
		const calls = [];
		const backend = createServer(async (req, res) => {
			try {
				const url = new URL(req.url, 'http://localhost');
				let raw = '';
				for await (const chunk of req) raw += chunk;
				const body = raw ? JSON.parse(raw) : null;
				const user = tokens.get(
					req.headers.authorization?.replace('Bearer ', '')
				);
				const send = (value, status = 200) => {
					res.writeHead(status, { 'content-type': 'application/json' });
					res.end(JSON.stringify(value));
				};
				calls.push([req.method, url.pathname]);
				if (url.pathname === '/auth/v1/token') {
					const host =
						body.email === userA.email
							? userA
							: body.email === userB.email
								? userB
								: null;
					if (!host || body.password !== 'testing-password')
						return send(
							{ message: 'Invalid credentials', code: 'invalid_credentials' },
							400
						);
					return send({
						access_token: [...tokens].find(
							([, value]) => value.id === host.id
						)[0],
						refresh_token: `refresh-${host.id}`,
						expires_in: 3600,
						token_type: 'bearer',
						user: host
					});
				}
				if (url.pathname === '/auth/v1/user')
					return user ? send(user) : send({ message: 'Invalid token' }, 401);
				if (url.pathname === '/auth/v1/logout') return send({});
				if (url.pathname === '/rest/v1/tix_events') {
					const match = (row) =>
						[...url.searchParams.entries()].every(([key, value]) => {
							if (['select', 'order'].includes(key)) return true;
							if (value.startsWith('eq.'))
								return String(row[key]) === value.slice(3);
							if (value.startsWith('in.('))
								return value.slice(4, -1).split(',').includes(row[key]);
							return true;
						});
					const visible = (row) =>
						row.status === 'published' || row.owner_id === user?.id;
					if (req.method === 'GET') {
						const selected = rows.filter((row) => visible(row) && match(row));
						return send(
							req.headers.accept?.includes('vnd.pgrst.object')
								? (selected[0] ?? null)
								: selected
						);
					}
					if (!user)
						return send({ message: 'Unauthorized', code: '42501' }, 403);
					if (req.method === 'POST') {
						if (body.owner_id !== user.id) return send({ code: '42501' }, 403);
						rows.push({ ...body, created_at: new Date().toISOString() });
						return send({ id: body.id }, 201);
					}
					if (req.method === 'PATCH') {
						const row = rows.find((r) => r.owner_id === user.id && match(r));
						if (!row) return send(null);
						Object.assign(row, body);
						return send({ id: row.id });
					}
				}
				send({ message: 'Unexpected API request' }, 404);
			} catch (error) {
				res.writeHead(500);
				res.end(String(error));
			}
		});
		backend.listen(0, '127.0.0.1');
		await once(backend, 'listening');
		const apiUrl = `http://127.0.0.1:${backend.address().port}`;
		const app = spawn(
			process.execPath,
			[
				'node_modules/vite/bin/vite.js',
				'preview',
				'--host',
				'127.0.0.1',
				'--port',
				'4178',
				'--strictPort'
			],
			{
				env: {
					...process.env,
					PUBLIC_SUPABASE_URL: apiUrl,
					PUBLIC_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test'
				},
				stdio: ['ignore', 'pipe', 'pipe']
			}
		);
		let output = '';
		app.stderr.on('data', (data) => (output += data));
		const origin = 'http://127.0.0.1:4178';
		try {
			await new Promise((resolve, reject) => {
				const timer = setTimeout(
					() => reject(new Error(`App startup timed out: ${output}`)),
					10000
				);
				app.stdout.on('data', (data) => {
					output += data;
					if (String(data).includes('4178')) {
						clearTimeout(timer);
						resolve();
					}
				});
				app.once('exit', () => {
					clearTimeout(timer);
					reject(new Error(output));
				});
			});
			const jar = new Map();
			async function request(
				path,
				{
					method = 'GET',
					body,
					cookieJar = jar,
					json = false,
					requestOrigin = origin
				} = {}
			) {
				const response = await fetch(origin + path, {
					method,
					redirect: 'manual',
					headers: {
						accept: json ? 'application/json' : 'text/html',
						origin: requestOrigin,
						cookie: [...cookieJar].map(([k, v]) => `${k}=${v}`).join('; '),
						...(body
							? {
									'content-type': json
										? 'application/json'
										: 'application/x-www-form-urlencoded'
								}
							: {})
					},
					body: body
						? json
							? JSON.stringify(body)
							: new URLSearchParams(body)
						: undefined
				});
				for (const cookie of response.headers.getSetCookie()) {
					const [name, ...values] = cookie.split(';')[0].split('=');
					if (values.join('=')) cookieJar.set(name, values.join('='));
					else cookieJar.delete(name);
				}
				return response;
			}
			assert.equal((await request('/dashboard')).status, 303);
			let response = await request('/auth/login', {
				method: 'POST',
				body: { email: userA.email, password: 'testing-password' }
			});
			assert.equal(response.status, 303, await response.text());
			assert.equal(response.headers.get('location'), '/dashboard');
			assert.ok([...jar.keys()].some((key) => key.startsWith('tix-auth')));
			response = await request('/dashboard');
			assert.equal(
				response.status,
				200,
				JSON.stringify({ calls, cookies: [...jar.keys()], output })
			);
			assert.match(await response.text(), /Test Host A/);
			const fields = {
				title: 'Private draft test',
				category: 'music',
				date: '',
				time: '',
				venue: '',
				city: '',
				description: '',
				status: 'draft',
				tiers: JSON.stringify([
					{ id: 'regular', name: '', price: '', quantity: '' }
				])
			};
			response = await request('/dashboard/create?/save', {
				method: 'POST',
				body: fields
			});
			assert.equal(response.status, 303, await response.text());
			const editPath = response.headers.get('location');
			const id = rows[0].id;
			assert.equal(rows[0].owner_id, userA.id);
			response = await request(editPath);
			assert.equal(response.status, 200);
			assert.match(await response.text(), /Private draft test/);
			response = await request(`/events/${id}`, { cookieJar: new Map() });
			assert.equal(response.status, 404);
			response = await request('/events', { cookieJar: new Map() });
			assert.doesNotMatch(await response.text(), /Private draft test/);
			const complete = {
				...fields,
				title: 'Published test event',
				date: '2099-10-22',
				time: '18:00',
				venue: 'Eko',
				city: 'Lagos',
				description: 'A test event',
				status: 'published',
				tiers: JSON.stringify([
					{ id: 'regular', name: 'Regular', price: 0, quantity: 10 }
				])
			};
			response = await request(`/dashboard/events/${id}/edit?/save`, {
				method: 'POST',
				body: complete
			});
			assert.equal(response.status, 303, await response.text());
			assert.equal(rows.length, 1, 'editing must not create duplicate events');
			response = await request(`/events/${id}`, { cookieJar: new Map() });
			assert.equal(response.status, 200);
			assert.match(await response.text(), /Published test event/);
			const secondJar = new Map();
			await request('/auth/login', {
				method: 'POST',
				body: { email: userB.email, password: 'testing-password' },
				cookieJar: secondJar
			});
			response = await request(`/dashboard/events/${id}/edit`, {
				cookieJar: secondJar
			});
			assert.equal(response.status, 404);
			response = await request(`/dashboard/events/${id}/edit?/save`, {
				method: 'POST',
				body: { ...complete, title: 'Stolen' },
				cookieJar: secondJar
			});
			assert.ok([403, 404].includes(response.status));
			assert.equal(rows[0].title, 'Published test event');
			response = await request('/api/cart/validate', {
				method: 'POST',
				json: true,
				body: { items: [{ eventId: id, tierId: 'regular', qty: 1, price: 1 }] }
			});
			assert.equal(response.status, 200);
			assert.equal((await response.json()).total, 0);
			rows[0].event_date = '2000-01-01';
			response = await request(`/events/${id}`);
			assert.equal(response.status, 200);
			const expiredHtml = await response.text();
			assert.match(expiredHtml, /Sales closed/);
			assert.match(expiredHtml, /disabled/);
			response = await request('/api/cart/validate', {
				method: 'POST',
				json: true,
				body: { items: [{ eventId: id, tierId: 'regular', qty: 1 }] }
			});
			assert.equal(response.status, 409);
			response = await request('/api/cart/validate', {
				method: 'POST',
				json: true,
				requestOrigin: 'https://evil.example',
				body: { items: [] }
			});
			assert.equal(response.status, 403);
			response = await request('/auth/logout', { method: 'POST' });
			assert.equal(response.status, 303);
			response = await request('/dashboard');
			assert.equal(response.status, 303);
			assert.ok(
				calls.some(
					([method, path]) =>
						method === 'POST' && path === '/rest/v1/tix_events'
				)
			);
		} finally {
			app.kill('SIGTERM');
			await new Promise((resolve) => backend.close(resolve));
		}
	}
);
