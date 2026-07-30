<script>
	import { reveal } from '$lib/actions/reveal.js';
	import { hostEvents, formatNaira } from '$lib/data/dashboard.js';

	let filter = $state('all');

	const filtered = $derived(
		filter === 'all' ? hostEvents : hostEvents.filter((e) => e.status === filter)
	);

	function formattedDate(date) {
		return new Date(date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
	}
</script>

<svelte:head>
	<title>My Events — Tix Host Dashboard</title>
</svelte:head>

<div class="page-head">
	<div>
		<span class="kicker">Manage</span>
		<h1 class="display">My events</h1>
		<p>{hostEvents.length} events total.</p>
	</div>
	<a href="/dashboard/create" class="btn btn-primary">+ Create Event</a>
</div>

<div class="filter-row">
	{#each [['all', 'All'], ['published', 'Published'], ['draft', 'Drafts']] as [value, label] (value)}
		<button type="button" class="chip" class:active={filter === value} onclick={() => (filter = value)}>
			{label}
		</button>
	{/each}
</div>

<div class="event-cards">
	{#each filtered as event, i (event.id)}
		<div class="event-card reveal" use:reveal={{ delay: i * 60 }}>
			<div class="event-card-head">
				<div>
					<h3>{event.title}</h3>
					<span class="event-meta">📅 {formattedDate(event.date)} · 📍 {event.venue}, {event.city}</span>
				</div>
				<span class="status-badge" class:draft={event.status === 'draft'}>
					{event.status === 'draft' ? 'Draft' : 'Published'}
				</span>
			</div>

			<div class="progress-row">
				<div class="progress-track">
					<div class="progress-fill" style="width:{Math.min(100, (event.ticketsSold / event.ticketsTotal) * 100)}%"></div>
				</div>
				<span class="progress-label">{event.ticketsSold} / {event.ticketsTotal} sold</span>
			</div>

			<div class="event-card-foot">
				<div class="foot-stat">
					<span>Revenue</span>
					<strong>{formatNaira(event.revenue)}</strong>
				</div>
				<div class="foot-stat">
					<span>Views</span>
					<strong>{event.views.toLocaleString()}</strong>
				</div>
				<div class="foot-actions">
					<a href={`/events/${event.id}`} class="btn btn-ghost foot-btn">View live</a>
					<button type="button" class="btn btn-ghost foot-btn">Edit</button>
				</div>
			</div>
		</div>
	{:else}
		<div class="empty">
			<span>🎪</span>
			<p>No events in this filter yet.</p>
		</div>
	{/each}
</div>

<style>
	.page-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 20px;
		flex-wrap: wrap;
		margin-bottom: 24px;
	}

	.kicker {
		display: block;
		font-size: 0.78rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--coral);
		margin-bottom: 8px;
	}

	.page-head h1 {
		font-size: 2rem;
		margin-bottom: 8px;
	}

	.page-head p {
		color: var(--text-dim);
		font-size: 0.92rem;
	}

	.filter-row {
		display: flex;
		gap: 10px;
		margin-bottom: 24px;
	}

	.chip {
		padding: 9px 18px;
		border-radius: 999px;
		background: var(--surface);
		border: 1px solid var(--border);
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-dim);
		transition: all 0.2s var(--ease);
	}

	.chip.active {
		background: var(--lime);
		color: var(--ink);
		border-color: transparent;
	}

	.event-cards {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.event-card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 22px;
	}

	.event-card-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 14px;
		margin-bottom: 18px;
	}

	.event-card-head h3 {
		font-size: 1.1rem;
		margin-bottom: 6px;
	}

	.event-meta {
		font-size: 0.8rem;
		color: var(--text-dimmer);
	}

	.status-badge {
		flex-shrink: 0;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		padding: 5px 11px;
		border-radius: 999px;
		background: rgba(215, 255, 63, 0.12);
		color: var(--lime);
		white-space: nowrap;
	}

	.status-badge.draft {
		background: var(--surface-hover);
		color: var(--text-dimmer);
	}

	.progress-row {
		display: flex;
		align-items: center;
		gap: 14px;
		margin-bottom: 18px;
	}

	.progress-track {
		flex: 1;
		height: 8px;
		border-radius: 999px;
		background: var(--bg);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		border-radius: 999px;
		background: linear-gradient(90deg, var(--lime-dim), var(--lime));
	}

	.progress-label {
		font-size: 0.78rem;
		color: var(--text-dim);
		white-space: nowrap;
		flex-shrink: 0;
	}

	.event-card-foot {
		display: flex;
		align-items: center;
		gap: 28px;
		padding-top: 16px;
		border-top: 1px solid var(--border);
		flex-wrap: wrap;
	}

	.foot-stat {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.foot-stat span {
		font-size: 0.72rem;
		color: var(--text-dimmer);
	}

	.foot-stat strong {
		font-size: 0.92rem;
	}

	.foot-actions {
		display: flex;
		gap: 10px;
		margin-left: auto;
	}

	.foot-btn {
		padding: 9px 16px;
		font-size: 0.82rem;
	}

	.empty {
		text-align: center;
		padding: 60px 24px;
		color: var(--text-dim);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
	}

	.empty span {
		font-size: 2rem;
		display: block;
		margin-bottom: 12px;
	}

	@media (max-width: 640px) {
		.foot-actions {
			margin-left: 0;
			width: 100%;
		}

		.foot-btn {
			flex: 1;
			text-align: center;
		}
	}
</style>
