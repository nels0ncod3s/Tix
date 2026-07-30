import { events } from './events.js';
import { formatNaira } from '$lib/utils/currency.js';

const meta = {
	'detty-december-live': { status: 'published', ticketsSold: 812, views: 14300 },
	'naija-comedy-jam': { status: 'published', ticketsSold: 265, views: 5200 },
	'lagos-tech-summit': { status: 'published', ticketsSold: 340, views: 9800 },
	'rhythm-colour-festival': { status: 'draft', ticketsSold: 0, views: 640 },
	'abuja-jazz-evenings': { status: 'published', ticketsSold: 58, views: 2100 }
};

export const hostEvents = Object.keys(meta)
	.map((id) => {
		const event = events.find((e) => e.id === id);
		if (!event) return null;
		const m = meta[id];
		const ticketsTotal = event.tiers.reduce((sum, t) => sum + t.available, 0) + m.ticketsSold;
		const revenue = m.ticketsSold * event.price;
		return { ...event, ...m, ticketsTotal, revenue };
	})
	.filter(Boolean);

export const summary = {
	revenue: hostEvents.reduce((sum, e) => sum + e.revenue, 0),
	ticketsSold: hostEvents.reduce((sum, e) => sum + e.ticketsSold, 0),
	published: hostEvents.filter((e) => e.status === 'published').length,
	views: hostEvents.reduce((sum, e) => sum + e.views, 0)
};

export const revenueTrend = [
	{ label: 'Mon', value: 180000 },
	{ label: 'Tue', value: 240000 },
	{ label: 'Wed', value: 210000 },
	{ label: 'Thu', value: 390000 },
	{ label: 'Fri', value: 620000 },
	{ label: 'Sat', value: 810000 },
	{ label: 'Sun', value: 540000 }
];

export const salesByCategory = [
	{ label: 'Music', value: 812 },
	{ label: 'Conference', value: 340 },
	{ label: 'Comedy', value: 265 },
	{ label: 'Music (jazz)', value: 58 }
];

export { formatNaira };
