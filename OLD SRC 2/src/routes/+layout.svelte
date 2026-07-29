<script>
	import '../app.css';
	import { page } from '$app/state';
	import { fade, fly } from 'svelte/transition';
	import favicon from '$lib/assets/favicon.svg';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CartDrawer from '$lib/components/CartDrawer.svelte';
	import Cursor from '$lib/components/Cursor.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Cursor />

<div class="bg-fx" aria-hidden="true">
	<span class="glow"></span>
</div>

<div class="grain-overlay" aria-hidden="true"></div>

<div class="app-shell">
	<Nav />
	<main>
		{#key page.url.pathname}
			<div class="page-transition" in:fly={{ y: 14, duration: 400, delay: 120 }} out:fade={{ duration: 120 }}>
				{@render children()}
			</div>
		{/key}
	</main>
	<Footer />
</div>

<CartDrawer />

<style>
	.bg-fx {
		position: fixed;
		inset: 0;
		z-index: -1;
		overflow: hidden;
		pointer-events: none;
	}

	.glow {
		position: absolute;
		width: 900px;
		height: 900px;
		top: -420px;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 50%;
		background: radial-gradient(circle, rgba(215, 255, 63, 0.14), transparent 70%);
		filter: blur(20px);
	}

	.grain-overlay {
		position: fixed;
		inset: 0;
		z-index: 999;
		pointer-events: none;
		opacity: 0.035;
		mix-blend-mode: overlay;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
	}

	.app-shell {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
	}

	.page-transition {
		min-height: 100%;
	}
</style>
