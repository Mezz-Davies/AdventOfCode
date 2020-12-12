class Point {
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	isCenter = () => this.x === 0 && this.y === 0;
	isPoint = () => true;
	toCart(){ 
		const {x,y} = this;
		return {x, y}
	}
}
module.exports = Point;