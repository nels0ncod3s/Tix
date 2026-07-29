export function spotlight(node) {
	if (typeof matchMedia !== 'undefined' && !matchMedia('(pointer: fine)').matches) {
		return {};
	}

	function onMove(e) {
		const rect = node.getBoundingClientRect();
		const x = ((e.clientX - rect.left) / rect.width) * 100;
		const y = ((e.clientY - rect.top) / rect.height) * 100;
		node.style.setProperty('--mx', `${x}%`);
		node.style.setProperty('--my', `${y}%`);
	}

	node.addEventListener('pointermove', onMove);

	return {
		destroy() {
			node.removeEventListener('pointermove', onMove);
		}
	};
}
