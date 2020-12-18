const fs = require('fs');
const path = require('path');

/*
const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
*/
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const min = data[0];
	const max = data[1];
	let validPasswordCount = 0;
	for( let val=min; val <= max; val++ ){
		validPasswordCount += isValidPassword(val.toString()) ? 1 : 0;
	}
	return validPasswordCount;
}
function isValidPassword(str_in){
	const is6digits = str_in.length === 6;
	const isRising = str_in.split('').every((digit, index, arr)=>
		index === 0 ||
		parseInt(digit, 10) >= parseInt(arr[index-1], 10)
	)
	const hasTwoAdjacent = str_in.split('').some((digit, index, arr)=>
		index > 0 &&
		parseInt(digit, 10) === parseInt(arr[index-1], 10)
	)
	return is6digits && isRising && hasTwoAdjacent;
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.trim().split('-').map(str=>parseInt(str, 10));
}