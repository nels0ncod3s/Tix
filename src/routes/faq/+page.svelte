<script>
	import { fly } from 'svelte/transition';
	import { reveal } from '$lib/actions/reveal.js';

	const groups = [
		{
			title: 'Buying tickets',
			items: [
				{
					q: 'How do I get my ticket after I pay?',
					a: 'Your ticket lands in your inbox and your Tix account instantly after payment, with a QR code for entry. No printing needed — just show the code on your phone at the gate.'
				},
				{
					q: 'Can I transfer my ticket to someone else?',
					a: 'Yes. Open the ticket in your account and tap "Transfer" to send it to another email address. The original ticket is deactivated once the transfer is accepted.'
				},
				{
					q: 'What if an event is sold out?',
					a: 'You can join the waitlist on the event page. We\'ll notify you the moment more tickets are released or someone frees one up through a transfer.'
				}
			]
		},
		{
			title: 'Payments & refunds',
			items: [
				{
					q: 'What payment methods do you accept?',
					a: 'Card, bank transfer, and USSD through Paystack and Flutterwave. All prices are shown in naira with no hidden charges added at checkout.'
				},
				{
					q: "What's your refund policy?",
					a: 'Refund eligibility is set by each event host and shown on the event page before you buy. If an event is cancelled outright, you\'re refunded automatically to your original payment method.'
				},
				{
					q: 'My payment failed but I was charged — what now?',
					a: 'This usually reverses automatically within 24 hours. If it doesn\'t, reach out through Contact Us with your transaction reference and we\'ll sort it out.'
				}
			]
		},
		{
			title: 'Hosting events',
			items: [
				{
					q: 'How do I list my event on Tix?',
					a: 'Tap "List an event" from the navigation bar, fill in your event details and ticket tiers, and you can be live in minutes. Check our Pricing page for fees.'
				},
				{
					q: 'When do I get paid?',
					a: 'Payouts go to your linked bank account automatically after your event, minus our fee. See the Pricing page for exactly how that fee is calculated.'
				},
				{
					q: 'Can I run multiple ticket tiers for one event?',
					a: 'Yes — Regular, VIP, table service, whatever fits your event. You can add, edit, or pause tiers at any time before the event starts.'
				}
			]
		}
	];
</script>

<svelte:head>
	<title>FAQs — Tix</title>
</svelte:head>

<section class="faq-hero">
	<div class="container">
		<span class="eyebrow" in:fly={{ y: 18, duration: 600 }}>We got you</span>
		<h1 class="display" in:fly={{ y: 26, duration: 700, delay: 80 }}>
			Questions?<br /><span class="lime-text">Answers.</span>
		</h1>
		<p class="lead" in:fly={{ y: 22, duration: 700, delay: 200 }}>
			Can't find what you're looking for? Reach out and we'll sort you out.
		</p>
	</div>
</section>

<section class="section">
	<div class="container faq-container">
		{#each groups as group, gi (group.title)}
			<div class="faq-group reveal" use:reveal={{ delay: gi * 80 }}>
				<h2 class="display">{group.title}</h2>
				<div class="faq-list">
					{#each group.items as item (item.q)}
						<details class="faq-item">
							<summary>
								{item.q}
								<span class="chevron" aria-hidden="true">+</span>
							</summary>
							<p>{item.a}</p>
						</details>
					{/each}
				</div>
			</div>
		{/each}

		<div class="faq-contact reveal" use:reveal>
			<p>
				Still have more questions?
				<a href="mailto:hello@tix.ng" class="lime-text">Reach out to us →</a>
			</p>
		</div>
	</div>
</section>

<style>
	.faq-hero {
		padding: 100px 0 50px;
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

	.faq-hero h1 {
		font-size: clamp(2.6rem, 6vw, 4.2rem);
		margin-bottom: 18px;
	}

	.lead {
		font-size: 1.05rem;
		color: var(--text-dim);
	}

	.faq-container {
		max-width: 780px;
	}

	.faq-contact {
		text-align: center;
		padding: 36px 24px;
		border: 1px dashed var(--border);
		border-radius: var(--radius-lg);
	}

	.faq-contact p {
		font-size: 1rem;
		color: var(--text-dim);
	}

	.faq-contact a {
		font-weight: 700;
		margin-left: 4px;
	}

	.faq-group {
		margin-bottom: 48px;
	}

	.faq-group h2 {
		font-size: 1.3rem;
		text-transform: uppercase;
		color: var(--coral);
		margin-bottom: 20px;
	}

	.faq-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.faq-item {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		padding: 6px 22px;
		transition: border-color 0.25s var(--ease);
	}

	.faq-item[open] {
		border-color: var(--lime);
	}

	.faq-item summary {
		list-style: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 16px 0;
		cursor: pointer;
		font-weight: 600;
		font-size: 0.96rem;
	}

	.faq-item summary::-webkit-details-marker {
		display: none;
	}

	.chevron {
		flex-shrink: 0;
		width: 26px;
		height: 26px;
		border-radius: 50%;
		background: var(--surface-hover);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.1rem;
		color: var(--lime);
		transition: transform 0.3s var(--ease);
	}

	.faq-item[open] .chevron {
		transform: rotate(45deg);
	}

	.faq-item p {
		color: var(--text-dim);
		font-size: 0.9rem;
		padding-bottom: 20px;
		max-width: 620px;
	}
</style>
