const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const numberList = [...data];
	let turnNumber = numberList.length + 1;
	const occurances = numberList.reduce((obj, val, index)=>({...obj, [val.toString()]:[index+1]}))
	// Works for small numbers.. what about larger sets?
	while(turnNumber<10){
		const last = numberList[numberList.length-1];
		const lastSaidTurn = occurances[last.toString()].length < 1 ? occurances[last.toString()][occurances[last.toString()].length-1] : -1;
		const valToPush = lastSaidTurn > 0 ? turnNumber - lastSaidTurn : 0;
		numberList.push(valToPush);
		occurances[valToPush] = occurances[valToPush] || [];
		occurances[valToPush].push(turnNumber);
		console.log(`Turn ${turnNumber}: ${last} @ ${lastSaidTurn}, pushed ${valToPush}`);
		turnNumber++;
	}
	return numberList.pop();
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.trim().split(',').map(str=>parseInt(str.trim()));
}