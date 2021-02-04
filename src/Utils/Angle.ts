function degreesToRadians(degrees: number) {
	return degrees * (Math.PI / 180);
}
function radiansToDegrees(radians: number) {
	return radians * (180 / Math.PI);
}
function fragmentToRadians(fragment: number) {
	return fragment * Math.PI * 2;
}

const Angle = {
	degreesToRadians,
	radiansToDegrees,
	fragmentToRadians,
};
export default Angle;
