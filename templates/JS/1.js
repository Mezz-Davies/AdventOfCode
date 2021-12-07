const fs = require('fs');
const path = require('path');
const common = require('../../common/common');

const ExampleResult = readPrepareAndSolve('example_input.txt');
console.log(`Example : ${ExampleResult}`);
const SolutionResult = readPrepareAndSolve('input.txt');
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	return data;
}
function prepareInput(inputData){
	return inputData;
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