const fs = require('fs');
const path = require('path');
const IntCode = require('./intCode');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	console.log(data);
	const IntCodeProgram = new IntCode(data);
	IntCodeProgram.input.push(1);
	while( !IntCodeProgram.complete ){
		IntCodeProgram.execute();
	}
	return IntCodeProgram.output;
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.trim().split(',').map(item=>parseInt(item.trim(),10));
}