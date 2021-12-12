const fs = require('fs');
const path = require('path');
const common = require('../../common/common');

class MapPoint {
	constructor(name){
		this.name = name;
		this.isBig = name.toUpperCase() === name;
		this.connections = [];
	}
}

const [ exampleResult, exampleRuntime ] = readPrepareAndSolve('example_input.txt');
console.log(`Example : ${exampleResult}. Runtime : ${exampleRuntime}ms`);

const [ solutionResult, solutionRuntime ] = readPrepareAndSolve('input.txt');
console.log(`Solution : ${solutionResult}. Runtime : ${solutionRuntime}ms`);


function lastVal(array){
	return array[array.length - 1];
}
function buildMapLookup(inputArray){
	return inputArray.reduce((mapLookup, connection) => {
		const [source, destination] = connection.split('-');
		if( mapLookup[source] === undefined ){
			mapLookup[source] = new MapPoint(source);
		}
		mapLookup[source].connections.push(destination);
		if( mapLookup[destination] === undefined ){
			mapLookup[destination] = new MapPoint(destination);
		}
		mapLookup[destination].connections.push(source);
		return mapLookup;
	}, {});
}
function findUniquePathsFromStartToEnd(mapLookup){
	let uniquePaths = [['start']];
	while(!uniquePaths.every(path => lastVal(path) === 'end')){
		uniquePaths = uniquePaths.reduce((nextPaths, current)=>{
			if(lastVal(current) === 'end'){
				nextPaths.push(current);
			} else {
				const currentPathLoc = mapLookup[lastVal(current)];
				const pathsFromThisLoc = currentPathLoc.connections.filter(connection=>mapLookup[connection].isBig || !current.includes(connection))
															.map(connection => [...current, connection]);
				nextPaths.push(...pathsFromThisLoc);
			}
			return nextPaths;
		},[]);
		//console.log(uniquePaths);
	}
	return uniquePaths;
}
function solution(data){
	const mapLookup = buildMapLookup(data);
	console.log(mapLookup)
	const uniquePaths = findUniquePathsFromStartToEnd(mapLookup);
	return uniquePaths.length;
}
function prepareInput(inputData){
	return inputData.split('\n').map(line=>line.trim());
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