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
				{ label: 'Contact Us', href: '/' },
				{ label: 'Refund Policy', href: '/' }
			]
		}
	];

	const bars = (() => {
		const rng = rngFor('footer-barcode');
		return Array.from({ length: 46 }, () => (rng() > 0.6 ? 3 : rng() > 0.3 ? 2 : 1));
	})();
</script>

<footer class="footer">
	<span class="footer-wordmark display" aria-hidden="true">TIX.</span>

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

		<div class="ticket-perf" aria-hidden="true">
			<span class="perf-arrow top"></span>
			<span class="perf-line"></span>
			<span class="perf-arrow bottom"></span>
		</div>

		<div class="ticket-barcode" aria-hidden="true">
			<div class="barcode-strip">
				{#each bars as w, i (i)}
					<span style="width:{w}px"></span>
				{/each}
			</div>
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
		position: relative;
		margin-top: 64px;
		overflow: hidden;
	}

	.footer-wordmark {
		position: absolute;
		top: -0.62em;
		left: 50%;
		transform: translateX(-50%);
		font-size: clamp(6rem, 16vw, 13rem);
		color: var(--paper-ink);
		opacity: 0.06;
		white-space: nowrap;
		pointer-events: none;
		z-index: 0;
	}

	.ticket {
		position: relative;
		background: var(--paper);
		color: var(--paper-ink);
		border-radius: var(--radius-lg) var(--radius-lg) 0 0;
		display: grid;
		grid-template-columns: 1fr 1fr auto auto;
		align-items: stretch;
		z-index: 1;
		overflow: hidden;
	}

	.ticket-main {
		grid-column: 1 / 3;
		display: flex;
		gap: 48px;
		flex-wrap: wrap;
		padding: 56px 40px;
	}

	.signup {
		max-width: 340px;
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
		max-width: 360px;
	}

	.subscribe input {
		flex: 1;
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
		gap: 56px;
		flex-wrap: wrap;
	}

	.col h4 {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.06em;
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
		color: var(--paper-ink);
		font-size: 0.92rem;
		font-weight: 600;
		transition: opacity 0.2s var(--ease);
	}

	.col a:hover {
		opacity: 0.6;
	}

	.ticket-perf {
		position: relative;
		width: 32px;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px 0;
	}

	.perf-line {
		flex: 1;
		width: 0;
		border-left: 2px dashed var(--paper-border);
	}

	.perf-arrow {
		width: 0;
		height: 0;
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		flex-shrink: 0;
	}

	.perf-arrow.top {
		border-top: 7px solid var(--paper-border);
	}

	.perf-arrow.bottom {
		border-bottom: 7px solid var(--paper-border);
	}

	.ticket-barcode {
		width: 64px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background: var(--paper-2);
	}

	.barcode-strip {
		display: flex;
		align-items: center;
		gap: 3px;
		height: 56px;
		transform: rotate(90deg);
	}

	.barcode-strip span {
		height: 100%;
		background: var(--paper-ink);
		border-radius: 1px;
		flex-shrink: 0;
	}

	.bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 24px;
		background: var(--paper-2);
		color: var(--paper-ink-dim);
		font-size: 0.82rem;
		flex-wrap: wrap;
		gap: 14px;
		position: relative;
		z-index: 1;
	}

	.locations-pill {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 8px 14px;
		border-radius: 999px;
		border: 1px solid var(--paper-border);
		color: var(--paper-ink);
		font-weight: 600;
		font-size: 0.8rem;
		transition: background 0.25s var(--ease);
	}

	.locations-pill:hover {
		background: rgba(23, 22, 15, 0.06);
	}

	.bottom-right {
		display: flex;
		align-items: center;
		gap: 18px;
	}

	.bottom-right a {
		color: var(--paper-ink-dim);
		transition: color 0.2s var(--ease);
	}

	.bottom-right a:hover {
		color: var(--paper-ink);
	}

	.socials {
		display: flex;
		gap: 8px;
	}

	.social {
		width: 32px;
		height: 32px;
		border-radius: 999px;
		border: 1px solid var(--paper-border);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.25s var(--ease), color 0.25s var(--ease);
	}

	.social:hover {
		background: var(--paper-ink);
		color: var(--lime);
	}

	@media (max-width: 900px) {
		.ticket {
			grid-template-columns: 1fr auto;
		}

		.ticket-main {
			grid-column: 1;
			padding: 40px 28px;
		}

		.ticket-perf {
			display: none;
		}

		.ticket-barcode {
			width: 40px;
		}
	}

	@media (max-width: 640px) {
		.ticket {
			grid-template-columns: 1fr;
		}

		.ticket-barcode {
			display: none;
		}

		.ticket-main {
			flex-direction: column;
			gap: 32px;
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
