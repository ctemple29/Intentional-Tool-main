// Various canvas elements and functions set up.
export function setupCanvas(canvas) {
	const context = canvas.getContext('2d');
	const resize = () => {
		const ratio = Math.max(1, window.devicePixelRatio || 1);
		const bounds = canvas.getBoundingClientRect();
		canvas.width = Math.round(bounds.width * ratio);
		canvas.height = Math.round(bounds.height * ratio);
		context.setTransform(ratio, 0, 0, ratio, 0, 0);
		return { width: bounds.width, height: bounds.height };
	};
	return { context, resize };
}
