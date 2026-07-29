<script>
	import { reveal } from '$lib/actions/reveal.js';
	import { tilt } from '$lib/actions/tilt.js';
	import { categories } from '$lib/data/events.js';
	import { formatNaira } from '$lib/utils/currency.js';
	import { rngFor } from '$lib/utils/hash.js';

	let { event, delay = 0 } = $props();

	const cat = $derived(categories.find((c) => c.id === event.category));
	const dateObj = $derived(new Date(event.date));
	const day = $derived(dateObj.toLocaleDateString('en-US', { day: '2-digit' }));
	const month = $derived(dateObj.toLocaleDateString('en-US', { month: 'short' }));

	const scatter = $derived.by(() => (rngFor(event.id)() * 7 - 3.5).toFixed(1));

	const serial = $derived.by(() => {
		const rng = rngFor(event.id + 'serial');
		return String(Math.floor(rng() * 900000) + 100000);
	});

	const bars = $derived.by(() => {
		const rng = rngFor(event.id + 'barcode');
		return Array.from({ length: 30 }, () => (rng() > 0.6 ? 3 : rng() > 0.3 ? 2 : 1));
	});
</script>

<a
	href={`/events/${event.id}`}
	class="ticket-card reveal"
	style="--scatter: {scatter}deg"
	use:reveal={{ delay }}
	use:tilt={{ max: 5, lift: 6 }}
>
	<div class="ticket-top">
		<span class="paper-grain" aria-hidden="true"></span>
		<div class="ticket-heading">
			{#if cat}<span class="cat-pill">{cat.icon} {cat.label}</span>{/if}
			<div class="date-stamp">
				<span class="day">{day}</span>
				<span class="month">{month}</span>
			</div>
		</div>
		<h3 class="display">{event.title}</h3>
		<p class="tagline">{event.tagline}</p>
		<p class="venue">📍 {event.venue}, {event.city}</p>
	</div>

	<div class="perforation" aria-hidden="true">
		<span class="notch left"></span>
		<span class="notch right"></span>
	</div>

	<div class="ticket-stub">
		<span class="paper-grain" aria-hidden="true"></span>
		<div class="stub-left">
			<div class="barcode" aria-hidden="true">
				{#each bars as w, i (i)}
					<span style="width:{w}px"></span>
				{/each}
			</div>
			<span class="serial">NO. {serial}</span>
		</div>
		<span class="price-chip">From {formatNaira(event.price)}</span>
	</div>
</a>

<style>
	.ticket-card {
		display: block;
		position: relative;
		border-radius: var(--radius-md);
		box-shadow: var(--shadow-paper);
		transform: rotate(var(--scatter, 0deg));
		transition: transform 0.3s var(--ease-out-back), box-shadow 0.3s var(--ease);
		will-change: transform;
	}

	.ticket-card:hover {
		box-shadow: 0 40px 80px -20px rgba(0, 0, 0, 0.65), 0 0 0 2px var(--lime);
	}

	.ticket-top {
		position: relative;
		overflow: hidden;
		border-radius: var(--radius-md) var(--radius-md) 0 0;
		background: var(--paper);
		color: var(--paper-ink);
		padding: 22px 22px 26px;
	}

	.paper-grain {
		position: absolute;
		inset: 0;
		opacity: 0.05;
		mix-blend-mode: multiply;
		pointer-events: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
	}

	.ticket-heading {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 10px;
		margin-bottom: 20px;
	}

	.cat-pill {
		font-size: 0.66rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		background: var(--paper-ink);
		color: var(--lime);
		padding: 6px 11px;
		border-radius: 999px;
		white-space: nowrap;
	}

	.date-stamp {
		display: flex;
		flex-direction: column;
		align-items: center;
		line-height: 0.85;
		transform: rotate(3deg);
		border: 2px solid var(--paper-ink);
		border-radius: 10px;
		padding: 6px 10px;
		flex-shrink: 0;
	}

	.date-stamp .day {
		font-family: 'Anton', sans-serif;
		font-size: 1.35rem;
	}

	.date-stamp .month {
		font-size: 0.58rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		margin-top: 2px;
	}

	h3.display {
		font-size: 1.55rem;
		margin-bottom: 10px;
		color: var(--paper-ink);
	}

	.tagline {
		font-size: 0.85rem;
		color: var(--paper-ink-dim);
		margin-bottom: 14px;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.venue {
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--paper-ink);
	}

	.perforation {
		position: relative;
		height: 0;
		border-top: 2px dashed var(--paper-border);
	}

	.notch {
		position: absolute;
		top: -9px;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--bg);
	}

	.notch.left {
		left: -9px;
	}

	.notch.right {
		right: -9px;
	}

	.ticket-stub {
		position: relative;
		overflow: hidden;
		border-radius: 0 0 var(--radius-md) var(--radius-md);
		background: var(--paper-2);
		padding: 16px 22px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.stub-left {
		display: flex;
		flex-direction: column;
		gap: 6px;
		min-width: 0;
	}

	.barcode {
		display: flex;
		align-items: center;
		gap: 2px;
		height: 24px;
	}

	.barcode span {
		height: 100%;
		background: var(--paper-ink);
		border-radius: 1px;
		flex-shrink: 0;
	}

	.serial {
		font-size: 0.64rem;
		font-family: monospace;
		color: var(--paper-ink-dim);
		letter-spacing: 0.05em;
	}

	.price-chip {
		flex-shrink: 0;
		background: var(--ink);
		color: var(--lime);
		font-weight: 700;
		font-size: 0.78rem;
		padding: 8px 13px;
		border-radius: 999px;
		white-space: nowrap;
	}
</style>
