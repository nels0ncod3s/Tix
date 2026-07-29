<script>
	import { fly, fade } from 'svelte/transition';
	import { cart } from '$lib/stores/cart.svelte.js';
	import { formatNaira } from '$lib/utils/currency.js';
	import TicketReveal from './TicketReveal.svelte';

	let checkingOut = $state(false);
	let completedOrder = $state(null);

	function checkout() {
		if (cart.items.length === 0) return;
		checkingOut = true;
		setTimeout(() => {
			completedOrder = {
				items: cart.items.map((i) => ({ ...i })),
				total: cart.total
			};
			cart.clear();
			checkingOut = false;
		}, 900);
	}

	function closeReveal() {
		completedOrder = null;
		cart.close();
	}

	function onKeydown(e) {
		if (e.key === 'Escape' && cart.isOpen) cart.close();
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if cart.isOpen}
	<div
		class="backdrop"
		transition:fade={{ duration: 250 }}
		role="button"
		tabindex="0"
		aria-label="Close cart"
		onclick={() => cart.close()}
		onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && cart.close()}
	></div>
	<aside class="drawer" transition:fly={{ x: 400, duration: 400, opacity: 1 }} aria-label="Shopping cart">
		<div class="drawer-head">
			<h3>Your Cart</h3>
			<button type="button" class="close" onclick={() => cart.close()} aria-label="Close cart">✕</button>
		</div>

		{#if cart.items.length === 0}
			<div class="empty">
				<span class="empty-icon">🎫</span>
				<p>Your cart is empty</p>
				<a href="/events" class="btn btn-ghost" onclick={() => cart.close()}>Browse events</a>
			</div>
		{:else}
			<div class="items">
				{#each cart.items as item (item.eventId + item.tierId)}
					<div class="item">
						<div class="item-info">
							<h4>{item.title}</h4>
							<span class="tier">{item.tierName}</span>
							<span class="unit">{formatNaira(item.price)} each</span>
						</div>
						<div class="item-controls">
							<div class="stepper">
								<button type="button" onclick={() => cart.updateQty(item.eventId, item.tierId, item.qty - 1)}>−</button>
								<span>{item.qty}</span>
								<button type="button" onclick={() => cart.updateQty(item.eventId, item.tierId, item.qty + 1)}>+</button>
							</div>
							<button type="button" class="remove" onclick={() => cart.remove(item.eventId, item.tierId)}>Remove</button>
						</div>
						<span class="line-total">{formatNaira(item.price * item.qty)}</span>
					</div>
				{/each}
			</div>

			<div class="summary">
				<div class="row">
					<span>Subtotal</span>
					<span>{formatNaira(cart.total)}</span>
				</div>
				<div class="row total">
					<span>Total</span>
					<span>{formatNaira(cart.total)}</span>
				</div>
				<button type="button" class="btn btn-primary checkout" onclick={checkout} disabled={checkingOut}>
					{#if checkingOut}
						<span class="spinner"></span> Processing...
					{:else}
						Checkout
					{/if}
				</button>
			</div>
		{/if}
	</aside>
{/if}

{#if completedOrder}
	<TicketReveal order={completedOrder} onclose={closeReveal} />
{/if}

<style>
	.backdrop {
		position: fixed;
		inset: 0;
		background: rgba(4, 4, 10, 0.6);
		backdrop-filter: blur(4px);
		z-index: 200;
	}

	.drawer {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		width: min(420px, 100vw);
		background: var(--bg-soft);
		border-left: 1px solid var(--border);
		z-index: 201;
		display: flex;
		flex-direction: column;
		box-shadow: -24px 0 60px -20px rgba(0, 0, 0, 0.6);
	}

	.drawer-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 22px 24px;
		border-bottom: 1px solid var(--border);
	}

	.drawer-head h3 {
		font-size: 1.15rem;
	}

	.close {
		width: 38px;
		height: 38px;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--surface);
		color: var(--text-dim);
		transition: background 0.25s var(--ease);
	}

	.close:hover {
		background: var(--surface-hover);
	}

	.empty {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 14px;
		color: var(--text-dim);
		padding: 40px;
	}

	.empty-icon {
		font-size: 2.4rem;
		opacity: 0.6;
	}

	.items {
		flex: 1;
		overflow-y: auto;
		padding: 16px 24px;
		display: flex;
		flex-direction: column;
		gap: 14px;
	}

	.item {
		position: relative;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 14px 16px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		animation: pop-in 0.3s var(--ease);
	}

	.item-info h4 {
		font-size: 0.95rem;
		margin-bottom: 4px;
	}

	.tier {
		font-size: 0.78rem;
		color: var(--coral);
		font-weight: 600;
		margin-right: 8px;
	}

	.unit {
		font-size: 0.78rem;
		color: var(--text-dimmer);
	}

	.item-controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.stepper {
		display: flex;
		align-items: center;
		gap: 6px;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 4px;
	}

	.stepper button {
		width: 34px;
		height: 34px;
		flex-shrink: 0;
		border-radius: 999px;
		border: none;
		background: var(--surface);
		color: var(--text);
		font-size: 1.1rem;
		line-height: 1;
		transition: background 0.2s var(--ease);
	}

	.stepper button:hover {
		background: var(--lime);
		color: var(--ink);
	}

	.stepper span {
		min-width: 16px;
		text-align: center;
		font-size: 0.85rem;
		font-weight: 600;
	}

	.remove {
		font-size: 0.78rem;
		color: var(--text-dimmer);
		border: none;
		background: none;
		transition: color 0.2s var(--ease);
	}

	.remove:hover {
		color: var(--coral);
	}

	.line-total {
		align-self: flex-end;
		font-weight: 700;
		color: var(--lime);
	}

	.summary {
		padding: 18px 24px 24px;
		border-top: 1px solid var(--border);
	}

	.row {
		display: flex;
		justify-content: space-between;
		font-size: 0.88rem;
		color: var(--text-dim);
		margin-bottom: 8px;
	}

	.row.total {
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--text);
		margin-bottom: 16px;
	}

	.checkout {
		width: 100%;
	}

	.spinner {
		width: 14px;
		height: 14px;
		border-radius: 999px;
		border: 2px solid rgba(10, 10, 11, 0.35);
		border-top-color: var(--ink);
		display: inline-block;
		animation: spin-slow 0.7s linear infinite;
	}
</style>
