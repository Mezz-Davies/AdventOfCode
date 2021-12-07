const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const uniqueVals = data.reduce((uniqueVals, val)=>{
		if( !uniqueVals.includes(val)){
			uniqueVals.push(val);
		}
		return uniqueVals;
	},[]);
	const sumDistancesToVals = uniqueVals.map(targetVal => 
		data.reduce((sum, val) => sum + Math.abs(targetVal - val), 0)
	);

	const minDinstance = sumDistancesToVals.reduce(
		(minDistance, sumDistance) => sumDistance < minDistance ? sumDistance : minDistance, Number.POSITIVE_INFINITY
	);
	
	return minDinstance;
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.split(',').map(val=>parseInt(val));
}