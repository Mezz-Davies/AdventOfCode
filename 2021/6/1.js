const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function getNextState(currentStateLookup){
	const nextState = Object.keys(currentStateLookup).map(key=>{

	});
}

function solution(data){
	const targetNumberOfIterations = 80;
	let currentIteration = 0;

	let state = data;
	let nextState;

	while( currentIteration <= targetNumberOfIterations ){
		//console.log({state});
		let newFish = 0;
		nextState = state.map(fish => {
			if( fish === 0 ){
				newFish++;
				return 6;
			}
			return fish - 1;
		});
		const newFishArray = new Array(newFish);
		newFishArray.fill(8);
		state = [...nextState, ...newFishArray];
		currentIteration++;
	}

	return nextState.length;
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.trim().split(',').map(val=>parseInt(val));
}{}