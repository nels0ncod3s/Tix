<script>
	import { reveal } from '$lib/actions/reveal.js';
	import { hostEvents, summary, revenueTrend, formatNaira } from '$lib/data/dashboard.js';

	const maxRevenue = Math.max(...revenueTrend.map((d) => d.value));
	const recentEvents = [...hostEvents].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

	const stats = [
		{ label: 'Total revenue', value: formatNaira(summary.revenue), hint: 'across all events' },
		{ label: 'Tickets sold', value: summary.ticketsSold.toLocaleString(), hint: 'lifetime' },
		{ label: 'Published events', value: summary.published, hint: `of ${hostEvents.length} total` },
		{ label: 'Profile views', value: summary.views.toLocaleString(), hint: 'last 30 days' }
	];
</script>

<svelte:head>
	<title>Overview — Tix Host Dashboard</title>
</svelte:head>

<div class="page-head">
	<div>
		<span class="kicker">Overview</span>
		<h1 class="display">Welcome back 👋</h1>
		<p>Here's how your events are doing.</p>
	</div>
	<a href="/dashboard/create" class="btn btn-primary">+ Create Event</a>
</div>

<div class="stat-grid">
	{#each stats as stat, i (stat.label)}
		<div class="stat-card reveal" use:reveal={{ delay: i * 60 }}>
			<span class="stat-label">{stat.label}</span>
			<strong class="stat-value display">{stat.value}</strong>
			<span class="stat-hint">{stat.hint}</span>
		</div>
	{/each}
</div>

<div class="panels">
	<div class="panel chart-panel reveal" use:reveal>
		<div class="panel-head">
			<h2>Revenue this week</h2>
			<span class="panel-total">{formatNaira(revenueTrend.reduce((s, d) => s + d.value, 0))}</span>
		</div>
		<div class="bar-chart">
			{#each revenueTrend as day (day.label)}
				<div class="bar-col">
					<div class="bar-track">
						<div class="bar-fill" style="height:{(day.value / maxRevenue) * 100}%"></div>
					</div>
					<span class="bar-label">{day.label}</span>
				</div>
			{/each}
		</div>
	</div>

	<div class="panel reveal" use:reveal={{ delay: 80 }}>
		<div class="panel-head">
			<h2>Recent events</h2>
			<a href="/dashboard/events" class="panel-link">View all →</a>
		</div>
		<div class="event-list">
			{#each recentEvents as event (event.id)}
				<a href="/dashboard/events" class="event-row">
					<div class="event-row-main">
						<span class="event-row-title">{event.title}</span>
						<span class="event-row-meta">{event.venue}, {event.city}</span>
					</div>
					<span class="status-badge" class:draft={event.status === 'draft'}>
						{event.status === 'draft' ? 'Draft' : 'Published'}
					</span>
					<span class="event-row-revenue">{formatNaira(event.revenue)}</span>
				</a>
			{/each}
		</div>
	</div>
</div>

<style>
	.page-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 20px;
		flex-wrap: wrap;
		margin-bottom: 32px;
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

	.stat-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 16px;
		margin-bottom: 28px;
	}

	.stat-card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 22px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	.stat-label {
		font-size: 0.8rem;
		color: var(--text-dim);
	}

	.stat-value {
		font-size: 1.7rem;
		color: var(--lime);
	}

	.stat-hint {
		font-size: 0.74rem;
		color: var(--text-dimmer);
	}

	.panels {
		display: grid;
		grid-template-columns: 1.3fr 1fr;
		gap: 20px;
	}

	.panel {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 24px;
		min-width: 0;
	}

	.panel-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	.panel-head h2 {
		font-size: 1.05rem;
	}

	.panel-total {
		font-weight: 700;
		color: var(--lime);
	}

	.panel-link {
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--text-dim);
		transition: color 0.2s var(--ease);
	}

	.panel-link:hover {
		color: var(--lime);
	}

	.bar-chart {
		display: flex;
		align-items: flex-end;
		gap: 12px;
		height: 180px;
	}

	.bar-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		height: 100%;
	}

	.bar-track {
		flex: 1;
		width: 100%;
		display: flex;
		align-items: flex-end;
		border-radius: 6px;
		overflow: hidden;
		background: var(--bg);
	}

	.bar-fill {
		width: 100%;
		background: linear-gradient(180deg, var(--lime), var(--lime-dim));
		border-radius: 6px 6px 0 0;
		transition: height 0.6s var(--ease);
	}

	.bar-label {
		font-size: 0.72rem;
		color: var(--text-dimmer);
	}

	.event-list {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.event-row {
		display: grid;
		grid-template-columns: 1fr auto auto;
		align-items: center;
		gap: 14px;
		padding: 12px 10px;
		border-radius: 10px;
		transition: background 0.2s var(--ease);
	}

	.event-row:hover {
		background: var(--surface-hover);
	}

	.event-row-main {
		display: flex;
		flex-direction: column;
		min-width: 0;
		gap: 2px;
	}

	.event-row-title {
		font-weight: 600;
		font-size: 0.9rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.event-row-meta {
		font-size: 0.76rem;
		color: var(--text-dimmer);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.status-badge {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		padding: 4px 10px;
		border-radius: 999px;
		background: rgba(215, 255, 63, 0.12);
		color: var(--lime);
		white-space: nowrap;
	}

	.status-badge.draft {
		background: var(--surface-hover);
		color: var(--text-dimmer);
	}

	.event-row-revenue {
		font-size: 0.85rem;
		font-weight: 700;
		white-space: nowrap;
	}

	@media (max-width: 980px) {
		.stat-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.panels {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 560px) {
		.stat-grid {
			grid-template-columns: 1fr;
		}

		.event-row {
			grid-template-columns: 1fr auto;
		}

		.event-row-revenue {
			display: none;
		}
	}
</style>
