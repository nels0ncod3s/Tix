export function reveal(node, options = {}) {
	const { delay = 0 } = options;

	if (typeof IntersectionObserver === 'undefined') {
		node.classList.add('in-view');
		return {};
	}

	node.style.transitionDelay = `${delay}ms`;

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('in-view');
					observer.unobserve(node);
				}
			}
		},
		{ threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
