<script>
	import EventEditor from '$lib/components/EventEditor.svelte';
	let { data, form } = $props();
</script>

<svelte:head><title>Edit event — Tix Host Dashboard</title></svelte:head>
{#key data.event.id}<EventEditor
		event={data.event}
		{form}
		saved={data.saved}
	/>{/key}
