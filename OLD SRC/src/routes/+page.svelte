<script>
	import { goto } from '$app/navigation';
	import { fly, fade } from 'svelte/transition';
	import { reveal } from '$lib/actions/reveal.js';
	import { spotlight } from '$lib/actions/spotlight.js';
	import TicketCard from '$lib/components/TicketCard.svelte';
	import CountUp from '$lib/components/CountUp.svelte';
	import { formatNaira } from '$lib/utils/currency.js';
	import { events, categories } from '$lib/data/events.js';

	const ticker = [...events, ...events];

	let query = $state('');

	const featured = events.filter((e) => e.featured).slice(0, 6);
	const heroPicks = events.filter((e) => e.featured).slice(0, 3);

	function search(e) {
		e.preventDefault();
		goto(query.trim() ? `/events?q=${encodeURIComponent(query.trim())}` : '/events');
	}

	const steps = [
		{
			icon: '🔍',
			title: 'Find your gist',
			text: 'Concerts, comedy, football, festivals — browse what’s happening near you.'
		},
		{
			icon: '🎟️',
			title: 'Pick your tier',
			text: 'Regular, VIP, or table service — see exactly what each ticket unlocks.'
		},
		{
			icon: '⚡',
			title: 'Tap in, show up',
			text: 'Your ticket lands instantly. Pay in naira, no surprise charges at the door.'
		}
	];
</script>

<svelte:head>
	<title>Tix — Naija's biggest nights, one tap away</title>
</svelte:head>

<section class="hero" use:spotlight>
	<div class="hero-glow" aria-hidden="true"></div>

	<div class="hero-marquee" aria-hidden="true">
		<div class="hero-marquee-track">
			{#each Array(2) as _, i (i)}
				<span class="marquee-set">
					LAGOS <i>✦</i> ABUJA <i>✦</i> PORT HARCOURT <i>✦</i> UYO <i>✦</i> KANO <i>✦</i>
				</span>
			{/each}
		</div>
	</div>

	<div class="container hero-inner">
		<span class="eyebrow" in:fly={{ y: 18, duration: 600 }}>🇳🇬 Naija's biggest nights, one tap away</span>
		<h1 class="display" in:fly={{ y: 26, duration: 700, delay: 80 }}>
			your next<br />
			<span class="lime-text">night out</span><br />
			is booked.
		</h1>
		<p class="lead" in:fly={{ y: 22, duration: 700, delay: 200 }}>
			From Detty December to Lagos Tech Summit — find the ticket, tap in, and show up.
			No wahala.
		</p>

		<form class="hero-search" in:fly={{ y: 22, duration: 700, delay: 280 }} onsubmit={search}>
			<svg viewBox="0 0 24 24" width="20" height="20"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
			<input type="text" placeholder="Search artists, venues, or cities..." bind:value={query} />
			<button type="submit" class="btn btn-primary">Search</button>
		</form>

		<div class="hero-stats" in:fly={{ y: 22, duration: 700, delay: 360 }}>
			<div class="stat">
				<strong><CountUp value={8200} suffix="+" /></strong>
				<span>Live events</span>
			</div>
			<div class="stat">
				<strong><CountUp value={1200000} suffix="+" /></strong>
				<span>Tickets delivered</span>
			</div>
			<div class="stat">
				<strong><CountUp value={40} suffix="+" /></strong>
				<span>Cities covered</span>
			</div>
		</div>
	</div>

	<div class="hero-tickets" aria-hidden="true">
		{#each heroPicks as pick, i (pick.id)}
			<div class="mini-ticket" style="--rot:{[-8, 6, -4][i]}deg" in:fly={{ y: 40, duration: 700, delay: 500 + i * 140 }}>
				<div class="mt-top">
					<span class="mt-dot"></span>
					<span class="mt-cat">{categories.find((c) => c.id === pick.category)?.icon}</span>
				</div>
				<span class="mt-title">{pick.title}</span>
				<span class="mt-city">{pick.city}</span>
				<span class="mt-dash"></span>
				<span class="mt-price">{formatNaira(pick.price)}</span>
			</div>
		{/each}
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

<section class="section categories">
	<div class="container">
		<div class="cat-row">
			{#each categories as cat, i (cat.id)}
				<a href={`/events?category=${cat.id}`} class="cat-pill reveal" use:reveal={{ delay: i * 60 }}>
					<span class="cat-icon">{cat.icon}</span>
					{cat.label}
				</a>
			{/each}
		</div>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="section-head reveal" use:reveal>
			<div>
				<span class="kicker">Handpicked</span>
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

		<div class="steps">
			{#each steps as step, i (step.title)}
				<div class="step reveal" use:reveal={{ delay: i * 120 }}>
					<span class="step-icon">{step.icon}</span>
					<h3>{step.title}</h3>
					<p>{step.text}</p>
					<span class="step-num display">{String(i + 1).padStart(2, '0')}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="section cta-band">
	<div class="container">
		<div class="cta-card reveal" use:reveal>
			<div class="cta-glow" aria-hidden="true"></div>
			<h2 class="display">Got a show worth<br />selling out?</h2>
			<p>List your event on Tix and reach thousands of people looking for something to do this weekend.</p>
			<a href="/events" class="btn btn-primary">Start selling tickets</a>
		</div>
	</div>
</section>

<style>
	.hero {
		padding: 120px 0 60px;
		position: relative;
		overflow: hidden;
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

	.hero-marquee {
		position: absolute;
		left: -10%;
		right: -10%;
		top: 38%;
		transform: rotate(-4deg);
		overflow: hidden;
		white-space: nowrap;
		border-top: 2px solid var(--border);
		border-bottom: 2px solid var(--border);
		padding: 10px 0;
		z-index: 0;
		mix-blend-mode: difference;
	}

	.hero-marquee-track {
		display: flex;
		width: max-content;
		animation: marquee 40s linear infinite;
	}

	.marquee-set {
		font-family: 'Anton', sans-serif;
		font-size: 2.2rem;
		letter-spacing: 0.04em;
		color: var(--lime);
		padding-right: 2rem;
	}

	.marquee-set i {
		font-style: normal;
		opacity: 0.5;
		margin: 0 0.4em;
	}

	.hero-inner {
		position: relative;
		z-index: 1;
		max-width: 780px;
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
		margin-bottom: 28px;
	}

	.hero h1 {
		font-size: clamp(3.2rem, 9vw, 6.4rem);
		margin-bottom: 24px;
		color: var(--text);
	}

	.lead {
		font-size: 1.15rem;
		color: var(--text-dim);
		max-width: 520px;
		margin-bottom: 36px;
	}

	.hero-search {
		display: flex;
		align-items: center;
		gap: 10px;
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
		margin-top: 56px;
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

	.hero-tickets {
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
	}

	.mini-ticket {
		position: absolute;
		width: 190px;
		background: var(--paper);
		color: var(--paper-ink);
		border-radius: 14px;
		padding: 14px 16px;
		box-shadow: var(--shadow-paper);
		display: flex;
		flex-direction: column;
		gap: 4px;
		--rot: 0deg;
		animation: float-slow 7s ease-in-out infinite;
	}

	.mini-ticket:nth-child(1) {
		top: 6%;
		right: 6%;
		animation-delay: 0s;
	}

	.mini-ticket:nth-child(2) {
		top: 42%;
		right: 18%;
		animation-delay: -2.5s;
	}

	.mini-ticket:nth-child(3) {
		bottom: 4%;
		right: 2%;
		animation-delay: -4.5s;
	}

	.mt-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 4px;
	}

	.mt-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--coral);
	}

	.mt-cat {
		font-size: 0.95rem;
	}

	.mt-title {
		font-weight: 800;
		font-size: 0.92rem;
		line-height: 1.2;
	}

	.mt-city {
		font-size: 0.72rem;
		color: var(--paper-ink-dim);
		margin-bottom: 8px;
	}

	.mt-dash {
		border-top: 2px dashed var(--paper-border);
		margin: 4px 0 8px;
	}

	.mt-price {
		font-weight: 700;
		font-size: 0.8rem;
		background: var(--ink);
		color: var(--lime);
		padding: 5px 10px;
		border-radius: 999px;
		align-self: flex-start;
	}

	@media (max-width: 1080px) {
		.hero-tickets {
			display: none;
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

	.categories {
		padding-top: 40px;
		padding-bottom: 12px;
	}

	.cat-row {
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
	}

	.cat-pill {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 10px 18px;
		border-radius: 999px;
		background: var(--surface);
		border: 1px solid var(--border);
		font-size: 0.88rem;
		font-weight: 600;
		transition: transform 0.3s var(--ease), border-color 0.3s var(--ease), background 0.3s var(--ease), color 0.3s var(--ease);
	}

	.cat-pill:hover {
		transform: translateY(-3px);
		border-color: var(--lime);
		background: var(--surface-hover);
		color: var(--lime);
	}

	.cat-icon {
		font-size: 1.05rem;
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
		font-size: 2.4rem;
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

	.steps {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
	}

	.step {
		position: relative;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 32px 28px;
		overflow: hidden;
	}

	.step-icon {
		font-size: 2rem;
		display: block;
		margin-bottom: 18px;
	}

	.step h3 {
		font-size: 1.15rem;
		margin-bottom: 10px;
	}

	.step p {
		color: var(--text-dim);
		font-size: 0.9rem;
	}

	.step-num {
		position: absolute;
		top: 12px;
		right: 20px;
		font-size: 2.4rem;
		color: var(--border);
	}

	@media (max-width: 780px) {
		.steps {
			grid-template-columns: 1fr;
		}
	}

	.cta-card {
		position: relative;
		text-align: center;
		padding: 80px 40px;
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
		font-size: 2.6rem;
		margin-bottom: 18px;
	}

	.cta-card p {
		color: var(--text-dim);
		max-width: 480px;
		margin: 0 auto 28px;
	}
</style>
