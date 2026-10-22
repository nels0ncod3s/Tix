<script>
	import { enhance } from '$app/forms';
	import { untrack } from 'svelte';
	import { categories } from '$lib/data/events.js';
	let { event = null, form = null, saved = null } = $props();
	const seed = untrack(() => ({ event, values: form?.values }));
	const initial = seed.values;
	let title = $state(initial?.title ?? seed.event?.title ?? '');
	let category = $state(
		initial?.category ?? seed.event?.category ?? categories[0].id
	);
	let date = $state(initial?.event_date ?? seed.event?.date ?? '');
	let time = $state(initial?.event_time ?? seed.event?.time ?? '');
	let venue = $state(initial?.venue ?? seed.event?.venue ?? '');
	let city = $state(initial?.city ?? seed.event?.city ?? '');
	let description = $state(
		initial?.description ?? seed.event?.description ?? ''
	);
	let tagline = $state(initial?.tagline ?? seed.event?.tagline ?? '');
	let image = $state(
		initial?.image ??
			(seed.event?.image === '/event-placeholder.svg'
				? ''
				: seed.event?.image) ??
			''
	);
	let lineup = $state((initial?.lineup ?? seed.event?.lineup ?? []).join('\n'));
	let tiers = $state(
		(
			initial?.tiers ??
			seed.event?.tiers ?? [
				{ id: 'regular', name: 'Regular', price: '', available: '' }
			]
		).map((t) => ({ ...t, price: t.price ?? '', quantity: t.available ?? '' }))
	);
	let busy = $state(false);
	function addTier() {
		tiers.push({
			id: crypto.randomUUID(),
			name: '',
			price: '',
			quantity: '',
			perks: []
		});
	}
	function removeTier(id) {
		if (tiers.length > 1) tiers = tiers.filter((t) => t.id !== id);
	}
</script>

<div class="page-head">
	<span class="kicker">{event ? 'Manage event' : 'New event'}</span>
	<h1 class="display">{event ? 'Edit your event' : 'Create an event'}</h1>
	<p>Save your progress as a private draft, or publish when you’re ready.</p>
</div>
{#if form?.errors}<div class="editor-notice" role="alert">
		{#each form.errors as message}<p>{message}</p>{/each}
	</div>{/if}
{#if saved && !form?.errors}<div class="editor-notice" role="status">
		{saved === 'published'
			? 'Your event is published.'
			: 'Your draft is saved.'}
		{#if event?.status === 'published'}<a
				class="lime-text"
				href={`/events/${event.id}`}>View event →</a
			>{/if}
	</div>{/if}
<form
	class="form-grid"
	method="POST"
	action="?/save"
	use:enhance={() => {
		busy = true;
		return async ({ update }) => {
			try {
				await update({ reset: false });
			} finally {
				busy = false;
			}
		};
	}}
>
	<div class="panel">
		<h2>Event details</h2>
		<label class="field"
			><span>Event title</span><input
				name="title"
				bind:value={title}
				maxlength="160"
				required
				placeholder="e.g. Lagos Sunset Sessions"
			/></label
		>
		<label class="field"
			><span>Short description</span><input
				name="tagline"
				bind:value={tagline}
				maxlength="240"
				placeholder="One line to tell people what to expect"
			/></label
		>
		<div class="field-row">
			<label class="field"
				><span>Category</span>
				<div class="select-wrap">
					<select name="category" bind:value={category}
						>{#each categories as cat}<option value={cat.id}
								>{cat.icon} {cat.label}</option
							>{/each}</select
					>
				</div></label
			>
			<label class="field"
				><span>Date</span><input
					type="date"
					name="date"
					bind:value={date}
					required
				/></label
			>
			<label class="field"
				><span>Time (Lagos)</span><input
					type="time"
					name="time"
					bind:value={time}
					required
				/></label
			>
		</div>
		<div class="field-row">
			<label class="field"
				><span>Venue</span><input
					name="venue"
					bind:value={venue}
					maxlength="200"
					required
				/></label
			>
			<label class="field"
				><span>City</span><input
					name="city"
					bind:value={city}
					maxlength="100"
					required
				/></label
			>
		</div>
		<label class="field"
			><span>Description</span><textarea
				name="description"
				rows="5"
				bind:value={description}
				maxlength="10000"
				required></textarea></label
		>
		<label class="field"
			><span>Poster URL (optional, HTTPS)</span><input
				type="url"
				name="image"
				bind:value={image}
				maxlength="2000"
				placeholder="https://…"
			/></label
		>
		<label class="field"
			><span>Lineup (one name per line, optional)</span><textarea
				name="lineup"
				rows="3"
				bind:value={lineup}></textarea></label
		>
	</div>
	<div class="panel">
		<div class="panel-head-row">
			<h2>Ticket tiers</h2>
			<button
				type="button"
				class="btn btn-ghost add-tier-btn"
				onclick={addTier}
				disabled={tiers.length >= 20 || busy}>+ Add tier</button
			>
		</div>
		<div class="tiers">
			{#each tiers as tier (tier.id)}
				<div class="tier-row">
					<input type="hidden" name="tierId" value={tier.id} /><input
						type="hidden"
						name="tierPerks"
						value={JSON.stringify(tier.perks ?? [])}
					/>
					<label class="field"
						><span>Tier name</span><input
							name="tierName"
							bind:value={tier.name}
							maxlength="100"
							required
						/></label
					>
					<label class="field"
						><span>Price (₦)</span><input
							name="tierPrice"
							type="number"
							min="0"
							max="100000000"
							step="0.01"
							bind:value={tier.price}
							required
						/></label
					>
					<label class="field"
						><span>Quantity</span><input
							name="tierQuantity"
							type="number"
							min="1"
							max="1000000"
							step="1"
							bind:value={tier.quantity}
							required
						/></label
					>
					<button
						type="button"
						class="remove-tier"
						onclick={() => removeTier(tier.id)}
						disabled={tiers.length <= 1 || busy}
						aria-label={`Remove ${tier.name || 'ticket'} tier`}>✕</button
					>
				</div>
			{/each}
		</div>
	</div>
	<p>
		Ticket sales close at the end of the event date, in Lagos time. Use ₦0 for
		free tickets.
	</p>
	<div class="form-actions">
		<a class="btn btn-ghost" href="/dashboard/events">My events</a>
		<button
			class="btn btn-ghost"
			name="status"
			value="draft"
			formnovalidate
			disabled={busy}>{busy ? 'Saving…' : 'Save draft'}</button
		>
		<button
			class="btn btn-primary"
			name="status"
			value="published"
			disabled={busy}
			>{busy
				? 'Saving…'
				: event?.status === 'published'
					? 'Save & publish'
					: 'Publish event'}</button
		>
	</div>
</form>

<style>
	.editor-notice {
		max-width: 780px;
		padding: 16px;
		margin-bottom: 20px;
		border: 1px solid var(--lime);
		border-radius: 12px;
	}
	.form-grid > p {
		color: var(--text-dim);
		font-size: 0.85rem;
	}
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
		transition:
			color 0.2s var(--ease),
			border-color 0.2s var(--ease);
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
