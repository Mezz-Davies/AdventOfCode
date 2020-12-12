const Point = require('./Point');
const getManhattanDistanceBetweenPoints = (point1, point2) => {
	return Math.abs(point2.x - point1.x) + (point2.y - point1.y);
}
const getManhattanDistanceToCentre = (point) => {
	const centre = new Point(0,0);
	return getManhattanDistanceBetweenPoints(centre, point);
}
module.exports = {
	getManhattanDistanceBetweenPoints,
	getManhattanDistanceToCentre
}