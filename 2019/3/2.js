const fs = require('fs');
const path = require('path');
const Path = require('./geometry/Path');
const {getManhattanDistanceToCentre } = require('./geometry/Manhattan');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const paths = data.map(pathCommands=>{
		const newPath = new Path();
		for(const command of pathCommands){
			newPath.executeCommand(command);
		}
		return newPath;
	});
	const intersections = paths[0].getIntersectingPoints(paths[1]);
	
	return Math.min( ...intersections.map(point=>{
		const dist0 = paths[0].getStepsToPoint(point);
		const dist1 = paths[1].getStepsToPoint(point);
		return dist0+dist1;
	}));
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'}).split('\n');
}
function prepareInput(inputData){
	return inputData.map(str=>str.trim().split(','));
}