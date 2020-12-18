const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	let currentMask = '';
	const memory = {};
	data.forEach(command => {
		if( command[0] === 'mask' ){
			currentMask = command[1];
		} else {
			const memLocationStart = command[0].indexOf('[');
			const memLocationEnd = command[0].indexOf(']');
			const memLocation = command[0].substr(memLocationStart+1,memLocationEnd-1);
			memory[memLocation] = applyMaskToValue(command[1], currentMask);
		}
	});
	console.log(memory);
	return Object.keys(memory).reduce((total, currentKey)=>total+memory[currentKey], 0);
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.split('\n').map(line=>line.trim().split('=').map(part=>part.trim()));
}
function applyMaskToValue(value, mask){
	const valAsBinary = parseInt(value,10).toString(2).padStart(36, '0');
	return parseInt(valAsBinary.split('').map((char, index)=>mask.charAt(index) !== 'X' ? mask.charAt(index) : char ).join(''),2);
}