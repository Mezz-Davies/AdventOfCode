const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	return data.reduce((sum, weight)=>{
		const fuelReq = Math.floor(weight / 3) - 2;
		return sum + fuelReq;
	}, 0);
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'}).split('\n');
}
function prepareInput(inputData){
	return inputData.map(str=>str.trim()).map(str=>parseInt(str,10));
}