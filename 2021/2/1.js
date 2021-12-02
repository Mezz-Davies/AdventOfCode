const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const { horizontal, vertical } = data.reduce(({horizontal, vertical}, x) => {
		switch(x.cmd) {
			case 'forward':
				return { horizontal : horizontal + x.val, vertical }
			case 'up':
				return { horizontal, vertical : vertical -  x.val }
			case 'down':
				return { horizontal, vertical : vertical +  x.val }
			default:
				return {horizontal, vertical}
		}
	}, {horizontal : 0, vertical : 0});
	return horizontal * vertical
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.split('\n').map(line=>{
		lineParts = line.split(' ')
		return {
			cmd : lineParts[0],
			val : parseInt(lineParts[1])
		}
	});
}