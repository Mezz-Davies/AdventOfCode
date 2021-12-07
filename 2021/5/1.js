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

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);

const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);


function getPointsOnLine(startPoint, endPoint){
	let xStart = startPoint.x;
	let yStart = startPoint.y;
	let xDiff = endPoint.x - startPoint.x;
	let yDiff = endPoint.y - startPoint.y;

	if( xDiff < 0 ){
		xStart = endPoint.x;
		xDiff = xDiff * -1;
	}
	if( yDiff < 0 ){
		yStart = endPoint.y;
		yDiff = yDiff * -1;
	}
	const pointsOnLine = [];

	for(let i=xStart;i<=xStart+xDiff;i++){
		for(let j=yStart;j<=yStart+yDiff;j++){
			pointsOnLine.push(new Point(i, j))
		}
	}

	return pointsOnLine;
}

function solution(data){
	const horizontalAndVertical = data.filter(([point1, point2])=>point1.x === point2.x || point1.y === point2.y)
	const pointsLookup = {};
	horizontalAndVertical.forEach(([startPoint, endPoint]) => {
		const pointsOnLine = getPointsOnLine(startPoint, endPoint);
		pointsOnLine.forEach(point => {
			const pointAsString = point.toString();
			pointsLookup[pointAsString] = pointsLookup[pointAsString] !== undefined ? pointsLookup[pointAsString] + 1 : 1;
		});
	});
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