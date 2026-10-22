import { saveEvent } from '$lib/server/save-event.js';
export const load = () => ({ event: null });
export const actions = { save: saveEvent };
