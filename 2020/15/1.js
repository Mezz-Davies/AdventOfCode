const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const numberList = [...data];
	let turnNumber = numberList.length + 1;
	while(numberList.length<2020){
		// consider last number.
		// has it been spoken before? If no, push 0.
		// if yes, push the difference between previous turn and turn when last spoken.
		const last = numberList[numberList.length-1];
		const listMinusLast = numberList.slice(0, numberList.length-1);
		const lastSaidTurn = listMinusLast.lastIndexOf(last)+1;
		
		if( lastSaidTurn < 1 ){ // not said. Push 0
			numberList.push(0);
		} else {
			numberList.push(turnNumber-1 - lastSaidTurn);
		}
		//console.log(`Turn ${turnNumber}: ${last} @ ${lastSaidTurn}, pushed ${numberList[numberList.length-1]}`);
		turnNumber++;
	}
	//console.log(numberList);
	return numberList.pop();
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.trim().split(',').map(str=>parseInt(str.trim()));
}