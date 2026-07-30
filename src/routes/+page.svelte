<script>
	import { goto } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';
	import { reveal } from '$lib/actions/reveal.js';
	import { spotlight } from '$lib/actions/spotlight.js';
	import { tilt } from '$lib/actions/tilt.js';
	import { rngFor } from '$lib/utils/hash.js';
	import TicketCard from '$lib/components/TicketCard.svelte';
	import CountUp from '$lib/components/CountUp.svelte';
	import { formatNaira } from '$lib/utils/currency.js';
	import { events, categories } from '$lib/data/events.js';

	const ticker = [...events, ...events];

	let query = $state('');

	const featured = events.filter((e) => e.featured).slice(0, 6);
	const heroPicks = events.filter((e) => e.featured).slice(0, 3);
	const heroRotations = [-8, 6, -3];
	const heroBars = heroPicks.map((p) => {
		const rng = rngFor(p.id + 'hero-stack');
		return Array.from({ length: 16 }, () => (rng() > 0.6 ? 3 : rng() > 0.3 ? 2 : 1));
	});

	function shortDate(date) {
		return new Date(date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
	}

	function categoryFor(id) {
		return categories.find((c) => c.id === id);
	}

	function search(e) {
		e.preventDefault();
		goto(query.trim() ? `/events?q=${encodeURIComponent(query.trim())}` : '/events');
	}

	const steps = [
		{
			icon: '🔍',
			title: 'Find your gist',
			text: 'Concerts, comedy, football, festivals — browse what’s happening near you, whatever time of day it kicks off.'
		},
		{
			icon: '🎟️',
			title: 'Pick your tier',
			text: 'Regular, VIP, or table service — see exactly what each ticket unlocks.'
		},
		{
			icon: '💳',
			title: 'Pay your way',
			text: 'Card, bank transfer, or Paystack and Flutterwave — pay in naira, no surprise charges at the door.'
		},
		{
			icon: '⚡',
			title: 'Tap in, show up',
			text: 'Your ticket lands instantly and travels with you — just tap in and you’re through the gate.'
		}
	];
</script>

<svelte:head>
	<title>Tix — Every ticket. Every city. One tap away.</title>
</svelte:head>

<div class="hero-fold">
<section class="hero" use:spotlight>
	<div class="hero-glow" aria-hidden="true"></div>

	<div class="container hero-grid">
		<div class="hero-copy">
			<span class="eyebrow" in:fly={{ y: 18, duration: 600 }}>🎟 Now booking across Nigeria</span>
			<h1 class="display" in:fly={{ y: 26, duration: 700, delay: 80 }}>
				every ticket.<br />
				every city.<br />
				<span class="lime-text">one tap away.</span>
			</h1>
			<p class="lead" in:fly={{ y: 22, duration: 700, delay: 200 }}>
				Concerts, comedy, football, and festivals — find what's on, grab your ticket,
				and show up. No wahala.
			</p>

			<form class="hero-search" in:fly={{ y: 22, duration: 700, delay: 280 }} onsubmit={search}>
				<svg viewBox="0 0 24 24" width="20" height="20"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
				<input type="text" placeholder="Search artists, venues, or cities..." bind:value={query} />
				<button type="submit" class="btn btn-primary">Search</button>
			</form>

			<div class="hero-stats" in:fly={{ y: 22, duration: 700, delay: 360 }}>
				<div class="stat">
					<strong><CountUp value={8200} suffix="+" /></strong>
					<span>Tickets on sale</span>
				</div>
				<div class="stat">
					<strong><CountUp value={1200000} suffix="+" /></strong>
					<span>Tickets sold</span>
				</div>
				<div class="stat">
					<strong><CountUp value={40} suffix="+" /></strong>
					<span>Cities covered</span>
				</div>
			</div>
		</div>

		<div class="hero-stack" aria-hidden="true">
			{#each heroPicks as pick, i (pick.id)}
				<div
					class="stack-ticket"
					style="--rot:{heroRotations[i]}deg; --z:{i + 1}"
					in:fly={{ y: 50, duration: 700, delay: 480 + i * 140 }}
					use:tilt={{ max: 6, lift: 4 }}
				>
					<div class="st-top">
						<span>{categoryFor(pick.category)?.icon} {categoryFor(pick.category)?.label}</span>
						<span>{shortDate(pick.date)}</span>
					</div>
					<span class="st-title">{pick.title}</span>
					<span class="st-city">📍 {pick.city}</span>
					<div class="st-perf" aria-hidden="true">
						<span class="st-notch left"></span>
						<span class="st-notch right"></span>
					</div>
					<div class="st-stub">
						<div class="st-barcode" aria-hidden="true">
							{#each heroBars[i] as w, bi (bi)}
								<span style="width:{w}px"></span>
							{/each}
						</div>
						<span class="st-price">{formatNaira(pick.price)}</span>
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="scroll-cue" in:fade={{ delay: 900, duration: 600 }}>
		<span>Scroll</span>
		<span class="scroll-line"></span>
	</div>
</section>

<div class="ticker" aria-hidden="true">
	<div class="ticker-track">
		{#each ticker as t, i (i)}
			<span class="ticker-item">
				<span class="dot"></span>
				{t.title} <em>· {t.city}</em> <b>{formatNaira(t.price)}</b>
			</span>
		{/each}
	</div>
</div>
</div>

<section class="section">
	<div class="container">
		<div class="section-head reveal" use:reveal>
			<div>
				<span class="kicker">On sale now</span>
				<h2 class="display">Featured this month</h2>
			</div>
			<a href="/events" class="btn btn-ghost">Browse all events</a>
		</div>

		<div class="grid">
			{#each featured as event, i (event.id)}
				<TicketCard {event} delay={(i % 3) * 90} />
			{/each}
		</div>
	</div>
</section>

<section class="section how">
	<div class="container">
		<div class="section-head reveal" use:reveal>
			<div>
				<span class="kicker">Simple, every time</span>
				<h2 class="display">How Tix works</h2>
			</div>
		</div>

		<div class="bento">
			{#each steps as step, i (step.title)}
				<div class="bento-item reveal" use:reveal={{ delay: i * 120 }}>
					<span class="bento-glow" aria-hidden="true"></span>
					<span class="step-num display">{String(i + 1).padStart(2, '0')}</span>
					<span class="step-icon">{step.icon}</span>
					<h3>{step.title}</h3>
					<p>{step.text}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="section cta-band" id="sell">
	<div class="container">
		<div class="cta-card reveal" use:reveal>
			<div class="cta-glow" aria-hidden="true"></div>
			<h2 class="display">Got a show worth<br />selling out?</h2>
			<p>List your event on Tix and reach thousands of people looking for something to do this weekend.</p>
			<a href="/dashboard" class="btn btn-primary">Start selling tickets</a>
		</div>
	</div>
</section>

<style>
	.hero-fold {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		min-height: calc(100svh - 76px);
	}

	.hero {
		position: relative;
		overflow: hidden;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 28px 0;
		--mx: 50%;
		--my: 30%;
	}

	.hero-glow {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(520px circle at var(--mx) var(--my), rgba(215, 255, 63, 0.14), transparent 70%);
		transition: opacity 0.3s var(--ease);
	}

	.hero-grid {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: 1.05fr 0.95fr;
		align-items: center;
		gap: 40px;
	}

	.hero-copy {
		max-width: 560px;
		min-width: 0;
	}

	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 7px 14px;
		border-radius: 999px;
		background: var(--surface);
		border: 1px solid var(--border);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-dim);
		margin-bottom: 18px;
	}

	.hero h1 {
		font-size: clamp(2.6rem, 6.4vw, 4.8rem);
		margin-bottom: 16px;
		color: var(--text);
	}

	.lead {
		font-size: 1.1rem;
		color: var(--text-dim);
		max-width: 520px;
		margin-bottom: 26px;
	}

	.hero-search {
		display: flex;
		align-items: center;
		gap: 10px;
		min-width: 0;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 8px 8px 8px 20px;
		max-width: 560px;
		backdrop-filter: blur(16px);
		color: var(--text-dimmer);
		transition: border-color 0.3s var(--ease), box-shadow 0.3s var(--ease);
	}

	.hero-search:focus-within {
		border-color: var(--lime);
		box-shadow: 0 0 0 4px rgba(215, 255, 63, 0.15);
	}

	.hero-search input {
		flex: 1;
		min-width: 0;
		border: none;
		background: transparent;
		color: var(--text);
		font-size: 0.95rem;
		padding: 8px 0;
	}

	.hero-search input:focus {
		outline: none;
	}

	.hero-stats {
		display: flex;
		gap: 40px;
		margin-top: 30px;
		flex-wrap: wrap;
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.stat strong {
		font-family: 'Anton', sans-serif;
		font-size: 2rem;
		color: var(--lime);
	}

	.stat span {
		font-size: 0.82rem;
		color: var(--text-dimmer);
	}

	.hero-stack {
		position: relative;
		min-height: 460px;
	}

	.stack-ticket {
		position: absolute;
		width: 240px;
		background: var(--paper);
		color: var(--paper-ink);
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-paper);
		padding: 20px 20px 0;
		display: flex;
		flex-direction: column;
		--rot: 0deg;
		--z: 1;
		transform: rotate(var(--rot));
		transition: transform 0.3s var(--ease-out-back), box-shadow 0.3s var(--ease);
		z-index: var(--z);
		animation: float-slow 8s ease-in-out infinite;
	}

	.stack-ticket:hover {
		box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.6), 0 0 0 2px var(--lime);
	}

	.stack-ticket:nth-child(1) {
		top: 18%;
		left: 0;
		animation-delay: 0s;
	}

	.stack-ticket:nth-child(2) {
		top: 0;
		left: 22%;
		animation-delay: -2.6s;
	}

	.stack-ticket:nth-child(3) {
		top: 32%;
		left: 44%;
		animation-delay: -5s;
	}

	.st-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		margin-bottom: 16px;
		font-size: 0.66rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--paper-ink-dim);
	}

	.st-title {
		font-weight: 800;
		font-size: 1.05rem;
		line-height: 1.2;
		margin-bottom: 8px;
	}

	.st-city {
		font-size: 0.78rem;
		color: var(--paper-ink-dim);
		margin-bottom: 16px;
	}

	.st-perf {
		position: relative;
		height: 0;
		margin: 0 -20px;
		border-top: 2px dashed var(--paper-border);
	}

	.st-notch {
		position: absolute;
		top: -8px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--bg);
	}

	.st-notch.left {
		left: -8px;
	}

	.st-notch.right {
		right: -8px;
	}

	.st-stub {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		margin: 0 -20px;
		padding: 14px 20px 16px;
	}

	.st-barcode {
		display: flex;
		align-items: center;
		gap: 2px;
		height: 22px;
	}

	.st-barcode span {
		height: 100%;
		background: var(--paper-ink);
		border-radius: 1px;
		flex-shrink: 0;
	}

	.st-price {
		font-weight: 700;
		font-size: 0.76rem;
		background: var(--ink);
		color: var(--lime);
		padding: 6px 11px;
		border-radius: 999px;
		white-space: nowrap;
	}

	@media (max-width: 1080px) {
		.hero-grid {
			grid-template-columns: 1fr;
		}

		.hero-stack {
			display: none;
		}

		.hero-copy {
			max-width: 640px;
		}
	}

	.scroll-cue {
		position: absolute;
		bottom: 32px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-dimmer);
		z-index: 1;
	}

	.scroll-line {
		width: 1px;
		height: 32px;
		background: linear-gradient(var(--lime), transparent);
		animation: scroll-cue-move 1.8s ease-in-out infinite;
	}

	@keyframes scroll-cue-move {
		0% { transform: scaleY(0.4); opacity: 0.4; }
		50% { transform: scaleY(1); opacity: 1; }
		100% { transform: scaleY(0.4); opacity: 0.4; }
	}

	@media (max-width: 768px) {
		.scroll-cue {
			display: none;
		}

		.hero-search {
			padding: 5px 5px 5px 14px;
			gap: 6px;
		}

		.hero-search input {
			font-size: 0.86rem;
			padding: 6px 0;
		}

		.hero-search .btn {
			padding: 10px 16px;
			font-size: 0.86rem;
		}

		.hero-stats {
			gap: 20px;
		}

		.stat strong {
			font-family: 'Inter', sans-serif;
			font-weight: 800;
			font-size: 1.3rem;
			white-space: nowrap;
		}
	}

	.ticker {
		position: relative;
		overflow: hidden;
		border-top: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		padding: 14px 0;
		mask-image: linear-gradient(90deg, transparent, black 8%, black 92%, transparent);
	}

	.ticker-track {
		display: flex;
		width: max-content;
		gap: 40px;
		animation: marquee 34s linear infinite;
	}

	.ticker-item {
		display: flex;
		align-items: center;
		gap: 10px;
		white-space: nowrap;
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-dim);
	}

	.ticker-item em {
		font-style: normal;
		color: var(--text-dimmer);
		font-weight: 500;
	}

	.ticker-item b {
		color: var(--lime);
		font-weight: 700;
	}

	.ticker-item .dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--coral);
		flex-shrink: 0;
	}


	.section-head {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		margin-bottom: 40px;
		flex-wrap: wrap;
		gap: 16px;
	}

	.kicker {
		display: block;
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--coral);
		margin-bottom: 8px;
	}

	.section-head h2 {
		font-size: clamp(1.8rem, 6vw, 2.4rem);
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 32px 24px;
	}

	@media (max-width: 980px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}

	.bento {
		display: grid;
		grid-template-columns: 1.15fr 1fr 1fr;
		grid-template-rows: auto auto;
		gap: 20px;
	}

	.bento-item {
		position: relative;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 32px 28px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		transition: border-color 0.3s var(--ease), transform 0.3s var(--ease);
	}

	.bento-item:hover {
		border-color: rgba(215, 255, 63, 0.3);
		transform: translateY(-3px);
	}

	.bento-glow {
		position: absolute;
		width: 220px;
		height: 220px;
		right: -80px;
		top: -80px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(215, 255, 63, 0.1), transparent 70%);
		pointer-events: none;
	}

	.bento-item:nth-child(1) {
		grid-column: 1;
		grid-row: 1 / 3;
		justify-content: center;
	}

	.bento-item:nth-child(1) .step-icon {
		font-size: 2.6rem;
		margin-bottom: 22px;
	}

	.bento-item:nth-child(1) h3 {
		font-size: 1.5rem;
	}

	.bento-item:nth-child(2) {
		grid-column: 2;
		grid-row: 1;
	}

	.bento-item:nth-child(3) {
		grid-column: 3;
		grid-row: 1;
	}

	.bento-item:nth-child(4) {
		grid-column: 2 / 4;
		grid-row: 2;
		flex-direction: row;
		align-items: center;
		gap: 24px;
	}

	.bento-item:nth-child(4) .step-icon {
		margin-bottom: 0;
		flex-shrink: 0;
	}

	.step-icon {
		font-size: 2rem;
		display: block;
		margin-bottom: 18px;
	}

	.bento-item h3 {
		font-size: 1.15rem;
		margin-bottom: 10px;
	}

	.bento-item p {
		color: var(--text-dim);
		font-size: 0.9rem;
	}

	.step-num {
		position: absolute;
		top: 16px;
		right: 20px;
		font-size: 2.2rem;
		color: var(--border);
	}

	@media (max-width: 900px) {
		.bento {
			grid-template-columns: 1fr 1fr;
		}

		.bento-item:nth-child(1) {
			grid-column: 1 / 3;
			grid-row: 1;
		}

		.bento-item:nth-child(2) {
			grid-column: 1;
			grid-row: 2;
		}

		.bento-item:nth-child(3) {
			grid-column: 2;
			grid-row: 2;
		}

		.bento-item:nth-child(4) {
			grid-column: 1 / 3;
			grid-row: 3;
		}
	}

	@media (max-width: 640px) {
		.bento {
			grid-template-columns: 1fr;
		}

		.bento-item:nth-child(1),
		.bento-item:nth-child(2),
		.bento-item:nth-child(3),
		.bento-item:nth-child(4) {
			grid-column: 1;
			grid-row: auto;
		}

		.bento-item:nth-child(4) {
			flex-direction: column;
		}
	}

	.cta-card {
		position: relative;
		text-align: center;
		padding: clamp(48px, 10vw, 80px) clamp(20px, 6vw, 40px);
		border-radius: var(--radius-lg);
		border: 1px solid var(--border);
		overflow: hidden;
		background: linear-gradient(180deg, var(--surface), transparent);
	}

	.cta-glow {
		position: absolute;
		inset: -40%;
		background: conic-gradient(from 0deg, var(--lime), var(--coral), var(--lime));
		opacity: 0.12;
		filter: blur(70px);
		animation: spin-slow 16s linear infinite;
		z-index: 0;
	}

	.cta-card > * {
		position: relative;
		z-index: 1;
	}

	.cta-card h2 {
		font-size: clamp(1.9rem, 7vw, 2.6rem);
		margin-bottom: 18px;
	}

	.cta-card p {
		color: var(--text-dim);
		max-width: 480px;
		margin: 0 auto 28px;
	}
</style>
