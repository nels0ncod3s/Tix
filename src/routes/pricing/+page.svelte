<script>
	import { fly } from 'svelte/transition';
	import { reveal } from '$lib/actions/reveal.js';

	const paths = [
		{
			name: 'Free events',
			price: 'Free',
			sub: 'forever, no catches',
			blurb: 'Community meetups, open mics, free listens — if there’s no ticket price, there’s no fee.',
			perks: [
				'Unlimited free event listings',
				'QR code check-in app',
				'Guest list export',
				'Email support'
			],
			featured: false
		},
		{
			name: 'Paid events',
			price: '3.5%',
			sub: '+ ₦100 per ticket sold',
			blurb: 'No setup cost, no monthly bill. You only ever pay when a ticket actually sells.',
			perks: [
				'Everything in Free events',
				'Instant payouts to your bank',
				'Regular, VIP & table-service tiers',
				'Sales analytics dashboard',
				'Priority support'
			],
			featured: true
		}
	];
</script>

<svelte:head>
	<title>Pricing — Tix</title>
</svelte:head>

<section class="pricing-hero">
	<div class="container">
		<span class="eyebrow" in:fly={{ y: 18, duration: 600 }}>Simple, transparent pricing</span>
		<h1 class="display" in:fly={{ y: 26, duration: 700, delay: 80 }}>
			Sell tickets.<br /><span class="lime-text">Keep more of it.</span>
		</h1>
		<p class="lead" in:fly={{ y: 22, duration: 700, delay: 200 }}>
			We're not a subscription. List for free, and only pay a small fee on tickets you
			actually sell. Attendees always pay the exact price you set — our cut comes out of
			your payout, never added at checkout.
		</p>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="plans">
			{#each paths as plan, i (plan.name)}
				<div class="plan reveal" class:featured={plan.featured} use:reveal={{ delay: i * 100 }}>
					{#if plan.featured}<span class="plan-badge">Most common</span>{/if}
					<h3>{plan.name}</h3>
					<div class="plan-price">
						<span class="display">{plan.price}</span>
						<span class="plan-sub">{plan.sub}</span>
					</div>
					<p class="plan-blurb">{plan.blurb}</p>
					<ul class="plan-perks">
						{#each plan.perks as perk (perk)}
							<li>✓ {perk}</li>
						{/each}
					</ul>
					<a href="/#sell" class="btn {plan.featured ? 'btn-primary' : 'btn-ghost'} plan-cta">
						List an event
					</a>
				</div>
			{/each}
		</div>

		<div class="example reveal" use:reveal>
			<span class="example-label">For example</span>
			<div class="example-row">
				<div class="example-step">
					<span class="example-figure display">₦10,000</span>
					<span>ticket price you set</span>
				</div>
				<span class="example-op">−</span>
				<div class="example-step">
					<span class="example-figure display">₦450</span>
					<span>our fee (3.5% + ₦100)</span>
				</div>
				<span class="example-op">=</span>
				<div class="example-step highlight">
					<span class="example-figure display">₦9,550</span>
					<span>you receive per ticket</span>
				</div>
			</div>
		</div>

		<p class="fine-print reveal" use:reveal>
			Running a festival, conference, or multi-day event? <a href="mailto:hello@tix.ng" class="lime-text">Reach out</a>
			for volume pricing. Payments are processed via Paystack and Flutterwave. More questions? Check our
			<a href="/faq" class="lime-text">FAQs</a>.
		</p>
	</div>
</section>

<style>
	.pricing-hero {
		padding: 100px 0 60px;
		text-align: center;
	}

	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 7px 14px;
		border-radius: 999px;
		background: var(--surface);
		border: 1px solid var(--border);
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-dim);
		margin-bottom: 24px;
	}

	.pricing-hero h1 {
		font-size: clamp(2.6rem, 6vw, 4.4rem);
		margin-bottom: 20px;
	}

	.lead {
		font-size: 1.05rem;
		color: var(--text-dim);
		max-width: 600px;
		margin: 0 auto;
	}

	.plans {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 24px;
		align-items: stretch;
		max-width: 880px;
		margin: 0 auto;
	}

	.plan {
		position: relative;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 36px 34px;
		display: flex;
		flex-direction: column;
		transition: border-color 0.3s var(--ease), transform 0.3s var(--ease);
	}

	.plan:hover {
		transform: translateY(-4px);
	}

	.plan.featured {
		border-color: var(--lime);
		background: linear-gradient(180deg, rgba(215, 255, 63, 0.06), var(--surface));
	}

	.plan-badge {
		position: absolute;
		top: -13px;
		left: 30px;
		background: var(--lime);
		color: var(--ink);
		font-size: 0.7rem;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		padding: 5px 12px;
		border-radius: 999px;
	}

	.plan h3 {
		font-size: 1.1rem;
		margin-bottom: 16px;
	}

	.plan-price {
		display: flex;
		align-items: baseline;
		gap: 8px;
		margin-bottom: 18px;
		padding-bottom: 20px;
		border-bottom: 1px solid var(--border);
	}

	.plan-price .display {
		font-size: 2.6rem;
		color: var(--lime);
	}

	.plan-sub {
		font-size: 0.85rem;
		color: var(--text-dimmer);
	}

	.plan-blurb {
		color: var(--text-dim);
		font-size: 0.92rem;
		margin-bottom: 22px;
	}

	.plan-perks {
		list-style: none;
		margin: 0 0 28px;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 10px;
		flex: 1;
	}

	.plan-perks li {
		font-size: 0.88rem;
		color: var(--text-dim);
	}

	.plan-cta {
		width: 100%;
	}

	.example {
		margin-top: 48px;
		max-width: 880px;
		margin-left: auto;
		margin-right: auto;
		padding: 32px;
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		background: var(--surface);
	}

	.example-label {
		display: block;
		text-align: center;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--coral);
		margin-bottom: 20px;
	}

	.example-row {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 20px;
		flex-wrap: wrap;
	}

	.example-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		text-align: center;
		padding: 16px 20px;
		border-radius: var(--radius-md);
	}

	.example-step.highlight {
		background: rgba(215, 255, 63, 0.08);
		border: 1px solid rgba(215, 255, 63, 0.3);
	}

	.example-figure {
		font-size: 1.6rem;
	}

	.example-step span:last-child {
		font-size: 0.8rem;
		color: var(--text-dimmer);
	}

	.example-op {
		font-size: 1.4rem;
		color: var(--text-dimmer);
		font-weight: 700;
	}

	.fine-print {
		text-align: center;
		color: var(--text-dimmer);
		font-size: 0.82rem;
		margin-top: 32px;
	}

	@media (max-width: 720px) {
		.plans {
			grid-template-columns: 1fr;
		}
	}
</style>
