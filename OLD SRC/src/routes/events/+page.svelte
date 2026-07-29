<script>
	import { page } from '$app/state';
	import TicketCard from '$lib/components/TicketCard.svelte';
	import { events, categories } from '$lib/data/events.js';

	let searchTerm = $state('');
	let selectedCategory = $state('all');
	let sort = $state('date');

	$effect(() => {
		searchTerm = page.url.searchParams.get('q') ?? '';
		selectedCategory = page.url.searchParams.get('category') ?? 'all';
	});

	const filtered = $derived.by(() => {
		const term = searchTerm.trim().toLowerCase();
		let list = events.filter((e) => {
			const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
			const matchesTerm =
				!term ||
				e.title.toLowerCase().includes(term) ||
				e.tagline.toLowerCase().includes(term) ||
				e.venue.toLowerCase().includes(term) ||
				e.city.toLowerCase().includes(term);
			return matchesCategory && matchesTerm;
		});

		if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
		else if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
		else list = [...list].sort((a, b) => new Date(a.date) - new Date(b.date));

		return list;
	});

	function reset() {
		searchTerm = '';
		selectedCategory = 'all';
		sort = 'date';
	}
</script>

<svelte:head>
	<title>Events — Tix</title>
</svelte:head>

<section class="listing-hero">
	<div class="container">
		<span class="kicker">Browse</span>
		<h1 class="display">Find your next event</h1>
		<p>{events.length} events across music, sports, comedy, and more — all over Nigeria.</p>
	</div>
</section>

<section class="section listing">
	<div class="container">
		<div class="filter-bar card">
			<div class="search-wrap">
				<svg viewBox="0 0 24 24" width="18" height="18"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
				<input type="text" placeholder="Search by name, venue, or city..." bind:value={searchTerm} />
			</div>

			<select bind:value={sort} class="sort-select">
				<option value="date">Sort: Soonest</option>
				<option value="price-asc">Sort: Price (low to high)</option>
				<option value="price-desc">Sort: Price (high to low)</option>
			</select>
		</div>

		<div class="chip-row">
			<button type="button" class="chip" class:active={selectedCategory === 'all'} onclick={() => (selectedCategory = 'all')}>
				All events
			</button>
			{#each categories as cat (cat.id)}
				<button
					type="button"
					class="chip"
					class:active={selectedCategory === cat.id}
					onclick={() => (selectedCategory = cat.id)}
				>
					{cat.icon} {cat.label}
				</button>
			{/each}
		</div>

		<p class="result-count">{filtered.length} event{filtered.length === 1 ? '' : 's'} found</p>

		{#if filtered.length > 0}
			<div class="grid">
				{#each filtered as event, i (event.id)}
					<TicketCard {event} delay={(i % 3) * 80} />
				{/each}
			</div>
		{:else}
			<div class="empty card">
				<span class="empty-icon">🔍</span>
				<h3>No events match your search</h3>
				<p>Try a different keyword or clear your filters.</p>
				<button type="button" class="btn btn-primary" onclick={reset}>Clear filters</button>
			</div>
		{/if}
	</div>
</section>

<style>
	.listing-hero {
		padding: 64px 0 32px;
	}

	.kicker {
		display: block;
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--coral);
		margin-bottom: 10px;
	}

	.listing-hero h1 {
		font-size: clamp(2rem, 4vw, 2.8rem);
		margin-bottom: 10px;
	}

	.listing-hero p {
		color: var(--text-dim);
	}

	.listing {
		padding-top: 0;
	}

	.filter-bar {
		display: flex;
		gap: 14px;
		padding: 14px;
		margin-bottom: 20px;
		flex-wrap: wrap;
	}

	.search-wrap {
		flex: 1;
		min-width: 220px;
		display: flex;
		align-items: center;
		gap: 10px;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 10px 18px;
		color: var(--text-dimmer);
		transition: border-color 0.25s var(--ease);
	}

	.search-wrap:focus-within {
		border-color: var(--lime);
	}

	.search-wrap input {
		flex: 1;
		border: none;
		background: transparent;
		color: var(--text);
		font-size: 0.92rem;
	}

	.search-wrap input:focus {
		outline: none;
	}

	.sort-select {
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 10px 18px;
		color: var(--text);
		font-size: 0.88rem;
	}

	.chip-row {
		display: flex;
		gap: 10px;
		flex-wrap: wrap;
		margin-bottom: 24px;
	}

	.chip {
		padding: 9px 16px;
		border-radius: 999px;
		background: var(--surface);
		border: 1px solid var(--border);
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-dim);
		transition: all 0.25s var(--ease);
	}

	.chip:hover {
		border-color: rgba(255, 255, 255, 0.2);
		color: var(--text);
	}

	.chip.active {
		background: var(--lime);
		color: var(--ink);
		border-color: transparent;
	}

	.result-count {
		font-size: 0.85rem;
		color: var(--text-dimmer);
		margin-bottom: 20px;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
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

	.empty {
		text-align: center;
		padding: 64px 24px;
		animation: pop-in 0.4s var(--ease);
	}

	.empty-icon {
		font-size: 2.6rem;
		display: block;
		margin-bottom: 16px;
	}

	.empty h3 {
		margin-bottom: 8px;
	}

	.empty p {
		color: var(--text-dim);
		margin-bottom: 22px;
	}
</style>
