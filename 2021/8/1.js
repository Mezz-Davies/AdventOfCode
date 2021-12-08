const fs = require('fs');
const path = require('path');
const common = require('../../common/common');

const ExampleResult = readPrepareAndSolve('example_input.txt');
console.log(`Example : ${ExampleResult}`);

const SolutionResult = readPrepareAndSolve('input.txt');
console.log(`Solution : ${SolutionResult}`);


function countOccurancesOf1478(display){
	let count = 0;
	display.forEach(val => {
		if( val.length === 2 || val.length === 3 || val.length === 4 || val.length === 7 ){
			count++;
		}
	});
	return count;
}

function solution(data){
	return data.reduce((count, line) => count + countOccurancesOf1478(line[1]), 0 );
}
function prepareInput(inputData){
	return inputData.split('\n').map(
		line => line.trim().split('|').map(
			val => val.split(' ').filter(val => val != '')
			)
		);
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