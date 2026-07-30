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
			title: 'Menu',
			links: [
				{ label: 'Discover Events', href: '/events' },
				{ label: 'Pricing', href: '/pricing' },
				{ label: 'List an Event', href: '/dashboard' },
				{ label: 'My Tickets', href: '/' }
			]
		},
		{
			title: 'Support',
			links: [
				{ label: 'FAQs', href: '/faq' },
				{ label: 'Contact Us', href: 'mailto:hello@tix.ng' },
				{ label: 'Refund Policy', href: '/faq' }
			]
		}
	];
</script>

<footer class="footer">
	<div class="container ticket reveal" use:reveal>
		<div class="ticket-main">
			<div class="signup">
				<h3 class="display">We outside!</h3>
				<p>
					Get first access to early bird tickets, drops on the biggest nights, and news on
					what's landing next.
				</p>
				<form class="subscribe" onsubmit={subscribe}>
					{#if subscribed}
						<p class="thanks">✓ You're on the list</p>
					{:else}
						<input type="email" placeholder="Email address" bind:value={email} required />
						<button type="submit" aria-label="Subscribe">→</button>
					{/if}
				</form>
			</div>

			<div class="cols">
				{#each columns as col (col.title)}
					<div class="col">
						<h4>{col.title.toUpperCase()}</h4>
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
			<p>© 2026 Tix.</p>
			<div class="bottom-right">
				<a href="/">Privacy</a>
				<a href="/">Terms</a>
			</div>
		</div>
	</div>
</footer>

<style>
	.footer {
		margin-top: 64px;
	}

	.ticket {
		position: relative;
		z-index: 1;
		border-radius: var(--radius-lg) var(--radius-lg) 0 0;
		overflow: hidden;
	}

	.ticket-main {
		background: var(--paper);
		color: var(--paper-ink);
		display: flex;
		justify-content: space-between;
		gap: 48px;
		flex-wrap: wrap;
		padding: 56px 40px 40px;
	}

	.signup {
		max-width: 320px;
	}

	.signup h3 {
		font-size: 1.7rem;
		margin-bottom: 12px;
	}

	.signup p {
		font-size: 0.9rem;
		color: var(--paper-ink-dim);
		margin-bottom: 22px;
	}

	.subscribe {
		display: flex;
		align-items: center;
		gap: 10px;
		border-bottom: 1.5px solid var(--paper-ink);
		padding-bottom: 10px;
		max-width: 320px;
	}

	.subscribe input {
		flex: 1;
		min-width: 0;
		border: none;
		background: transparent;
		color: var(--paper-ink);
		font-size: 0.95rem;
	}

	.subscribe input::placeholder {
		color: var(--paper-ink-dim);
	}

	.subscribe input:focus {
		outline: none;
	}

	.subscribe button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background: none;
		border: none;
		color: var(--paper-ink);
		font-size: 1.2rem;
		flex-shrink: 0;
		transition: transform 0.25s var(--ease);
	}

	.subscribe button:hover {
		transform: translateX(4px);
	}

	.thanks {
		color: var(--lime-dim);
		font-weight: 700;
	}

	.cols {
		display: flex;
		gap: 40px;
	}

	.col h4 {
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: var(--paper-ink-dim);
		margin-bottom: 16px;
	}

	.col ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.col a {
		display: inline-block;
		padding: 2px 0;
		color: var(--paper-ink);
		font-size: 0.92rem;
		font-weight: 600;
		transition: opacity 0.2s var(--ease);
	}

	.col a:hover {
		opacity: 0.6;
	}

	.bottom {
		background: var(--paper-2);
		color: var(--paper-ink-dim);
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 18px 40px;
		font-size: 0.82rem;
	}

	.bottom p {
		color: var(--paper-ink-dim);
	}

	.bottom-right {
		display: flex;
		align-items: center;
		gap: 20px;
	}

	.bottom-right a {
		color: var(--paper-ink-dim);
		font-weight: 600;
		transition: color 0.2s var(--ease);
	}

	.bottom-right a:hover {
		color: var(--paper-ink);
	}

	@media (max-width: 720px) {
		.ticket-main {
			padding: 36px 24px 28px;
			gap: 28px;
		}

		.bottom {
			padding: 16px 24px;
		}
	}

	@media (max-width: 480px) {
		.cols {
			gap: 24px;
		}

		.col h4 {
			margin-bottom: 12px;
		}
	}
</style>
