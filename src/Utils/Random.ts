function sign(value: number): number {
	return value * (Math.random() > 0.5 ? 1 : -1);
}
function curve(factor: number): number {
	return Math.pow(Math.random(), factor);
}
function between(min: number, max: number): number {
	return Math.random() * (max - min) + min;
}
const Random = {
	sign,
	curve,
	between,
};
export default Random;
