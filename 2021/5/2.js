const fs = require('fs');
const path = require('path');

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	toString(){
		const pointAsObj = {x : this.x, y: this.y};
		return JSON.stringify(pointAsObj);
	}
}

const ExampleResult = solution('part2_example',prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);

const SolutionResult = solution('part2_solution', prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function getPointsOnLine(startPoint, endPoint){
	let xStart = startPoint.x;
	let yStart = startPoint.y;
	let xDiff = endPoint.x - startPoint.x;
	let yDiff = endPoint.y - startPoint.y;

	const pointsOnLine = [];

	const lineLength = Math.max(Math.abs(xDiff), Math.abs(yDiff));
	const xStep = Math.ceil(xDiff / lineLength);
	const yStep = Math.ceil(yDiff / lineLength);
	
	for( let i=0; i<=lineLength; i++){
		pointsOnLine.push(new Point(xStart + (xStep * i), yStart + (yStep * i)))
	}

	return pointsOnLine;
}

function saveGridToFile(filename, pointsLookup){
	let xMin = Number.POSITIVE_INFINITY;
	let yMin = Number.POSITIVE_INFINITY;
	let xMax = Number.NEGATIVE_INFINITY;
	let yMax = Number.NEGATIVE_INFINITY;
	Object.keys(pointsLookup).forEach(key=>{
		const {x, y} = JSON.parse(key);
		if( x < xMin ){
			xMin = x;
		}
		if( x > xMax ){
			xMax = x;
		}
		if( y < yMin ){
			yMin = y;
		}
		if( y > yMax ){
			yMax = y;
		}
	});

	let grid = '';
	for( let i=yMin; i<=yMax; i++){
		let line = '';
		for( let j=xMin; j<=xMax; j++){
			const pointKey = `{"x":${j},"y":${i}}`;
			line = line + (pointsLookup[pointKey] !== undefined ? `${pointsLookup[pointKey]}` : '.');
		}
		grid += line + '\n';
	}
	
	fs.writeFileSync(filename, grid);
}

function solution(name, data){
	const pointsLookup = {};
	data.forEach(([startPoint, endPoint]) => {
		const pointsOnLine = getPointsOnLine(startPoint, endPoint);
		pointsOnLine.forEach(point => {
			const pointAsString = point.toString();
			pointsLookup[pointAsString] = pointsLookup[pointAsString] !== undefined ? pointsLookup[pointAsString] + 1 : 1;
		});
	});
	saveGridToFile(`${name}_grid.txt`, pointsLookup);

	const numberOfIntersectingPOints = Object.values(pointsLookup).filter(val=>val>=2).length;

	return numberOfIntersectingPOints;
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.split('\r\n').map(line => {
		const lineParts = line.split('->');
		const linePoints = lineParts.map(point => {
			const trimmedAndSplitInts = point.trim().split(',').map(val => parseInt(val))
			return new Point(trimmedAndSplitInts[0], trimmedAndSplitInts[1])
		});
		return linePoints
	});
}