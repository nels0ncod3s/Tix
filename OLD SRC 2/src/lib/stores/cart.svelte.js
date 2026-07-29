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
		const existing = items.find((i) => i.eventId === item.eventId && i.tierId === item.tierId);
		if (existing) {
			existing.qty += item.qty;
		} else {
			items.push({ ...item });
		}
	},
	updateQty(eventId, tierId, qty) {
		const item = items.find((i) => i.eventId === eventId && i.tierId === tierId);
		if (!item) return;
		if (qty <= 0) {
			this.remove(eventId, tierId);
			return;
		}
		item.qty = qty;
	},
	remove(eventId, tierId) {
		items = items.filter((i) => !(i.eventId === eventId && i.tierId === tierId));
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
