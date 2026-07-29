<script>
	import { reveal } from '$lib/actions/reveal.js';

	let email = $state('');
	let subscribed = $state(false);

	function subscribe(e) {
		e.preventDefault();
		if (!email.trim()) return;
		subscribed = true;
		email = '';
	}

	const columns = [
		{
			title: 'Discover',
			links: [
				{ label: 'All Events', href: '/events' },
				{ label: 'Music', href: '/events?category=music' },
				{ label: 'Sports', href: '/events?category=sports' },
				{ label: 'Festivals', href: '/events?category=festival' }
			]
		},
		{
			title: 'Company',
			links: [
				{ label: 'About', href: '/' },
				{ label: 'Careers', href: '/' },
				{ label: 'Press', href: '/' }
			]
		},
		{
			title: 'Support',
			links: [
				{ label: 'Help Center', href: '/' },
				{ label: 'Refund Policy', href: '/' },
				{ label: 'Contact', href: '/' }
			]
		}
	];
</script>

<footer class="footer">
	<div class="container">
		<div class="top reveal" use:reveal>
			<div class="brand">
				<div class="logo display">🎟 Tix<span class="lime-text">.</span></div>
				<p>Naija's live music, sports, comedy, and culture — one tap to get in.</p>
				<form class="subscribe" onsubmit={subscribe}>
					{#if subscribed}
						<p class="thanks">✓ You're on the list</p>
					{:else}
						<input type="email" placeholder="you@email.com" bind:value={email} required />
						<button type="submit" class="btn btn-primary">Notify me</button>
					{/if}
				</form>
			</div>

			<div class="cols">
				{#each columns as col (col.title)}
					<div class="col">
						<h4>{col.title}</h4>
						<ul>
							{#each col.links as link (link.label)}
								<li><a href={link.href}>{link.label}</a></li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		</div>

		<div class="bottom">
			<p>© 2026 Tix. Made in Lagos.</p>
			<div class="socials">
				<a href="/" aria-label="Instagram" class="social">◎</a>
				<a href="/" aria-label="X" class="social">✕</a>
				<a href="/" aria-label="TikTok" class="social">♪</a>
			</div>
		</div>
	</div>
</footer>

<style>
	.footer {
		border-top: 1px solid var(--border);
		padding: 72px 0 32px;
		margin-top: 64px;
		position: relative;
	}

	.top {
		display: flex;
		justify-content: space-between;
		gap: 48px;
		flex-wrap: wrap;
		padding-bottom: 48px;
	}

	.brand {
		max-width: 320px;
	}

	.brand .logo {
		font-size: 1.5rem;
		margin-bottom: 14px;
	}

	.brand p {
		color: var(--text-dim);
		font-size: 0.92rem;
		margin-bottom: 20px;
	}

	.subscribe {
		display: flex;
		gap: 8px;
	}

	.subscribe input {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 10px 16px;
		color: var(--text);
		font-size: 0.88rem;
		width: 180px;
		transition: border-color 0.25s var(--ease);
	}

	.subscribe input:focus {
		outline: none;
		border-color: var(--lime);
	}

	.subscribe .btn {
		padding: 10px 18px;
		font-size: 0.85rem;
	}

	.thanks {
		color: var(--lime);
		font-weight: 600;
		animation: pop-in 0.35s var(--ease);
	}

	.cols {
		display: flex;
		gap: 56px;
		flex-wrap: wrap;
	}

	.col h4 {
		font-size: 0.85rem;
		color: var(--text);
		margin-bottom: 16px;
	}

	.col ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.col a {
		color: var(--text-dim);
		font-size: 0.88rem;
		transition: color 0.2s var(--ease);
	}

	.col a:hover {
		color: var(--lime);
	}

	.bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 28px;
		border-top: 1px solid var(--border);
		color: var(--text-dimmer);
		font-size: 0.82rem;
		flex-wrap: wrap;
		gap: 12px;
	}

	.socials {
		display: flex;
		gap: 10px;
	}

	.social {
		width: 34px;
		height: 34px;
		border-radius: 999px;
		border: 1px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.25s var(--ease), transform 0.25s var(--ease), color 0.25s var(--ease);
	}

	.social:hover {
		background: var(--lime);
		transform: translateY(-2px);
		color: var(--ink);
	}

	@media (max-width: 640px) {
		.bottom {
			flex-direction: column;
			text-align: center;
		}
	}
</style>
