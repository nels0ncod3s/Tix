<script>
	import { fade, fly } from 'svelte/transition';
	import { page } from '$app/state';

	let { children } = $props();
	let mobileNavOpen = $state(false);

	const navItems = [
		{ href: '/dashboard', label: 'Overview', icon: '📊', exact: true },
		{ href: '/dashboard/events', label: 'My Events', icon: '🎟️' },
		{ href: '/dashboard/create', label: 'Create Event', icon: '➕' },
		{ href: '/dashboard/analytics', label: 'Analytics', icon: '📈' }
	];

	function isActive(item) {
		if (item.exact) return page.url.pathname === item.href;
		return page.url.pathname.startsWith(item.href);
	}

	function closeMobileNav() {
		mobileNavOpen = false;
	}

	$effect(() => {
		page.url.pathname;
		mobileNavOpen = false;
	});

	$effect(() => {
		document.documentElement.style.overflow = mobileNavOpen ? 'hidden' : '';
	});
</script>

<svelte:head>
	<title>Host Dashboard — Tix</title>
</svelte:head>

<svelte:window onkeydown={(e) => e.key === 'Escape' && closeMobileNav()} />

<div class="dash">
	<aside class="sidebar">
		<a href="/" class="brand display">Tix<span class="lime-text">.</span></a>
		<span class="brand-tag">HOST</span>

		<nav class="side-nav">
			{#each navItems as item (item.href)}
				<a href={item.href} class="side-link" class:active={isActive(item)}>
					<span class="side-icon">{item.icon}</span>
					{item.label}
				</a>
			{/each}
		</nav>

		<div class="side-foot">
			<div class="host-chip">
				<span class="host-avatar">🎤</span>
				<div>
					<strong>Naija Nights Ltd</strong>
					<span>Host account</span>
				</div>
			</div>
			<a href="/" class="back-link">← Back to Tix</a>
		</div>
	</aside>

	<div class="dash-main">
		<header class="dash-topbar">
			<button
				type="button"
				class="topbar-burger"
				aria-label="Open menu"
				onclick={() => (mobileNavOpen = true)}
			>
				<svg viewBox="0 0 24 24" width="20" height="20"><line x1="4" y1="7" x2="20" y2="7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="4" y1="17" x2="20" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
			</button>
			<a href="/" class="topbar-brand display">Tix<span class="lime-text">.</span></a>
			<a href="/dashboard/create" class="btn btn-primary topbar-cta">+ Create Event</a>
		</header>

		<main class="dash-content">
			{@render children()}
		</main>
	</div>
</div>

{#if mobileNavOpen}
	<div class="mobile-nav-backdrop" transition:fade={{ duration: 200 }} onclick={closeMobileNav} role="presentation"></div>
	<div class="mobile-nav-panel" transition:fly={{ x: -280, duration: 300 }}>
		<div class="mobile-nav-head">
			<span class="display">Tix<span class="lime-text">.</span> <span class="brand-tag">HOST</span></span>
			<button type="button" class="close" onclick={closeMobileNav} aria-label="Close menu">✕</button>
		</div>
		<nav class="side-nav">
			{#each navItems as item (item.href)}
				<a href={item.href} class="side-link" class:active={isActive(item)} onclick={closeMobileNav}>
					<span class="side-icon">{item.icon}</span>
					{item.label}
				</a>
			{/each}
		</nav>
		<a href="/" class="back-link">← Back to Tix</a>
	</div>
{/if}

<style>
	.dash {
		display: flex;
		min-height: 100vh;
		background: var(--bg);
		color: var(--text);
	}

	.sidebar {
		position: sticky;
		top: 0;
		height: 100vh;
		width: 250px;
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		padding: 28px 20px;
		background: var(--bg-soft);
		border-right: 1px solid var(--border);
	}

	.brand {
		font-size: 1.5rem;
	}

	.brand-tag {
		display: inline-block;
		font-size: 0.62rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		color: var(--ink);
		background: var(--lime);
		padding: 2px 7px;
		border-radius: 999px;
		margin: 6px 0 32px;
	}

	.side-nav {
		display: flex;
		flex-direction: column;
		gap: 4px;
		flex: 1;
	}

	.side-link {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 11px 14px;
		border-radius: 12px;
		font-weight: 600;
		font-size: 0.92rem;
		color: var(--text-dim);
		transition: background 0.2s var(--ease), color 0.2s var(--ease);
	}

	.side-icon {
		font-size: 1.05rem;
		width: 22px;
		text-align: center;
	}

	.side-link:hover {
		background: var(--surface);
		color: var(--text);
	}

	.side-link.active {
		background: rgba(215, 255, 63, 0.1);
		color: var(--lime);
	}

	.side-foot {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.host-chip {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px;
		border-radius: 12px;
		background: var(--surface);
		border: 1px solid var(--border);
	}

	.host-avatar {
		width: 34px;
		height: 34px;
		flex-shrink: 0;
		border-radius: 50%;
		background: var(--grad-brand, var(--lime));
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
	}

	.host-chip div {
		display: flex;
		flex-direction: column;
		min-width: 0;
		line-height: 1.3;
	}

	.host-chip strong {
		font-size: 0.82rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.host-chip span {
		font-size: 0.72rem;
		color: var(--text-dimmer);
	}

	.back-link {
		font-size: 0.82rem;
		color: var(--text-dimmer);
		transition: color 0.2s var(--ease);
	}

	.back-link:hover {
		color: var(--lime);
	}

	.dash-main {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}

	.dash-topbar {
		display: none;
		align-items: center;
		gap: 14px;
		padding: 16px 20px;
		border-bottom: 1px solid var(--border);
		position: sticky;
		top: 0;
		background: rgba(10, 10, 11, 0.85);
		backdrop-filter: blur(14px);
		z-index: 10;
	}

	.topbar-burger {
		width: 38px;
		height: 38px;
		flex-shrink: 0;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--surface);
		color: var(--text);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.topbar-brand {
		font-size: 1.3rem;
		flex: 1;
	}

	.topbar-cta {
		padding: 10px 16px;
		font-size: 0.85rem;
		white-space: nowrap;
	}

	.dash-content {
		flex: 1;
		padding: 40px;
		max-width: 1200px;
		width: 100%;
	}

	.mobile-nav-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(4, 4, 4, 0.6);
		z-index: 200;
	}

	.mobile-nav-panel {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: min(280px, 84vw);
		background: var(--bg-soft);
		border-right: 1px solid var(--border);
		z-index: 201;
		display: flex;
		flex-direction: column;
		gap: 24px;
		padding: 24px 20px;
	}

	.mobile-nav-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.mobile-nav-head .close {
		width: 34px;
		height: 34px;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--surface);
		color: var(--text-dim);
	}

	@media (max-width: 980px) {
		.sidebar {
			display: none;
		}

		.dash-topbar {
			display: flex;
		}

		.dash-content {
			padding: 24px 20px 48px;
		}
	}

	@media (max-width: 560px) {
		.topbar-cta span.long {
			display: none;
		}
	}
</style>
