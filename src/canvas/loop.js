export function drawMachine(context, width, height) {
	context.clearRect(0, 0, width, height);
	context.strokeStyle = 'rgba(45, 44, 40, .12)';
	context.lineWidth = 1;
	for (let y = 18; y < height; y += 24) {
		context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke();
	}
	context.strokeStyle = 'rgba(45, 44, 40, .18)';
	context.strokeRect(18, 18, width - 36, height - 36);
}
