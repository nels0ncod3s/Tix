<script>
	import { reveal } from '$lib/actions/reveal.js';
	import { hostEvents, summary, revenueTrend, salesByCategory, formatNaira } from '$lib/data/dashboard.js';

	const maxRevenue = Math.max(...revenueTrend.map((d) => d.value));
	const maxCategory = Math.max(...salesByCategory.map((d) => d.value));

	const topEvents = [...hostEvents].sort((a, b) => b.revenue - a.revenue);
	const avgTicketPrice = summary.ticketsSold ? Math.round(summary.revenue / summary.ticketsSold) : 0;
	const conversion = summary.views ? ((summary.ticketsSold / summary.views) * 100).toFixed(1) : '0.0';
</script>

<svelte:head>
	<title>Analytics — Tix Host Dashboard</title>
</svelte:head>

<div class="page-head">
	<span class="kicker">Insights</span>
	<h1 class="display">Analytics</h1>
	<p>How your events are performing across the board.</p>
</div>

<div class="stat-grid">
	<div class="stat-card reveal" use:reveal>
		<span class="stat-label">Avg. ticket price</span>
		<strong class="stat-value display">{formatNaira(avgTicketPrice)}</strong>
	</div>
	<div class="stat-card reveal" use:reveal={{ delay: 60 }}>
		<span class="stat-label">View → sale rate</span>
		<strong class="stat-value display">{conversion}%</strong>
	</div>
	<div class="stat-card reveal" use:reveal={{ delay: 120 }}>
		<span class="stat-label">Total profile views</span>
		<strong class="stat-value display">{summary.views.toLocaleString()}</strong>
	</div>
</div>

<div class="panels">
	<div class="panel reveal" use:reveal>
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
			<h2>Sales by category</h2>
		</div>
		<div class="hbar-list">
			{#each salesByCategory as row (row.label)}
				<div class="hbar-row">
					<span class="hbar-label">{row.label}</span>
					<div class="hbar-track">
						<div class="hbar-fill" style="width:{(row.value / maxCategory) * 100}%"></div>
					</div>
					<span class="hbar-value">{row.value}</span>
				</div>
			{/each}
		</div>
	</div>
</div>

<div class="panel reveal" use:reveal={{ delay: 120 }}>
	<div class="panel-head">
		<h2>Top performing events</h2>
	</div>
	<div class="table">
		<div class="table-head">
			<span>Event</span>
			<span>Sold</span>
			<span>Revenue</span>
			<span>Views</span>
		</div>
		{#each topEvents as event (event.id)}
			<div class="table-row">
				<span class="table-title">{event.title}</span>
				<span>{event.ticketsSold}</span>
				<span class="lime-text">{formatNaira(event.revenue)}</span>
				<span>{event.views.toLocaleString()}</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.page-head {
		margin-bottom: 28px;
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
		grid-template-columns: repeat(3, 1fr);
		gap: 16px;
		margin-bottom: 20px;
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
		font-size: 1.6rem;
		color: var(--lime);
	}

	.panels {
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: 20px;
		margin-bottom: 20px;
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

	.hbar-list {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.hbar-row {
		display: grid;
		grid-template-columns: 90px 1fr 40px;
		align-items: center;
		gap: 12px;
	}

	.hbar-label {
		font-size: 0.82rem;
		color: var(--text-dim);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.hbar-track {
		height: 10px;
		border-radius: 999px;
		background: var(--bg);
		overflow: hidden;
	}

	.hbar-fill {
		height: 100%;
		border-radius: 999px;
		background: linear-gradient(90deg, var(--lime-dim), var(--lime));
	}

	.hbar-value {
		font-size: 0.8rem;
		font-weight: 700;
		text-align: right;
	}

	.table {
		display: flex;
		flex-direction: column;
	}

	.table-head,
	.table-row {
		display: grid;
		grid-template-columns: 1.6fr 0.7fr 1fr 0.8fr;
		gap: 12px;
		padding: 12px 10px;
		align-items: center;
	}

	.table-head {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--text-dimmer);
		border-bottom: 1px solid var(--border);
	}

	.table-row {
		font-size: 0.88rem;
		border-bottom: 1px solid var(--border);
	}

	.table-row:last-child {
		border-bottom: none;
	}

	.table-title {
		font-weight: 600;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	@media (max-width: 980px) {
		.stat-grid {
			grid-template-columns: 1fr;
		}

		.panels {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.table-head span:nth-child(4),
		.table-row span:nth-child(4) {
			display: none;
		}

		.table-head,
		.table-row {
			grid-template-columns: 1.6fr 0.6fr 1fr;
		}
	}
</style>
