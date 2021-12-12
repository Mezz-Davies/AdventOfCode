const fs = require('fs');
const path = require('path');
const common = require('../../common/common');

class Point {
	constructor(x, y, val){
		this.x = x;
		this.y = y;
		this.val = val;
		this.key = `(${this.x},${this.y})`;
		this.surroundingPointKeys = this.getSurroundingPointKeys();
		this.hasFlashed = false;
	}
	getSurroundingPointKeys(){
		const surround = [];
		for(let i=this.x-1;i<=this.x+1;i++){
			for(let j=this.y-1;j<=this.y+1;j++){
				if(!(i===this.x && j===this.y)){
					surround.push(`(${i},${j})`);
				}
			}
		}
		return surround;
	}
}

const [ exampleResult, exampleRuntime ] = readPrepareAndSolve('example_input.txt');
console.log(`Example : ${exampleResult}. Runtime : ${exampleRuntime}ms`);

const [ solutionResult, solutionRuntime ] = readPrepareAndSolve('input.txt');
console.log(`Solution : ${solutionResult}. Runtime : ${solutionRuntime}ms`);

function step(state){
	let stateKeys = Object.keys(state);
	let flashCount = 0;
	stateKeys.forEach(elementKey => {
		state[elementKey].val++;
		state[elementKey].hasFlashed = false;
	});
	let flashedPoints = [];
	let pointsToFlash = stateKeys.filter(key=>state[key].val > 9 && !state[key].hasFlashed);
	while( pointsToFlash.length > 0 ){
		pointsToFlash.forEach(key => {
			state[key].surroundingPointKeys.forEach(neighbourKey => {
				if( state[neighbourKey] !== undefined ){
					state[neighbourKey].val++;
				}
			});
			state[key].val = 0;
			state[key].hasFlashed = true;
			flashCount++;
		});
		flashedPoints = [...flashedPoints, ...pointsToFlash];
		pointsToFlash = stateKeys.filter(key=>state[key].val > 9 && !state[key].hasFlashed);
	}
	stateKeys.forEach(elementKey => {
		if( state[elementKey].hasFlashed ){
			state[elementKey].val = 0;
		}
	});
	return flashCount
}

function printMap(state){
	const stateKeys = Object.keys(state);
	const maxX = Math.max(...stateKeys.map(pointKey => state[pointKey].x))
	const maxY = Math.max(...stateKeys.map(pointKey => state[pointKey].y))
	
	let map = ""
	for(let i=0; i<maxY; i++){
		let line = "";
		for(let j=0; j<maxX; j++){
			line += state[`(${j},${i})`].val.toString()
		}
		map += `${line}\n`;
	}

	console.log(map);
}

function solution(data){
	const state = data.reduce(
		(stateLookup, line, y)=>{
			line.forEach((val, x)=>{
				const point = new Point(x, y, val);
				stateLookup[point.key] = point;
			})
			return stateLookup;
		}, {});
	let currentStep = 0;

	let numberOfFlashesThisStep = 0;
	while(numberOfFlashesThisStep < Object.keys(state).length){
		currentStep++;
		numberOfFlashesThisStep = step(state);
	}
	printMap(state)
	return currentStep;
}
function prepareInput(inputData){
	return inputData.split('\n').map(line=>line.trim().split('').map(val=>parseInt(val)));
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