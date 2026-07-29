<script>
	import { reveal } from '$lib/actions/reveal.js';

	let { value = 0, suffix = '', duration = 1400 } = $props();

	let display = $state(0);
	let started = false;

	function start(node) {
		const obs = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting && !started) {
						started = true;
						run();
						obs.disconnect();
					}
				}
			},
			{ threshold: 0.4 }
		);
		obs.observe(node);
		return { destroy: () => obs.disconnect() };
	}

	function run() {
		const startTime = performance.now();
		function tick(now) {
			const progress = Math.min((now - startTime) / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			display = Math.round(value * eased);
			if (progress < 1) requestAnimationFrame(tick);
		}
		requestAnimationFrame(tick);
	}
</script>

<span use:start use:reveal>{display.toLocaleString()}{suffix}</span>
