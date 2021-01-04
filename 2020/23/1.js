const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);

const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const maxNumberOfMoves = 100;
	let currentMove = 0;
	const state = data;
	let currentCupLoc = 0;
	while(currentMove<maxNumberOfMoves){
		const currentCup = state[currentCupLoc];
		const pickedUpCups = state.splice(currentCupLoc+1, 3);
		let destinationCupValue = currentCup - 1 > 0 ? currentCup - 1 : 9;
		let destinationCupLoc = state.indexOf(destinationCupValue);
		while(destinationCupLoc < 0){
			//console.log(destinationCupValue);
			destinationCupValue = destinationCupValue - 1 > 0 ? destinationCupValue - 1 : 9;
			destinationCupLoc = state.indexOf(destinationCupValue);
		}
		state.splice(destinationCupLoc+1, 0, ...pickedUpCups);
		const firstCup = state.shift();
		state.push(firstCup)
		currentMove++;
	}
	const locOf1 = state.indexOf(1);
	const numbersBefore = state.slice(0, locOf1);
	const rest = state.slice(locOf1+1);
	return [...rest, ...numbersBefore].join('');
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.split('').map(part=>parseInt(part));
}