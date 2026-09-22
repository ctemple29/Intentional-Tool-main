// The operations the calculator can perform.
export const OPERATIONS = ['add', 'subtract', 'multiply', 'divide'];
// Calculates result based on operation, decides how the operation slected functions.
export function calculate(first, second, operation) {
	const raw = {
		add: first + second,
		subtract: first - second,
		multiply: first * second,
		divide: second === 0 ? null : first / second
	}[operation];

	if (raw === null) return { value: null, rounded: false, error: 'Cannot divide by zero' };
	const value = Math.round((raw + Number.EPSILON) * 1000) / 1000;
	return { value, rounded: Math.abs(raw - value) > Number.EPSILON, error: null };
}
// Dictates how the result should be rounded for display.
export function formatResult(value, wasRounded) {
	if (value === null) return 'ERR';
	const fixed = value.toFixed(3);
	if (!wasRounded) return fixed;
	return `${fixed.slice(0, -1)}<strong>${fixed.slice(-1)}</strong>`;
}
