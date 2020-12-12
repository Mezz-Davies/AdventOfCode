const Point = require('./Point');
const PathSegment = require('./PathSegment');
class Path {
	constructor(){
		this.points = [new Point(0,0)];
		this.segments = [];
	}
	getLastPoint = () => this.points[this.points.length - 1];
	addPoint = (pointToAdd) => {
		if( pointToAdd.isPoint() ){
			this.segments.push( new PathSegment( this.getLastPoint(), pointToAdd) );
			this.points.push(pointToAdd);
		}
	}
	toString(){
		return this.points.map(point=>{
			const {x,y} = point.toCart();
			return `(${x},${y}}`;
		}).join('->');
	}
	executeCommand = (command) => {
		const direction = command.substring(0,1);
		const value = parseInt(command.substring(1),10);
		const {x : lastX, y: lastY} = this.getLastPoint();
		const nextPoint = new Point(lastX, lastY);
		switch(direction){
			case 'U':
				nextPoint.y += value;
				break;
			case 'D':
				nextPoint.y -= value;
				break;
			case 'R':
				nextPoint.x += value;
				break;
			case 'L':
				nextPoint.x -= value;
				break;
			default:
				console.error(`Unknown direction : ${direction}`);
		}
		this.addPoint(nextPoint);
	}
	getIntersectingPoints = (comparisonPath) => {
		const intersections = [];
		for( const segment1 of this.segments){
			for( const segment2 of comparisonPath.segments ){
				const crossingPoint = segment1.getPointOfIntersection(segment2);
				if(crossingPoint){
					intersections.push(crossingPoint);
				}
			}
		}
		return intersections;
	}
	getStepsToPoint = (point) => {
		console.log(point.toCart());
		return this.segments.reduce(([totalSteps, hasPassed], segment)=>{
			if( !hasPassed ){
				if( segment.containsPoint(point) ){
					const tmpSegment = new PathSegment(segment.start, point);
					return [true, totalSteps + tmpSegment.getLength()]
				} else {
					return [hasPassed, totalSteps + segment.getLength()];
				}
			}
			return [hasPassed, totalSteps];
		},[false, 0]).pop();
	}
}
module.exports = Path;