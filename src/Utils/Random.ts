function sign(value: number): number {
	return value * (Math.random() > 0.5 ? 1 : -1);
}
function curve(factor: number): number {
	return Math.pow(Math.random(), factor);
}
const Random = {
	sign,
	curve,
};
export default Random;
