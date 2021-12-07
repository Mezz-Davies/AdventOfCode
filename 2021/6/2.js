const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);

const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);


function getNextState(currentStateLookup){
	return Object.keys(currentStateLookup).reduce((nextState, key)=>{
		const currentDayInt = parseInt(key);
		const numberOfFishOnDay = currentStateLookup[key];
		if( currentDayInt === 0 ){
			nextState['8'] = numberOfFishOnDay;
			nextState['6'] = nextState['6'] !== undefined ? nextState['6'] + numberOfFishOnDay : numberOfFishOnDay; 
		} else {
			const nextDayString = (currentDayInt - 1).toString();
			nextState[nextDayString] = nextState[ nextDayString ] !== undefined ? nextState[ nextDayString ] + numberOfFishOnDay : numberOfFishOnDay;
		}
		return nextState;	
	}, {});
}

function solution(data){
	const targetNumberOfIterations = 256;
	let currentIteration = 0;

	const initialStateLookup = data.reduce((lookup, val)=>{
		lookup[val] = lookup[val] !== undefined ? lookup[val] + 1 : 1;
		return lookup;
	},{});
	let state = initialStateLookup;

	console.log(state);

	while(currentIteration < targetNumberOfIterations){
		state = getNextState(state);
		//console.log(state);
		currentIteration++;
	}

	console.log(state);
	return Object.keys(state).reduce((sum, key)=>{
		return sum + state[key]
	}, 0);
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.trim().split(',').map(val=>parseInt(val));
}{}