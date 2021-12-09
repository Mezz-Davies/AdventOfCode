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
	getAdjacentPoints(){
		return [
			new Point(this.x - 1, this.y),
			new Point(this.x + 1, this.y),
			new Point(this.x, this.y - 1),
			new Point(this.x, this.y + 1)
		]
	}
	toString(){
		return JSON.stringify({x : this.x, y: this.y});
	}
}

const ExampleResult = readPrepareAndSolve('example_input.txt');
console.log(`Example : ${ExampleResult}`);

const SolutionResult = readPrepareAndSolve('input.txt');
console.log(`Solution : ${SolutionResult}`);

function getPointsArrayAndLookup(mapInput){
	const pointsLookup = {};
	const pointsArray = [];
	mapInput.forEach((row, y) => {
		row.forEach((val, x) => {
			const thisPoint = new Point(x, y, val);
			pointsLookup[thisPoint.toString()] = thisPoint;
			pointsArray.push(thisPoint);
		})
	});

	return {pointsLookup, pointsArray}
}
function getLowpoints(pointsArray, pointsLookup){
	return pointsArray.reduce((lowPoints, point) => {
		const surroundingPoints = point.getAdjacentPoints();
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
function getBasinSize(lowPoint, pointsLookup){
	const checkedPoints = [];
	const candidatePoints = [lowPoint];
	const basin = [];

	let i = 0;
	while (i < candidatePoints.length){
		const currentPoint = candidatePoints[i];
		if(!checkedPoints.includes(currentPoint.key) && currentPoint.z < 9){
			basin.push(currentPoint);
			checkedPoints.push(currentPoint.key);
			const surroundingPointsFromLookup = currentPoint.getAdjacentPoints().reduce((pointsFromLookup, surroundingPoint)=>{
				if(pointsLookup[surroundingPoint.key]!==undefined){
					return [...pointsFromLookup, pointsLookup[surroundingPoint.key]];
				}
				return pointsFromLookup;
			},[]);
			candidatePoints.push(...surroundingPointsFromLookup);
		}
		i++;
	}
	return basin.length;
}

function solution(data){
	const {pointsArray, pointsLookup} = getPointsArrayAndLookup(data)
	const lowPoints = getLowpoints(pointsArray, pointsLookup);
	const basinSizes = lowPoints.map(lowPoint=>getBasinSize(lowPoint, pointsLookup));
	console.log(basinSizes);
	basinSizes.sort((a, b)=>b-a) // sort largest -> smallest
	const productOfThreeLargestBasinSizes = basinSizes[0] * basinSizes[1] * basinSizes[2]
	return productOfThreeLargestBasinSizes;
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