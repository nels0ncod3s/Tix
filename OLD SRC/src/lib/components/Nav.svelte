<script>
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { cart } from '$lib/stores/cart.svelte.js';
	import { categories } from '$lib/data/events.js';

	let scrollY = $state(0);
	let mobileOpen = $state(false);
	let searchOpen = $state(false);
	let searchValue = $state('');

	const scrolled = $derived(scrollY > 12);

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/events', label: 'Events' }
	];

	function isActive(href) {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}

	function submitSearch(e) {
		e.preventDefault();
		const q = searchValue.trim();
		goto(q ? `/events?q=${encodeURIComponent(q)}` : '/events');
	}

	function closeMobile() {
		mobileOpen = false;
	}

	function onWindowKeydown(e) {
		if (e.key === 'Escape' && mobileOpen) closeMobile();
	}

	$effect(() => {
		document.documentElement.style.overflow = mobileOpen ? 'hidden' : '';
	});

	$effect(() => {
		page.url.pathname;
		mobileOpen = false;
	});
</script>

<svelte:window bind:scrollY onkeydown={onWindowKeydown} />

<header class="nav" class:scrolled>
	<div class="container bar">
		<a href="/" class="logo">
			<span class="logo-mark">🎟</span>
			<span class="display">Tix<span class="lime-text">.</span></span>
		</a>

		<nav class="links">
			{#each links as link (link.href)}
				<a href={link.href} class="link" class:active={isActive(link.href)}>{link.label}</a>
			{/each}
		</nav>

		<div class="actions">
			<form class="search" class:open={searchOpen} onsubmit={submitSearch}>
				<button
					type="button"
					class="icon-btn"
					aria-label="Search events"
					onclick={() => (searchOpen = !searchOpen)}
				>
					<svg viewBox="0 0 24 24" width="18" height="18"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
				</button>
				<input
					type="text"
					placeholder="Search events, cities..."
					bind:value={searchValue}
					class="search-input"
				/>
			</form>

			<button type="button" class="icon-btn cart-btn" aria-label="Open cart" onclick={() => cart.open()}>
				<svg viewBox="0 0 24 24" width="19" height="19"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="9" cy="21" r="1.4" fill="currentColor"/><circle cx="17" cy="21" r="1.4" fill="currentColor"/></svg>
				{#if cart.count > 0}
					<span class="cart-badge">{cart.count}</span>
				{/if}
			</button>

			<a href="/events" class="btn btn-primary cta">Get Tickets</a>

			<button
				type="button"
				class="icon-btn burger"
				aria-label="Toggle menu"
				aria-expanded={mobileOpen}
				onclick={() => (mobileOpen = !mobileOpen)}
			>
				<svg viewBox="0 0 24 24" width="20" height="20">
					{#if mobileOpen}
						<line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
						<line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
					{:else}
						<line x1="4" y1="7" x2="20" y2="7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
						<line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
						<line x1="4" y1="17" x2="20" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
					{/if}
				</svg>
			</button>
		</div>
	</div>

	{#if mobileOpen}
		<div class="mobile-overlay" transition:fade={{ duration: 220 }}>
			<form class="mobile-search" onsubmit={submitSearch} in:fly={{ y: 16, duration: 400, delay: 60 }}>
				<svg viewBox="0 0 24 24" width="18" height="18"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
				<input type="text" placeholder="Search events, cities..." bind:value={searchValue} />
			</form>

			<nav class="mobile-links">
				{#each links as link, i (link.href)}
					<a
						href={link.href}
						class:active={isActive(link.href)}
						in:fly={{ y: 18, duration: 400, delay: 100 + i * 70 }}
						onclick={closeMobile}
					>
						{link.label}
					</a>
				{/each}
			</nav>

			<div class="mobile-categories" in:fly={{ y: 18, duration: 400, delay: 100 + links.length * 70 }}>
				{#each categories as cat (cat.id)}
					<a href={`/events?category=${cat.id}`} onclick={closeMobile}>{cat.icon} {cat.label}</a>
				{/each}
			</div>

			<a
				href="/events"
				class="btn btn-primary mobile-cta"
				in:fly={{ y: 18, duration: 400, delay: 100 + (links.length + 1) * 70 }}
				onclick={closeMobile}
			>
				Get Tickets
			</a>
		</div>
	{/if}
</header>

<style>
	.nav {
		position: sticky;
		top: 0;
		z-index: 100;
		transition: background 0.4s var(--ease), border-color 0.4s var(--ease), box-shadow 0.4s var(--ease);
		border-bottom: 1px solid transparent;
	}

	.nav.scrolled {
		background: rgba(10, 10, 11, 0.78);
		backdrop-filter: blur(18px);
		border-bottom-color: var(--border);
		box-shadow: 0 12px 32px -18px rgba(0, 0, 0, 0.7);
	}

	.bar {
		display: flex;
		align-items: center;
		gap: 28px;
		height: 76px;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 1.6rem;
		flex-shrink: 0;
	}

	.logo-mark {
		font-size: 1.25rem;
	}

	.links {
		display: flex;
		gap: 4px;
		flex: 1;
	}

	.link {
		position: relative;
		padding: 8px 14px;
		border-radius: 999px;
		font-weight: 500;
		font-size: 0.92rem;
		color: var(--text-dim);
		transition: color 0.25s var(--ease), background 0.25s var(--ease);
	}

	.link:hover {
		color: var(--text);
		background: var(--surface);
	}

	.link.active {
		color: var(--text);
		background: var(--surface-hover);
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.search {
		display: flex;
		align-items: center;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 4px;
	}

	.search-input {
		width: 0;
		opacity: 0;
		border: none;
		background: transparent;
		color: var(--text);
		font-size: 0.9rem;
		transition: width 0.4s var(--ease), opacity 0.3s var(--ease), padding 0.4s var(--ease);
		padding: 0;
	}

	.search.open .search-input {
		width: 180px;
		opacity: 1;
		padding: 6px 10px 6px 0;
	}

	.search-input:focus {
		outline: none;
	}

	.icon-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--surface);
		color: var(--text);
		transition: background 0.25s var(--ease), transform 0.25s var(--ease), border-color 0.25s var(--ease);
		flex-shrink: 0;
		position: relative;
	}

	.icon-btn:hover {
		background: var(--surface-hover);
		border-color: rgba(255, 255, 255, 0.2);
		transform: translateY(-1px);
	}

	.cart-badge {
		position: absolute;
		top: -4px;
		right: -4px;
		background: var(--lime);
		color: var(--ink);
		font-size: 0.65rem;
		font-weight: 700;
		min-width: 18px;
		height: 18px;
		border-radius: 999px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 4px;
		animation: pop-in 0.3s var(--ease);
	}

	.cta {
		padding: 10px 20px;
	}

	.burger {
		display: none;
	}

	.mobile-overlay {
		position: fixed;
		inset: 0;
		top: 76px;
		z-index: 99;
		background: var(--bg);
		border-top: 1px solid var(--border);
		padding: 28px 24px 40px;
		display: flex;
		flex-direction: column;
		gap: 28px;
		overflow-y: auto;
	}

	.mobile-search {
		display: flex;
		align-items: center;
		gap: 10px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 14px 18px;
		color: var(--text-dimmer);
	}

	.mobile-search input {
		flex: 1;
		border: none;
		background: transparent;
		color: var(--text);
		font-size: 0.95rem;
	}

	.mobile-search input:focus {
		outline: none;
	}

	.mobile-links {
		display: flex;
		flex-direction: column;
	}

	.mobile-links a {
		padding: 16px 4px;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-dim);
		border-bottom: 1px solid var(--border);
		transition: color 0.2s var(--ease);
	}

	.mobile-links a.active,
	.mobile-links a:hover {
		color: var(--lime);
	}

	.mobile-categories {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.mobile-categories a {
		padding: 9px 16px;
		border-radius: 999px;
		background: var(--surface);
		border: 1px solid var(--border);
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-dim);
	}

	.mobile-cta {
		margin-top: auto;
		width: 100%;
	}

	@media (max-width: 860px) {
		.links {
			display: none;
		}

		.search-input, .search {
			display: none;
		}

		.cta {
			display: none;
		}

		.burger {
			display: flex;
		}
	}
</style>
