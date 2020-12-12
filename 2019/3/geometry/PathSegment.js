const Point = require('./Point');
class PathSegment {
	constructor(startPoint, endPoint){
		this.start = startPoint;
		this.end = endPoint;
		this.x1 = startPoint.x;
		this.x2 = endPoint.x;
		this.y1 = startPoint.y;
		this.y2 = endPoint.y;
		this.a = this.y2 - this.y1;
        this.b = this.x1 - this.x2;
        this.c = (this.a * this.x1) + (this.b * this.y1);
	}
	getPoints(){
		return { start : this.start.toCart(), end : this.end.toCart() };
	} 
	containsPoint({x, y}){
		const {x1, x2, y1, y2} = this;
		return (Math.min(x1,x2) <= x) && ( x <= Math.max(x1,x2)) && (Math.min(y1,y2) <= y) && (y <= Math.max(y1,y2));
	}
	getPointOfIntersection(crossingSegment){
		const {a:a1, b:b1, c:c1} = this;
		const {a:a2, b:b2, c:c2} = crossingSegment;

		const det = a1*b2 - a2*b1;
		if( det !== 0 ){
			const intersectX = (b2*c1 - b1*c2) / det;
			const intersectY = (a1*c2 - a2*c1) / det;

			const crossingPoint = new Point(intersectX, intersectY);
			if( this.containsPoint(crossingPoint) && crossingSegment.containsPoint(crossingPoint) && !crossingPoint.isCenter()){
				return crossingPoint;
			}
		}
		return false;
	}
	getLength(){
		const {x1,x2,y1,y2} = this;
		return Math.abs(x2-x1)+Math.abs(y2-y1);
	}
}
module.exports = PathSegment;