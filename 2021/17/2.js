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
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	toString(){
		return `${this.x},${this.y}`;
	}
}

class Probe{
	constructor(xVel, yVel){
		this.x = 0;
		this.y = 0;
		this.xVel = xVel;
		this.yVel = yVel;
	}
	getPositionKey(){
		return `(${this.x},${this.y})`
	}
	isInRegion({minX, maxX, minY, maxY}){
		return this.x >= minX && this.x <= maxX && this.y >= minY && this.y <= maxY;
	}
	isPastRegion({maxX, minY}){
		return this.x > maxX || this.y < minY;
	}
	step(){
	
		this.x += this.xVel;
		this.y += this.yVel;
		this.xVel = (this.xVel - 1) < 0 ? 0 : this.xVel - 1;
		this.yVel = this.yVel - 1;
	}
}

const [ exampleResult, exampleRuntime ] = readPrepareAndSolve('example_input.txt');
console.log(`Example : ${exampleResult} Runtime : ${exampleRuntime}ms`);

const [ solutionResult, solutionRuntime ] = readPrepareAndSolve('input.txt');
console.log(`Solution : ${solutionResult} Runtime : ${solutionRuntime}ms`);

function step(startPoint, velocityVector){
	const nextPoint = new Point(startPoint.x + velocityVector.x, startPoint.y + velocityVector.y);
	const nextXVelocity = velocityVector.x - 1 < 0 ? velocityVector.x - 1 : 0; // Account for drag
	const nextYVelocity = velocityVector.y - 1; // Accelerating downwards due to gravity.
	const nextVector = new Vector(nextXVelocity, nextYVelocity);
	return [nextPoint, nextVector];
}


function testProbeWithVelocities(xVelocity, yVelocity, targetRegion){
	const probe = new Probe(xVelocity, yVelocity);
	let path = [];
	let hasEnteredRegion = false;
	while(!probe.isPastRegion(targetRegion)){
		path.push(probe.getPositionKey());
		hasEnteredRegion = hasEnteredRegion || probe.isInRegion(targetRegion);
		probe.step();
	}
	return {hasEnteredRegion, path}
}
function solution(data){
	console.log(data);
	const maxXVelocity = data.maxX;
	const yVelocityStart = data.minY;
	const yVelocityEnd = data.minY * -1;

	
	const inRegionList = [];
	
	for(let j=yVelocityStart;j<=yVelocityEnd;j++){
		for(let i=0;i<=maxXVelocity;i++){
			const result = testProbeWithVelocities(i, j, data);
			//console.log(`Launching probe with speed (${i},${j}). It ${result.hasEnteredRegion ? "entered":"did not enter"} the region after ${result.path.length} steps!`)
			if(result.hasEnteredRegion){
				inRegionList.push(`${i},${j}`);
			}
		}
	};
	
	//console.log(testProbeWithVelocities(6, 8, data));
	console.log(inRegionList.reduce((str, val, i)=>`${str} ${val}${i % 9 === 0 ? '\n' : ''}`, ''));
	return inRegionList.length;
}
function prepareInput(inputData){
	const targetArea = inputData.split(':')[1];
	const targetAreaCoords = targetArea.trim().split(',').map(section=>{
		const minMaxSection = section.trim().split('=')[1];
		const [min, max] = minMaxSection.split('..').map(val=>parseInt(val.trim()))
		return {min, max}
	});
	console.log(targetArea)
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