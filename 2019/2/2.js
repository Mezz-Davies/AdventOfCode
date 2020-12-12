const fs = require('fs');
const path = require('path');
const IntCode = require('./intCode');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	for(let i=0; i<100; i++){
		for( let j=0; j<100; j++){
			const IntCodeProgram = new IntCode(data);
			IntCodeProgram.program[1] = i;
			IntCodeProgram.program[2] = j;
			while( !IntCodeProgram.complete ){
				IntCodeProgram.execute();
			}
			if( IntCodeProgram.program[0] === 19690720 ){
				return ( i * 100 ) + j;
			}
		}
	}
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'}).split('\n');
}
function prepareInput(inputData){
	return inputData.join('').split(',').map(str=>parseInt(str.trim(),10));
}