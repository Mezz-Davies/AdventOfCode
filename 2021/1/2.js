const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	return data.map((v, i, arr)=>{
		if( i < 2 ){
			return 0
		} else {
			return arr[i] + arr[i-1] + arr[i-2]
		}
	}).reduce((count, val, i, arr)=>{
		if ( i < 3 || val <= arr[i-1] ){
			return count
		} else {
			return count + 1
		}
	}, 0);
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.split('\n').map(line=>parseInt(line));
}