const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);

const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function getCostOfMove(target, n){
	const dist = Math.abs(target - n);
	return (dist/2) * (dist + 1);
}

function solution(data){
	const max = Math.max(...data);
	const uniqueVals = [];
	for( let i = 0; i <= max; i++ ){
		uniqueVals.push(i);
	}
	const sumDistancesToVals = uniqueVals.map(targetVal => {
		const cost = data.reduce((sum, val) => sum + getCostOfMove(targetVal, val), 0);
		return cost;
	});

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