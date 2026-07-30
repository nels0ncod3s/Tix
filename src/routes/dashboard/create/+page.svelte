<script>
	import { reveal } from '$lib/actions/reveal.js';
	import { categories } from '$lib/data/events.js';

	let title = $state('');
	let category = $state(categories[0].id);
	let date = $state('');
	let time = $state('');
	let venue = $state('');
	let city = $state('');
	let description = $state('');

	let tiers = $state([{ name: 'Regular', price: '', quantity: '' }]);

	let published = $state(false);
	let publishedAsDraft = $state(false);

	function addTier() {
		tiers.push({ name: '', price: '', quantity: '' });
	}

	function removeTier(index) {
		if (tiers.length <= 1) return;
		tiers = tiers.filter((_, i) => i !== index);
	}

	const isValid = $derived(
		title.trim() && date && venue.trim() && city.trim() && tiers.every((t) => t.name.trim() && t.price && t.quantity)
	);

	function saveDraft(e) {
		e.preventDefault();
		publishedAsDraft = true;
		published = false;
		setTimeout(() => (publishedAsDraft = false), 2400);
	}

	function publish(e) {
		e.preventDefault();
		if (!isValid) return;
		published = true;
	}

	function createAnother() {
		published = false;
		title = '';
		date = '';
		time = '';
		venue = '';
		city = '';
		description = '';
		tiers = [{ name: 'Regular', price: '', quantity: '' }];
	}
</script>

<svelte:head>
	<title>Create Event — Tix Host Dashboard</title>
</svelte:head>

{#if published}
	<div class="success reveal in-view">
		<span class="success-icon">🎉</span>
		<h1 class="display">You're live!</h1>
		<p>
			<strong>{title}</strong> is now published and visible to buyers. Ticket sales start immediately.
		</p>
		<div class="success-actions">
			<a href="/dashboard/events" class="btn btn-primary">View my events</a>
			<button type="button" class="btn btn-ghost" onclick={createAnother}>Create another</button>
		</div>
	</div>
{:else}
	<div class="page-head">
		<div>
			<span class="kicker">New event</span>
			<h1 class="display">Create an event</h1>
			<p>Fill in the details below — you can save a draft or publish right away.</p>
		</div>
	</div>

	<form class="form-grid">
		<div class="panel reveal" use:reveal>
			<h2>Event details</h2>

			<label class="field">
				<span>Event title</span>
				<input type="text" placeholder="e.g. Lagos Sunset Sessions" bind:value={title} />
			</label>

			<div class="field-row">
				<label class="field">
					<span>Category</span>
					<div class="select-wrap">
						<select bind:value={category}>
							{#each categories as cat (cat.id)}
								<option value={cat.id}>{cat.icon} {cat.label}</option>
							{/each}
						</select>
						<svg class="select-chevron" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
					</div>
				</label>

				<label class="field">
					<span>Date</span>
					<input type="date" bind:value={date} />
				</label>

				<label class="field">
					<span>Time</span>
					<input type="time" bind:value={time} />
				</label>
			</div>

			<div class="field-row">
				<label class="field">
					<span>Venue</span>
					<input type="text" placeholder="e.g. Eko Convention Centre" bind:value={venue} />
				</label>

				<label class="field">
					<span>City</span>
					<input type="text" placeholder="e.g. Lagos" bind:value={city} />
				</label>
			</div>

			<label class="field">
				<span>Description</span>
				<textarea rows="4" placeholder="Tell people what to expect..." bind:value={description}></textarea>
			</label>
		</div>

		<div class="panel reveal" use:reveal={{ delay: 80 }}>
			<div class="panel-head-row">
				<h2>Ticket tiers</h2>
				<button type="button" class="btn btn-ghost add-tier-btn" onclick={addTier}>+ Add tier</button>
			</div>

			<div class="tiers">
				{#each tiers as tier, i (i)}
					<div class="tier-row">
						<label class="field">
							<span>Tier name</span>
							<input type="text" placeholder="e.g. VIP" bind:value={tier.name} />
						</label>
						<label class="field">
							<span>Price (₦)</span>
							<input type="number" min="0" placeholder="15000" bind:value={tier.price} />
						</label>
						<label class="field">
							<span>Quantity</span>
							<input type="number" min="1" placeholder="200" bind:value={tier.quantity} />
						</label>
						<button
							type="button"
							class="remove-tier"
							onclick={() => removeTier(i)}
							disabled={tiers.length <= 1}
							aria-label="Remove tier"
						>
							✕
						</button>
					</div>
				{/each}
			</div>
		</div>

		<div class="form-actions">
			<button type="button" class="btn btn-ghost" onclick={saveDraft}>
				{publishedAsDraft ? '✓ Draft saved' : 'Save as draft'}
			</button>
			<button type="submit" class="btn btn-primary" onclick={publish} disabled={!isValid}>
				Publish event
			</button>
		</div>
	</form>
{/if}

<style>
	.page-head {
		margin-bottom: 24px;
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

	.form-grid {
		display: flex;
		flex-direction: column;
		gap: 20px;
		max-width: 780px;
	}

	.panel {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 28px;
	}

	.panel h2 {
		font-size: 1.05rem;
		margin-bottom: 20px;
	}

	.panel-head-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}

	.panel-head-row h2 {
		margin-bottom: 0;
	}

	.add-tier-btn {
		padding: 8px 14px;
		font-size: 0.8rem;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 18px;
		flex: 1;
		min-width: 0;
	}

	.field:last-child {
		margin-bottom: 0;
	}

	.field span {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-dim);
	}

	.field input,
	.field textarea,
	.select-wrap select {
		width: 100%;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 10px;
		padding: 12px 14px;
		color: var(--text);
		font-size: 0.92rem;
		font-family: inherit;
		transition: border-color 0.2s var(--ease);
	}

	.field input:focus,
	.field textarea:focus,
	.select-wrap select:focus {
		outline: none;
		border-color: var(--lime);
	}

	.field textarea {
		resize: vertical;
	}

	.select-wrap {
		position: relative;
	}

	.select-wrap select {
		appearance: none;
		padding-right: 38px;
	}

	.select-chevron {
		position: absolute;
		right: 14px;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-dimmer);
		pointer-events: none;
	}

	.field-row {
		display: flex;
		gap: 16px;
		flex-wrap: wrap;
	}

	.tiers {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.tier-row {
		display: flex;
		align-items: flex-end;
		gap: 12px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--border);
	}

	.tier-row:last-child {
		border-bottom: none;
		padding-bottom: 0;
	}

	.tier-row .field {
		margin-bottom: 0;
	}

	.remove-tier {
		flex-shrink: 0;
		width: 42px;
		height: 42px;
		border-radius: 10px;
		border: 1px solid var(--border);
		background: var(--bg);
		color: var(--text-dimmer);
		transition: color 0.2s var(--ease), border-color 0.2s var(--ease);
	}

	.remove-tier:hover:not(:disabled) {
		color: var(--coral);
		border-color: var(--coral);
	}

	.remove-tier:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
	}

	.success {
		max-width: 520px;
		margin: 60px auto 0;
		text-align: center;
		padding: 48px 32px;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
	}

	.success-icon {
		font-size: 3rem;
		display: block;
		margin-bottom: 16px;
	}

	.success h1 {
		font-size: 2rem;
		margin-bottom: 14px;
	}

	.success p {
		color: var(--text-dim);
		margin-bottom: 28px;
	}

	.success-actions {
		display: flex;
		gap: 12px;
		justify-content: center;
		flex-wrap: wrap;
	}

	@media (max-width: 640px) {
		.field-row {
			flex-direction: column;
			gap: 0;
		}

		.tier-row {
			flex-wrap: wrap;
		}

		.tier-row .field {
			min-width: 120px;
		}

		.form-actions {
			flex-direction: column-reverse;
		}

		.form-actions .btn {
			width: 100%;
		}
	}
</style>
