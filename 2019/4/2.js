const fs = require('fs');
const path = require('path');

const digitsToCheckRegex = [0,1,2,3,4,5,6,7,8,9].map(item=>new RegExp(`^[^${item}]*${item}${item}[^${item}]*$`));
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
	const hasTwoAndOnlyTwoAdjacent = digitsToCheckRegex.some(re=>re.test(str_in));
	return is6digits && isRising && hasTwoAndOnlyTwoAdjacent;
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.trim().split('-').map(str=>parseInt(str, 10));
}