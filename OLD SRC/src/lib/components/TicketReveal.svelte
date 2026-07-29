<script>
	import { formatNaira } from '$lib/utils/currency.js';

	let { order, onclose } = $props();

	function code(seed) {
		return seed
			.split('')
			.reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) % 999999, 7)
			.toString(16)
			.toUpperCase()
			.padStart(6, '0');
	}

	function qrPattern(seed) {
		let n = seed.split('').reduce((a, c) => a * 33 + c.charCodeAt(0), 5);
		const cells = [];
		for (let i = 0; i < 64; i++) {
			n = (n * 1103515245 + 12345) & 0x7fffffff;
			cells.push(n % 5 === 0 || n % 7 === 0);
		}
		return cells;
	}

	const confetti = Array.from({ length: 24 }, (_, i) => ({
		x: (Math.sin(i * 12.9898) * 43758.5453) % 1,
		delay: (i * 37) % 600,
		color: ['var(--lime)', 'var(--coral)', 'var(--paper)', 'var(--lime-dim)'][i % 4],
		rot: (i * 53) % 360
	}));

	function focusModal(node) {
		node.focus();
	}
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && onclose()} />

<div
	class="backdrop"
	role="button"
	tabindex="0"
	aria-label="Close"
	onclick={onclose}
	onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && onclose()}
>
	<div
		class="modal"
		role="dialog"
		aria-modal="true"
		aria-label="Order confirmation"
		tabindex="-1"
		use:focusModal
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.stopPropagation()}
	>
		<div class="confetti-field" aria-hidden="true">
			{#each confetti as c, i (i)}
				<span
					class="confetti"
					style="left:{Math.abs(c.x) * 100}%; animation-delay:{c.delay}ms; background:{c.color}; transform: rotate({c.rot}deg);"
				></span>
			{/each}
		</div>

		<div class="header">
			<h3 class="display">You're going<span class="lime-text">.</span></h3>
			<button type="button" class="close" onclick={onclose} aria-label="Close">✕</button>
		</div>
		<p class="sub">Your tickets are booked. Screenshot these, but the real ones live in your inbox.</p>

		<div class="stubs">
			{#each order.items as item, i (item.eventId + item.tierId)}
				<div class="stub" style="animation-delay: {i * 120}ms">
					<div class="stub-main">
						<span class="stub-tag">{item.tierName}</span>
						<h4>{item.title}</h4>
						<div class="stub-meta">
							<span>📅 {item.date}</span>
							<span>📍 {item.venue}</span>
						</div>
						<div class="stub-qty">Qty × {item.qty}</div>
					</div>
					<div class="stub-divider">
						<span class="notch top"></span>
						<span class="notch bottom"></span>
					</div>
					<div class="stub-code">
						<div class="qr">
							{#each qrPattern(item.eventId + item.tierId) as filled}
								<span class:filled></span>
							{/each}
						</div>
						<span class="code">#{code(item.eventId + item.tierId)}</span>
					</div>
				</div>
			{/each}
		</div>

		<div class="total-row">
			<span>Total paid</span>
			<strong class="display">{formatNaira(order.total)}</strong>
		</div>

		<button type="button" class="btn btn-primary done" onclick={onclose}>Done</button>
	</div>
</div>

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(4, 4, 4, 0.78);
		backdrop-filter: blur(6px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 300;
		padding: 24px;
		animation: fade-in 0.3s var(--ease);
	}

	@keyframes fade-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.modal {
		position: relative;
		background: var(--bg-soft);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		max-width: 480px;
		width: 100%;
		max-height: 85vh;
		overflow-y: auto;
		padding: 28px;
		box-shadow: var(--shadow-lg);
		animation: pop-in 0.4s var(--ease);
	}

	.modal:focus {
		outline: none;
	}

	.confetti-field {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
		border-radius: var(--radius-lg);
	}

	.confetti {
		position: absolute;
		top: -10px;
		width: 8px;
		height: 12px;
		border-radius: 2px;
		opacity: 0.9;
		animation: confetti-fall 2.6s ease-in forwards;
	}

	@keyframes confetti-fall {
		0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
		100% { transform: translateY(420px) rotate(340deg); opacity: 0; }
	}

	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 6px;
	}

	.header h3 {
		font-size: 1.6rem;
	}

	.close {
		width: 32px;
		height: 32px;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--surface);
		color: var(--text-dim);
	}

	.sub {
		color: var(--text-dim);
		font-size: 0.88rem;
		margin-bottom: 22px;
	}

	.stubs {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-bottom: 20px;
	}

	.stub {
		display: grid;
		grid-template-columns: 1fr auto auto;
		align-items: center;
		background: var(--paper);
		color: var(--paper-ink);
		border-radius: var(--radius-md);
		overflow: hidden;
		opacity: 0;
		animation: ticket-flip 0.6s var(--ease) forwards;
		transform-origin: top center;
		box-shadow: var(--shadow-paper);
	}

	.stub-main {
		padding: 16px 18px;
	}

	.stub-tag {
		display: inline-block;
		font-size: 0.66rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		background: var(--paper-ink);
		color: var(--lime);
		padding: 4px 9px;
		border-radius: 999px;
		margin-bottom: 8px;
	}

	.stub-main h4 {
		font-size: 1rem;
		margin-bottom: 8px;
		color: var(--paper-ink);
	}

	.stub-meta {
		display: flex;
		gap: 12px;
		font-size: 0.74rem;
		color: var(--paper-ink-dim);
		margin-bottom: 8px;
		flex-wrap: wrap;
	}

	.stub-qty {
		font-size: 0.76rem;
		color: var(--paper-ink);
		font-weight: 700;
	}

	.stub-divider {
		position: relative;
		align-self: stretch;
		width: 0;
		border-left: 2px dashed var(--paper-border);
	}

	.notch {
		position: absolute;
		width: 14px;
		height: 14px;
		background: var(--bg-soft);
		border-radius: 999px;
		left: -8px;
	}

	.notch.top {
		top: -7px;
	}

	.notch.bottom {
		bottom: -7px;
	}

	.stub-code {
		padding: 14px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		min-width: 90px;
	}

	.qr {
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		width: 48px;
		height: 48px;
		background: white;
		border-radius: 4px;
		padding: 3px;
		gap: 1px;
	}

	.qr span {
		background: transparent;
	}

	.qr span.filled {
		background: var(--paper-ink);
	}

	.code {
		font-size: 0.64rem;
		color: var(--paper-ink-dim);
		letter-spacing: 0.03em;
		font-family: monospace;
	}

	.total-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 14px 0;
		border-top: 1px solid var(--border);
		margin-bottom: 18px;
		font-size: 0.9rem;
		color: var(--text-dim);
	}

	.total-row strong {
		font-size: 1.5rem;
		color: var(--lime);
	}

	.done {
		width: 100%;
	}

	@media (max-width: 480px) {
		.stub {
			grid-template-columns: 1fr;
		}

		.stub-divider {
			display: none;
		}

		.stub-code {
			flex-direction: row;
			justify-content: flex-start;
			padding-top: 0;
		}
	}
</style>
