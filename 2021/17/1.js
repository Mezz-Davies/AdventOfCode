const fs = require('fs');
const path = require('path');
const common = require('../../common/common');

class Point{
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.key = `(${x},${(y)})`;
	}
	isInRegion({minX, maxX, minY, maxY}){
		return this.x >= minX && this.x <= maxX && this.y >= minY && this.y <= maxY;
	}
	isPastRegion({maxX, minY}){
		return this.x > maxX || this.y < minY;
	}
}
class Vector{
	constructor(i, j){
		this.i = i < 0 ? 0 : i;
		this.j = j;
	}
	toString(){
		return `${this.i}i + ${this.j}j`;
	}
}


const [ exampleResult, exampleRuntime ] = readPrepareAndSolve('example_input.txt');
console.log(`Example : ${exampleResult} Runtime : ${exampleRuntime}ms`);

const [ solutionResult, solutionRuntime ] = readPrepareAndSolve('input.txt');
console.log(`Solution : ${solutionResult} Runtime : ${solutionRuntime}ms`);

function step(startPoint, velocityVector){
	const nextPoint = new Point(startPoint.x + velocityVector.i, startPoint.y + velocityVector.j);
	const nextVector = new Vector(velocityVector.i - 1, velocityVector.j - 1);
	return [nextPoint, nextVector];
}
function testVelocityVector(startingVector, targetRegion){
	// get maximum height of incoming vector
	let currentPoint = new Point(0, 0);
	let currentVector = startingVector;
	let maxHeight = 0;
	let path = [];
	let hasEnteredRegion = false
	while(!currentPoint.isPastRegion(targetRegion)){
		path.push(currentPoint.key);
		hasEnteredRegion = hasEnteredRegion || currentPoint.isInRegion(targetRegion);
		maxHeight = currentPoint.y > maxHeight ? currentPoint.y : maxHeight;
		const [nextPoint, nextVector] = step(currentPoint, currentVector);
		currentPoint = nextPoint;
		currentVector = nextVector;
	}
	return {hasEnteredRegion, maxHeight, path};
}
function solution(data){
	const maxXVelocity = data.maxX+1;
	const maxYVelocity = data.minY+1;
	
	let maxHeight = 0;
	let bestVector = null;
	for(let j=maxYVelocity;j<-data.minY;j++){
		for(let i=0;i<maxXVelocity;i++){
			const startingVector = new Vector(i, j);
			const result = testVelocityVector(startingVector, data);
			if(result.hasEnteredRegion){
				if(result.maxHeight > maxHeight){
					maxHeight = result.maxHeight;
					bestVector = startingVector;
				}
			}
		}
	};
	if(bestVector === null){
		console.log('No best height found!')
	} else {
		console.log(`Best height ${maxHeight} reached with starting vector ${bestVector.toString()}`);
	}
	return maxHeight;
}
function prepareInput(inputData){
	const targetArea = inputData.split(':')[1];
	const targetAreaCoords = targetArea.trim().split(',').map(section=>{
		const minMaxSection = section.trim().split('=')[1];
		const [min, max] = minMaxSection.split('..').map(val=>parseInt(val.trim()))
		return {min, max}
	});
	const targetRegion = {
		minX : targetAreaCoords[0].min,
		maxX : targetAreaCoords[0].max,
		minY : targetAreaCoords[1].min,
		maxY : targetAreaCoords[1].max,
	}
	return targetRegion;
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function readPrepareAndSolve(filename){
	const fileData = readFile(filename);
	const startTime = Date.now();
	const inputData = prepareInput(fileData);
	const result = solution(inputData);
	const runtime = Date.now() - startTime;
	return [result, runtime];
}