import { setupCanvas } from './src/canvas/setupCanvas.js';
import { drawMachine } from './src/canvas/loop.js';
import { createWheelInput } from './src/imput/imput.js';
import { OPERATIONS, calculate, formatResult } from './src/utils/math.js';

const values = [0, 0];
let precisionMode = false;
let operationIndex = 0;
const labels = { add: 'ADD', subtract: 'SUBTRACT', multiply: 'MULTIPLY', divide: 'DIVIDE' };
const canvas = document.querySelector('#machineCanvas');
const { context, resize } = setupCanvas(canvas);
const updateCanvas = () => { const size = resize(); drawMachine(context, size.width, size.height); };
const status = document.querySelector('#statusText');
const displays = [document.querySelector('#numberOne'), document.querySelector('#numberTwo')];
const dial = document.querySelector('#operationDial');
const readout = document.querySelector('#operationReadout');
const modeLever = document.querySelector('#modeLever');
const result = document.querySelector('#resultDisplay');
const note = document.querySelector('#resultNote');
const calculateLever = document.querySelector('#calculateLever');

function renderValue(index) { displays[index].textContent = values[index].toFixed(3); }
function changeValue(index, amount) {
	values[index] = Math.max(-999999.999, Math.min(999999.999, Math.round((values[index] + amount) * 1000) / 1000));
	renderValue(index); status.textContent = precisionMode ? 'Precision gear engaged' : 'Ready for input';
}
function setOperation() {
	const operation = OPERATIONS[operationIndex];
	readout.textContent = labels[operation];
	dial.style.setProperty('--dial-angle', `${operationIndex * 90}deg`);
}
function printResult() {
	calculateLever.classList.add('is-pulled');
	window.setTimeout(() => calculateLever.classList.remove('is-pulled'), 350);
	const operation = OPERATIONS[operationIndex];
	const answer = calculate(values[0], values[1], operation);
	status.textContent = 'Printing result slip...';
	result.innerHTML = '...'; note.textContent = 'Calculating';
	window.setTimeout(() => {
		result.innerHTML = answer.error ? 'ERR' : formatResult(answer.value, answer.rounded);
		note.textContent = answer.error || (answer.rounded ? 'Rounded to the nearest thousandth' : 'Exact to the nearest thousandth');
		status.textContent = answer.error || 'Result printed';
	}, 2500);
}

document.querySelectorAll('.wheel').forEach((wheel) => {
	const index = Number(wheel.dataset.wheel);
	createWheelInput(wheel, (turns) => changeValue(index, turns), (duration) => {
		const base = precisionMode ? 0.001 : 0.01;
		if (duration > 10000) return 0.1;
		return duration > 3000 ? base * 5 : base;
	});
});
document.querySelectorAll('.reset-lever').forEach((button) => {
	button.addEventListener('pointerdown', () => button.classList.add('is-pulled'));
	button.addEventListener('pointerup', () => button.classList.remove('is-pulled'));
	button.addEventListener('pointercancel', () => button.classList.remove('is-pulled'));
	button.addEventListener('click', () => { const index = Number(button.dataset.reset); values[index] = 0; renderValue(index); status.textContent = `Reset ${index + 1}`; });
});
modeLever.addEventListener('click', () => { precisionMode = !precisionMode; modeLever.setAttribute('aria-pressed', String(precisionMode)); modeLever.querySelector('.mode-label').textContent = precisionMode ? 'Precision' : 'Normal'; status.textContent = precisionMode ? 'Precision gear engaged' : 'Normal gear engaged'; });
createWheelInput(dial, () => {}, () => 0, '--dial-angle', (rotation) => {
	operationIndex = Math.round(rotation / 90) % OPERATIONS.length;
	setOperation();
});
calculateLever.addEventListener('click', printResult);
window.addEventListener('resize', updateCanvas);
updateCanvas(); setOperation(); displays.forEach((_, index) => renderValue(index));
