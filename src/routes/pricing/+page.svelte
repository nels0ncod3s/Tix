<script>
	import { fly } from 'svelte/transition';
	import { reveal } from '$lib/actions/reveal.js';

	const plans = [
		{
			name: 'Starter',
			price: 'Free',
			sub: 'to list your event',
			fee: '5.5% + ₦100',
			feeNote: 'per ticket sold',
			blurb: 'For first-time hosts testing the waters.',
			perks: ['Unlimited event listings', 'Instant payouts to your bank', 'QR check-in app', 'Email support'],
			featured: false
		},
		{
			name: 'Growth',
			price: '₦15,000',
			sub: '/month',
			fee: '3.5% + ₦100',
			feeNote: 'per ticket sold',
			blurb: 'For hosts running events every month.',
			perks: [
				'Everything in Starter',
				'Lower per-ticket fee',
				'Custom event page branding',
				'Priority support',
				'Sales analytics dashboard'
			],
			featured: true
		},
		{
			name: 'Enterprise',
			price: 'Custom',
			sub: 'talk to us',
			fee: 'Custom rate',
			feeNote: 'volume-based',
			blurb: 'For venues, festivals, and high-volume promoters.',
			perks: [
				'Everything in Growth',
				'Dedicated account manager',
				'API access',
				'Multi-team permissions',
				'Custom contract & invoicing'
			],
			featured: false
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
			No setup fees, no monthly minimums on Starter. You only pay when you sell a ticket.
			Attendees never pay extra to browse or check out — our fee is already baked into the ticket price.
		</p>
	</div>
</section>

<section class="section">
	<div class="container">
		<div class="plans">
			{#each plans as plan, i (plan.name)}
				<div class="plan reveal" class:featured={plan.featured} use:reveal={{ delay: i * 100 }}>
					{#if plan.featured}<span class="plan-badge">Most popular</span>{/if}
					<h3>{plan.name}</h3>
					<div class="plan-price">
						<span class="display">{plan.price}</span>
						<span class="plan-sub">{plan.sub}</span>
					</div>
					<div class="plan-fee">
						<strong>{plan.fee}</strong>
						<span>{plan.feeNote}</span>
					</div>
					<p class="plan-blurb">{plan.blurb}</p>
					<ul class="plan-perks">
						{#each plan.perks as perk (perk)}
							<li>✓ {perk}</li>
						{/each}
					</ul>
					<a href="/#sell" class="btn {plan.featured ? 'btn-primary' : 'btn-ghost'} plan-cta">
						{plan.name === 'Enterprise' ? 'Talk to sales' : 'Start selling'}
					</a>
				</div>
			{/each}
		</div>

		<p class="fine-print reveal" use:reveal>
			Placeholder rates shown for illustration — final pricing to be confirmed.
			Payments processed via Paystack and Flutterwave. Have questions? Check our
			<a href="/faq" class="lime-text">FAQs</a> or reach out directly.
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
		max-width: 560px;
		margin: 0 auto;
	}

	.plans {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 24px;
		align-items: stretch;
	}

	.plan {
		position: relative;
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-lg);
		padding: 36px 30px;
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
		gap: 6px;
		margin-bottom: 6px;
	}

	.plan-price .display {
		font-size: 2.2rem;
	}

	.plan-sub {
		font-size: 0.82rem;
		color: var(--text-dimmer);
	}

	.plan-fee {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 10px 0 20px;
		margin-bottom: 20px;
		border-bottom: 1px solid var(--border);
	}

	.plan-fee strong {
		color: var(--lime);
		font-size: 1rem;
	}

	.plan-fee span {
		font-size: 0.76rem;
		color: var(--text-dimmer);
	}

	.plan-blurb {
		color: var(--text-dim);
		font-size: 0.88rem;
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
		font-size: 0.85rem;
		color: var(--text-dim);
	}

	.plan-cta {
		width: 100%;
	}

	.fine-print {
		text-align: center;
		color: var(--text-dimmer);
		font-size: 0.82rem;
		margin-top: 40px;
	}

	@media (max-width: 900px) {
		.plans {
			grid-template-columns: 1fr;
		}
	}
</style>
