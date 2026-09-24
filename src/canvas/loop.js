export function drawMachine(context, width, height) {
	context.clearRect(0, 0, width, height);
	context.strokeStyle = 'rgba(45, 44, 40, .18)';
	context.strokeRect(18, 18, width - 36, height - 36);
}
