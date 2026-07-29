<script>
	import { onMount } from 'svelte';

	let dot = $state(null);
	let enabled = $state(false);

	onMount(() => {
		if (
			!matchMedia('(pointer: fine)').matches ||
			matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			return;
		}

		enabled = true;

		let mx = window.innerWidth / 2;
		let my = window.innerHeight / 2;
		let x = mx;
		let y = my;
		let scale = 1;
		let targetScale = 1;
		let raf;

		function onMove(e) {
			mx = e.clientX;
			my = e.clientY;
		}

		function onOver(e) {
			const hit = e.target.closest?.(
				'a, button, input, select, textarea, [role="button"], .ticket-card'
			);
			targetScale = hit ? 2.4 : 1;
		}

		function tick() {
			x += (mx - x) * 0.22;
			y += (my - y) * 0.22;
			scale += (targetScale - scale) * 0.22;
			if (dot) dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${scale})`;
			raf = requestAnimationFrame(tick);
		}

		raf = requestAnimationFrame(tick);
		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseover', onOver);
		document.documentElement.classList.add('custom-cursor');

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('mousemove', onMove);
			window.removeEventListener('mouseover', onOver);
			document.documentElement.classList.remove('custom-cursor');
		};
	});
</script>

{#if enabled}
	<div class="cursor-dot" bind:this={dot} aria-hidden="true"></div>
{/if}

<style>
	.cursor-dot {
		position: fixed;
		top: 0;
		left: 0;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: var(--lime);
		mix-blend-mode: difference;
		pointer-events: none;
		z-index: 9999;
		will-change: transform;
	}
</style>
