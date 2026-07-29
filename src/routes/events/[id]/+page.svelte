<script>
	import { reveal } from '$lib/actions/reveal.js';
	import { cart } from '$lib/stores/cart.svelte.js';
	import TicketCard from '$lib/components/TicketCard.svelte';
	import { formatNaira } from '$lib/utils/currency.js';
	import { events, categories } from '$lib/data/events.js';

	let { data } = $props();
	const event = $derived(data.event);

	let selectedTierId = $state(undefined);
	let qty = $state(1);
	let added = $state(false);

	$effect(() => {
		selectedTierId = event.tiers[0].id;
		qty = 1;
	});

	const selectedTier = $derived(event.tiers.find((t) => t.id === selectedTierId) ?? event.tiers[0]);
	const subtotal = $derived(selectedTier.price * qty);
	const cat = $derived(categories.find((c) => c.id === event.category));
	const formattedDate = $derived(
		new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
	);
	const related = $derived(events.filter((e) => e.category === event.category && e.id !== event.id).slice(0, 3));

	function addToCart() {
		cart.add({
			eventId: event.id,
			tierId: selectedTier.id,
			tierName: selectedTier.name,
			title: event.title,
			date: formattedDate,
			venue: `${event.venue}, ${event.city}`,
			price: selectedTier.price,
			qty
		});
		added = true;
		setTimeout(() => (added = false), 1600);
		cart.open();
	}
</script>

<svelte:head>
	<title>{event.title} — Tix</title>
</svelte:head>

{#key event.id}
<div class="hero-banner">
	<span class="hero-watermark" aria-hidden="true">{cat?.icon}</span>
	<div class="hero-scallop" aria-hidden="true"></div>
	<div class="container hero-content">
		<a href="/events" class="back-link">← Back to events</a>
		{#if cat}<span class="badge cat-badge">{cat.icon} {cat.label}</span>{/if}
		<h1 class="display">{event.title}</h1>
		<p class="tagline">{event.tagline}</p>
		<div class="meta-row">
			<span>📅 {formattedDate} · {event.time}</span>
			<span>📍 {event.venue}, {event.city}</span>
		</div>
	</div>
</div>

<section class="section detail">
	<div class="container detail-grid">
		<div class="main-col">
			<div class="block reveal" use:reveal>
				<h2>About this event</h2>
				<p class="description">{event.description}</p>
			</div>

			<div class="block reveal" use:reveal>
				<h2>{event.category === 'sports' ? 'Matchup' : 'Lineup'}</h2>
				<ul class="lineup">
					{#each event.lineup as act, i (act)}
						<li style="animation-delay:{i * 60}ms">{act}</li>
					{/each}
				</ul>
			</div>

			<div class="block reveal" use:reveal>
				<h2>Venue</h2>
				<div class="venue-card">
					<div class="venue-icon">📍</div>
					<div>
						<strong>{event.venue}</strong>
						<span>{event.city}</span>
					</div>
				</div>
			</div>
		</div>

		<aside class="ticket-panel card">
			<h3>Select tickets</h3>
			<div class="tiers">
				{#each event.tiers as tier (tier.id)}
					<button
						type="button"
						class="tier"
						class:active={selectedTierId === tier.id}
						onclick={() => (selectedTierId = tier.id)}
					>
						<div class="tier-top">
							<span class="tier-name">{tier.name}</span>
							<span class="tier-price">{formatNaira(tier.price)}</span>
						</div>
						<ul class="perks">
							{#each tier.perks as perk (perk)}
								<li>{perk}</li>
							{/each}
						</ul>
						<span class="availability">{tier.available} left</span>
					</button>
				{/each}
			</div>

			<div class="qty-row">
				<span>Quantity</span>
				<div class="stepper">
					<button type="button" onclick={() => (qty = Math.max(1, qty - 1))}>−</button>
					<span>{qty}</span>
					<button type="button" onclick={() => (qty = Math.min(selectedTier.available, qty + 1))}>+</button>
				</div>
			</div>

			<div class="subtotal-row">
				<span>Subtotal</span>
				<strong class="display">{formatNaira(subtotal)}</strong>
			</div>

			<button type="button" class="btn btn-primary buy-btn" class:added onclick={addToCart}>
				{#if added}
					✓ Added to cart
				{:else}
					Add to cart
				{/if}
			</button>
			<p class="fine-print">You'll review your order before it's final.</p>
		</aside>
	</div>

	{#if related.length}
		<div class="container related">
			<h2 class="display reveal" use:reveal>You might also like</h2>
			<div class="grid">
				{#each related as e, i (e.id)}
					<TicketCard event={e} delay={i * 80} />
				{/each}
			</div>
		</div>
	{/if}
</section>
{/key}

<style>
	.hero-banner {
		position: relative;
		overflow: hidden;
		padding: 160px 0 60px;
		background: linear-gradient(180deg, var(--bg-soft), var(--bg));
		border-bottom: 1px solid var(--border);
	}

	.hero-watermark {
		position: absolute;
		right: -50px;
		top: -60px;
		font-size: 26rem;
		line-height: 1;
		opacity: 0.05;
		pointer-events: none;
	}

	.hero-scallop {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 22px;
		background: radial-gradient(circle at 11px 0, transparent 11px, var(--bg) 11.5px) 0 0 / 22px 22px repeat-x;
	}

	.hero-content {
		position: relative;
		z-index: 1;
	}

	.back-link {
		display: inline-block;
		font-size: 0.85rem;
		color: var(--text-dim);
		margin-bottom: 16px;
		transition: color 0.2s var(--ease);
	}

	.back-link:hover {
		color: var(--text);
	}

	.cat-badge {
		display: inline-flex;
		margin-bottom: 14px;
	}

	.hero-content h1 {
		font-size: clamp(2.4rem, 6vw, 4.4rem);
		margin-bottom: 14px;
	}

	.tagline {
		color: var(--text-dim);
		font-size: 1.05rem;
		margin-bottom: 18px;
		max-width: 600px;
	}

	.meta-row {
		display: flex;
		gap: 20px;
		flex-wrap: wrap;
		font-size: 0.9rem;
		color: var(--text-dim);
	}

	.detail {
		padding-top: 56px;
	}

	.detail-grid {
		display: grid;
		grid-template-columns: 1fr 360px;
		gap: 48px;
		align-items: start;
	}

	.main-col {
		display: flex;
		flex-direction: column;
		gap: 40px;
		min-width: 0;
	}

	.block h2 {
		font-size: 1.3rem;
		margin-bottom: 16px;
	}

	.description {
		color: var(--text-dim);
		line-height: 1.7;
	}

	.lineup {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.lineup li {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 12px;
		padding: 14px 18px;
		font-weight: 600;
		opacity: 0;
		animation: pop-in 0.5s var(--ease) forwards;
	}

	.venue-card {
		display: flex;
		align-items: center;
		gap: 16px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 20px;
	}

	.venue-card > div {
		display: flex;
		flex-direction: column;
	}

	.venue-icon {
		font-size: 1.6rem;
	}

	.venue-card span {
		color: var(--text-dim);
		font-size: 0.88rem;
	}

	.ticket-panel {
		position: sticky;
		top: 96px;
		padding: 24px;
		display: flex;
		flex-direction: column;
		gap: 18px;
	}

	.ticket-panel h3 {
		font-size: 1.1rem;
	}

	.tiers {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.tier {
		text-align: left;
		background: var(--bg);
		border: 1.5px solid var(--border);
		border-radius: var(--radius-md);
		padding: 14px 16px;
		transition: border-color 0.25s var(--ease), background 0.25s var(--ease), transform 0.25s var(--ease);
	}

	.tier:hover {
		border-color: rgba(255, 255, 255, 0.25);
	}

	.tier.active {
		border-color: var(--lime);
		background: rgba(215, 255, 63, 0.08);
		transform: translateY(-1px);
	}

	.tier-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 8px;
	}

	.tier-name {
		font-weight: 700;
		font-size: 0.92rem;
	}

	.tier-price {
		font-weight: 800;
		color: var(--lime);
	}

	.perks {
		list-style: none;
		margin: 0 0 8px;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.perks li {
		font-size: 0.78rem;
		color: var(--text-dim);
	}

	.perks li::before {
		content: '✓ ';
		color: var(--lime);
	}

	.availability {
		font-size: 0.72rem;
		color: var(--text-dimmer);
	}

	.qty-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: 4px;
	}

	.qty-row > span {
		font-size: 0.88rem;
		color: var(--text-dim);
	}

	.stepper {
		display: flex;
		align-items: center;
		gap: 12px;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 6px 10px;
	}

	.stepper button {
		width: 26px;
		height: 26px;
		border-radius: 999px;
		border: none;
		background: var(--surface);
		color: var(--text);
		font-size: 1.1rem;
		transition: background 0.2s var(--ease);
	}

	.stepper button:hover {
		background: var(--lime);
		color: var(--ink);
	}

	.stepper span {
		min-width: 18px;
		text-align: center;
		font-weight: 700;
	}

	.subtotal-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		border-top: 1px solid var(--border);
		padding-top: 16px;
	}

	.subtotal-row span {
		color: var(--text-dim);
		font-size: 0.9rem;
	}

	.subtotal-row strong {
		font-size: 1.6rem;
		color: var(--lime);
	}

	.buy-btn {
		width: 100%;
		transition: background 0.3s var(--ease), transform 0.3s var(--ease), box-shadow 0.3s var(--ease);
	}

	.buy-btn.added {
		background: var(--lime);
		box-shadow: 0 8px 24px -6px rgba(215, 255, 63, 0.5);
	}

	.fine-print {
		text-align: center;
		font-size: 0.72rem;
		color: var(--text-dimmer);
	}

	.related {
		margin-top: 88px;
	}

	.related h2 {
		font-size: 1.6rem;
		margin-bottom: 28px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
	}

	@media (max-width: 1080px) {
		.detail-grid {
			grid-template-columns: 1fr;
		}

		.ticket-panel {
			position: static;
		}
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

		.meta-row {
			flex-direction: column;
			gap: 6px;
		}
	}
</style>
