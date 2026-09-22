// Sets how the wheel input should behave and be interacted with.
export function createWheelInput(element, onChange, getStep) {
	let active = false;
	let previousAngle = 0;
	let accumulated = 0;
	let startedAt = 0;
	let pointerId = null;

	const angleAt = (event) => {
		const bounds = element.getBoundingClientRect();
		return Math.atan2(event.clientY - (bounds.top + bounds.height / 2), event.clientX - (bounds.left + bounds.width / 2));
	};
	const move = (event) => {
		if (!active) return;
		const angle = angleAt(event);
		let delta = angle - previousAngle;
		if (delta > Math.PI) delta -= Math.PI * 2;
		if (delta < -Math.PI) delta += Math.PI * 2;
		previousAngle = angle;
		accumulated += delta;
		const threshold = Math.PI / 8;
		const turns = Math.trunc(accumulated / threshold);
		if (turns) { accumulated -= turns * threshold; onChange(turns * getStep(Date.now() - startedAt)); }
		element.style.setProperty('--wheel-angle', `${(angle * 180) / Math.PI + 90}deg`);
	};
	const stop = () => { active = false; if (pointerId !== null) element.releasePointerCapture?.(pointerId); pointerId = null; element.classList.remove('is-turning'); };
	// Event listeners for pointer events.
    element.addEventListener('pointerdown', (event) => { active = true; startedAt = Date.now(); pointerId = event.pointerId; previousAngle = angleAt(event); accumulated = 0; element.setPointerCapture?.(event.pointerId); element.classList.add('is-turning'); });
	element.addEventListener('pointermove', move);
	element.addEventListener('pointerup', stop);
	element.addEventListener('pointercancel', stop);
}

