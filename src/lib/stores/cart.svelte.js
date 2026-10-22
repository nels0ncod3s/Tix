import { isEventOnSale } from '../utils/event-sales.js';
let items = $state([]);
let isOpen = $state(false);

export const cart = {
	get items() {
		return items;
	},
	get count() {
		return items.reduce((n, i) => n + i.qty, 0);
	},
	get total() {
		return items.reduce((sum, i) => sum + i.qty * i.price, 0);
	},
	get isOpen() {
		return isOpen;
	},
	add(item) {
		if (
			!isEventOnSale({ date: item.eventDate, status: item.status }) ||
			!Number.isSafeInteger(item.qty) ||
			item.qty < 1 ||
			!Number.isSafeInteger(item.available) ||
			item.available < 1
		)
			return false;
		const existing = items.find(
			(i) => i.eventId === item.eventId && i.tierId === item.tierId
		);
		if (existing) {
			if (existing.qty + item.qty > item.available) return false;
			existing.qty += item.qty;
			existing.available = item.available;
		} else {
			if (item.qty > item.available) return false;
			items.push({ ...item });
		}
		return true;
	},
	updateQty(eventId, tierId, qty) {
		const item = items.find(
			(i) => i.eventId === eventId && i.tierId === tierId
		);
		if (!item) return;
		if (qty <= 0) {
			this.remove(eventId, tierId);
			return;
		}
		if (
			!Number.isSafeInteger(qty) ||
			qty > item.available ||
			!isEventOnSale({ date: item.eventDate, status: item.status })
		)
			return;
		item.qty = qty;
	},
	remove(eventId, tierId) {
		items = items.filter(
			(i) => !(i.eventId === eventId && i.tierId === tierId)
		);
	},
	clear() {
		items = [];
	},
	open() {
		isOpen = true;
	},
	close() {
		isOpen = false;
	},
	toggle() {
		isOpen = !isOpen;
	}
};
