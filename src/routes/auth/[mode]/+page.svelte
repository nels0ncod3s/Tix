<script>
	import { enhance } from '$app/forms';
	let { data, form } = $props();
	let busy = $state(false);
	const signup = $derived(data.mode === 'signup');
</script>

<svelte:head
	><title>{signup ? 'Create a host account' : 'Host sign-in'} — Tix</title
	></svelte:head
>
<section class="section container">
	<div class="auth-card card">
		<span class="badge">Tix hosts</span>
		<h1 class="display">
			{signup ? 'Host your next event.' : 'Welcome back.'}
		</h1>
		<p>
			{signup
				? 'Create an account to save drafts, publish events, and manage your tickets.'
				: 'Sign in to manage your events.'}
		</p>
		{#if data.confirmationFailed}<p class="notice" role="alert">
				That confirmation link could not be used. Try signing in, or request a
				new confirmation from support.
			</p>{/if}
		{#if form?.error}<p class="notice" role="alert">{form.error}</p>{/if}
		{#if form?.message}<p class="notice" role="status">{form.message}</p>{/if}
		{#if !data.configured}<p class="notice" role="status">
				Host accounts are temporarily unavailable. Please try again later.
			</p>{/if}
		<form
			method="POST"
			use:enhance={() => {
				busy = true;
				return async ({ update }) => {
					try {
						await update();
					} finally {
						busy = false;
					}
				};
			}}
		>
			{#if signup}<label
					>Name or organisation<input
						name="name"
						autocomplete="organization"
						required
						maxlength="100"
					/></label
				>{/if}
			<label
				>Email address<input
					type="email"
					name="email"
					autocomplete="email"
					required
					value={form?.email ?? ''}
				/></label
			>
			<label
				>Password<input
					type="password"
					name="password"
					autocomplete={signup ? 'new-password' : 'current-password'}
					minlength="8"
					maxlength="128"
					required
				/></label
			>
			<button class="btn btn-primary" disabled={busy || !data.configured}
				>{busy
					? 'Please wait…'
					: signup
						? 'Create host account'
						: 'Sign in'}</button
			>
		</form>
		<p>
			{signup ? 'Already have an account?' : 'New to hosting?'}
			<a class="lime-text" href={signup ? '/auth/login' : '/auth/signup'}
				>{signup ? 'Sign in' : 'Create an account'}</a
			>
		</p>
	</div>
</section>

<style>
	.auth-card {
		max-width: 480px;
		margin: 0 auto;
		padding: 32px;
		display: grid;
		gap: 20px;
	}
	h1 {
		font-size: 2.6rem;
	}
	p {
		color: var(--text-dim);
	}
	form,
	label {
		display: grid;
		gap: 10px;
	}
	form {
		gap: 20px;
	}
	input {
		width: 100%;
		padding: 13px;
		border: 1px solid var(--border);
		border-radius: 10px;
		background: var(--bg);
		color: var(--text);
		font: inherit;
	}
	.notice {
		padding: 14px;
		border: 1px solid var(--coral);
		border-radius: 10px;
	}
	a:focus-visible,
	input:focus-visible,
	button:focus-visible {
		outline: 2px solid var(--lime);
		outline-offset: 3px;
	}
</style>
