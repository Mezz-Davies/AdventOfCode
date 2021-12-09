const fs = require('fs');
const path = require('path');
const common = require('../../common/common');

class Point {
	constructor(x, y, val){
		this.x = x;
		this.y = y;
		this.z = val;
		this.key = this.toString()
	}
	getSurroundingPoints(){
		const surround = [];
		for(let i=this.x-1;i<=this.x+1;i++){
			for(let j=this.y-1;j<=this.y+1;j++){
				if(!(i===this.x && j===this.y)){
					surround.push(new Point(i, j));
				}
			}
		}
		return surround
	}
	toString(){
		return JSON.stringify({x : this.x, y: this.y});
	}
}

const ExampleResult = readPrepareAndSolve('example_input.txt');
console.log(`Example : ${ExampleResult}`);

const SolutionResult = readPrepareAndSolve('input.txt');
console.log(`Solution : ${SolutionResult}`);


function getLowpoints(mapInput){
	const pointsLookup = {};
	const pointsArray = [];
	mapInput.forEach((row, y) => {
		row.forEach((val, x) => {
			const thisPoint = new Point(x, y, val);
			pointsLookup[thisPoint.toString()] = thisPoint;
			pointsArray.push(thisPoint);
		})
	});

	return pointsArray.reduce((lowPoints, point) => {
		const surroundingPoints = point.getSurroundingPoints();
		//console.log({point, surroundingPoints})
		const isLowPoint = surroundingPoints.every(surround => {
			if(pointsLookup[surround.key] !== undefined ){
				return point.z < pointsLookup[surround.key].z
			}
			return true
		});
		if( isLowPoint ){
			lowPoints.push(point);
		}
		return lowPoints;
	}, []);
}

function solution(data){
	const lowPoints = getLowpoints(data);
	const totalDangerScore = lowPoints.reduce((score, point)=> score += (point.z+1),0)
	
	return totalDangerScore;
}
function prepareInput(inputData){
	return inputData.split('\n').map(line => line.trim().split('').map(val => parseInt(val)));
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function readPrepareAndSolve(filename){
	const fileData = readFile(filename);
	const inputData = prepareInput(fileData);
	const result = solution(inputData);
	return result;
}