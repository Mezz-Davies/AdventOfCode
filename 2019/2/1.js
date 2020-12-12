const fs = require('fs');
const path = require('path');
const IntCode = require('./intCode');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const IntCodeProgram = new IntCode(data);
	while( !IntCodeProgram.complete ){
		IntCodeProgram.execute();
	}
	return IntCodeProgram.program[0];
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'}).split('\n');
}
function prepareInput(inputData){
	return inputData.join('').split(',').map(str=>parseInt(str.trim(),10));
}