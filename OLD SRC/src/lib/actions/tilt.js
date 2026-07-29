export function tilt(node, options = {}) {
	const { max = 7, lift = 8 } = options;

	if (typeof matchMedia !== 'undefined' && !matchMedia('(pointer: fine)').matches) {
		return {};
	}

	function onMove(e) {
		const rect = node.getBoundingClientRect();
		const px = (e.clientX - rect.left) / rect.width;
		const py = (e.clientY - rect.top) / rect.height;
		const rx = (0.5 - py) * max * 2;
		const ry = (px - 0.5) * max * 2;
		node.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-${lift}px)`;
	}

	function onLeave() {
		node.style.transform = '';
	}

	node.addEventListener('pointermove', onMove);
	node.addEventListener('pointerleave', onLeave);

	return {
		destroy() {
			node.removeEventListener('pointermove', onMove);
			node.removeEventListener('pointerleave', onLeave);
		}
	};
}
