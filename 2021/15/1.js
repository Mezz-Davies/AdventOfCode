const fs = require('fs');
const path = require('path');
const common = require('../../common/common');

class Point {
	constructor(x, y, risk){
		this.x = x;
		this.y = y;
		this.risk = risk;
		this.key = `(${this.x},${this.y})`;
		this.visited = false;
		this.distance = Number.POSITIVE_INFINITY;
	}
	getAdjacentPoints(){
		return [
			`(${this.x-1},${this.y})`,
			`(${this.x+1},${this.y})`,
			`(${this.x},${this.y-1})`,
			`(${this.x},${this.y+1})`,
		]
	}
}

const [ exampleResult, exampleRuntime ] = readPrepareAndSolve('example_input.txt');
console.log(`Example : ${exampleResult} Runtime : ${exampleRuntime}ms`);

const [ solutionResult, solutionRuntime ] = readPrepareAndSolve('input.txt');
console.log(`Solution : ${solutionResult} Runtime : ${solutionRuntime}ms`);

function getCheapestUnvisitedNode(pointsLookup){
	let minDistance = Number.POSITIVE_INFINITY;
	let keyOfMinDistance = '';
	Object.keys(pointsLookup).forEach(key=>{
		const thisNode = pointsLookup[key];
		if(!thisNode.visited && thisNode.distance < minDistance){
			minDistance = thisNode.distance;
			keyOfMinDistance = key
		}
	})

	return keyOfMinDistance
}
function getAllUnvisitedNeighbours(currentNodeKey, pointsLookup){
	return pointsLookup[currentNodeKey].getAdjacentPoints().filter(key=>pointsLookup[key] !== undefined && !pointsLookup[key].visited)
}
function dijkstraSolve(pointsLookup){
	pointsLookup['(0,0)'].distance = 0; // set starting node to 0;
	let currentNodeKey = getCheapestUnvisitedNode(pointsLookup)
	while(currentNodeKey !== ''){
		const currentNode = pointsLookup[currentNodeKey];
		const unvisitedNeighbours = getAllUnvisitedNeighbours(currentNodeKey, pointsLookup);
		unvisitedNeighbours.forEach(neighbourKey=>{
			const tentativeDistance = currentNode.distance + pointsLookup[neighbourKey].risk;
			pointsLookup[neighbourKey].distance = tentativeDistance < pointsLookup[neighbourKey].distance ? tentativeDistance : pointsLookup[neighbourKey].distance;
		})
		currentNode.visited = true;
		currentNodeKey = getCheapestUnvisitedNode(pointsLookup);
	}
	return pointsLookup
}

function solution(data){
	const pointsLookup = {};
	const maxY = data.length-1;
	const maxX = maxY; // Grid is square.
	data.forEach((row, y)=>{
		row.forEach((risk, x) => {
			const thisPoint = new Point(x, y, risk);
			pointsLookup[thisPoint.key] = thisPoint;
		});
	}, {});
	const solvedPointsLookup = dijkstraSolve(pointsLookup);
	const endPoint = solvedPointsLookup[`(${maxX},${maxY})`];
	return endPoint.distance;
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