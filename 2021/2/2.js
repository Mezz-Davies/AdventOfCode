const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);

const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const { horizontal, vertical, aim } = data.reduce(({horizontal, vertical, aim}, {cmd, val}) => {
		switch(cmd) {
			case 'forward':
				return { horizontal : horizontal + val, vertical : vertical + (aim * val), aim }
			case 'up':
				return { horizontal, vertical, aim : aim - val }
			case 'down':
				return { horizontal, vertical, aim : aim + val }
			default:
				return {horizontal, vertical, aim}
		}
	}, {horizontal : 0, vertical : 0, aim : 0});
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