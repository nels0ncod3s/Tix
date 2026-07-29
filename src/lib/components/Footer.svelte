<script>
	import { reveal } from '$lib/actions/reveal.js';
	import { rngFor } from '$lib/utils/hash.js';

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
				{ label: 'List an Event', href: '/#sell' },
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

	const bars = (() => {
		const rng = rngFor('footer-barcode');
		return Array.from({ length: 60 }, () => (rng() > 0.6 ? 3 : rng() > 0.3 ? 2 : 1));
	})();
</script>

<footer class="footer">
	<div class="container ticket reveal" use:reveal>
		<div class="ticket-main">
			<span class="ticket-watermark display" aria-hidden="true">TIX.</span>

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

		<div class="perforation" aria-hidden="true">
			<span class="notch left"></span>
			<span class="notch right"></span>
		</div>

		<div class="ticket-barcode" aria-hidden="true">
			{#each bars as w, i (i)}
				<span style="width:{w}px"></span>
			{/each}
		</div>
	</div>

	<div class="container bottom">
		<p>© 2026 Tix. Made in Lagos.</p>
		<a href="/events" class="locations-pill">📍 All Locations</a>
		<div class="bottom-right">
			<div class="socials">
				<a href="/" aria-label="Instagram" class="social">◎</a>
				<a href="/" aria-label="X" class="social">✕</a>
				<a href="/" aria-label="TikTok" class="social">♪</a>
			</div>
			<a href="/">Privacy</a>
			<a href="/">Terms</a>
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
	}

	.ticket-main {
		position: relative;
		overflow: hidden;
		border-radius: var(--radius-lg) var(--radius-lg) 0 0;
		background: var(--paper);
		color: var(--paper-ink);
		display: flex;
		justify-content: space-between;
		gap: 48px;
		flex-wrap: wrap;
		padding: 56px 40px;
	}

	.ticket-watermark {
		position: absolute;
		right: -0.04em;
		bottom: -0.3em;
		font-size: clamp(4.5rem, 11vw, 8rem);
		color: var(--paper-ink);
		opacity: 0.05;
		white-space: nowrap;
		pointer-events: none;
		line-height: 1;
	}

	.signup {
		position: relative;
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
		position: relative;
		display: flex;
		gap: 48px;
		flex-wrap: wrap;
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

	.perforation {
		position: relative;
		height: 0;
		border-top: 2px dashed var(--paper-border);
	}

	.notch {
		position: absolute;
		top: -10px;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--bg);
	}

	.notch.left {
		left: 24px;
	}

	.notch.right {
		right: 24px;
	}

	.ticket-barcode {
		border-radius: 0 0 var(--radius-lg) var(--radius-lg);
		background: var(--paper-2);
		padding: 18px 40px;
		display: flex;
		align-items: center;
		gap: 3px;
		height: 44px;
		overflow: hidden;
	}

	.ticket-barcode span {
		height: 100%;
		background: var(--paper-ink);
		opacity: 0.7;
		border-radius: 1px;
		flex-shrink: 0;
	}

	.bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 24px 0;
		color: var(--text-dimmer);
		font-size: 0.82rem;
		flex-wrap: wrap;
		gap: 14px;
	}

	.locations-pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 8px 14px;
		border-radius: 999px;
		border: 1px solid var(--border);
		color: var(--text);
		font-weight: 600;
		font-size: 0.8rem;
		transition: background 0.25s var(--ease), border-color 0.25s var(--ease);
	}

	.locations-pill:hover {
		background: var(--surface);
		border-color: var(--lime);
	}

	.bottom-right {
		display: flex;
		align-items: center;
		gap: 18px;
	}

	.bottom-right a {
		color: var(--text-dimmer);
		transition: color 0.2s var(--ease);
	}

	.bottom-right a:hover {
		color: var(--text);
	}

	.socials {
		display: flex;
		gap: 8px;
	}

	.social {
		width: 38px;
		height: 38px;
		border-radius: 999px;
		border: 1px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.25s var(--ease), color 0.25s var(--ease);
	}

	.social:hover {
		background: var(--lime);
		color: var(--ink);
	}

	@media (max-width: 720px) {
		.ticket-main {
			padding: 36px 24px;
			gap: 28px;
		}

		.ticket-barcode {
			padding: 14px 24px;
			height: 36px;
		}
	}

	@media (max-width: 560px) {
		.ticket-watermark {
			display: none;
		}

		.cols {
			width: 100%;
			flex-direction: column;
			gap: 28px;
		}

		.bottom {
			flex-direction: column;
			text-align: center;
		}

		.bottom-right {
			flex-wrap: wrap;
			justify-content: center;
		}
	}
</style>
