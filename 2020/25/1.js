const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const [cardKey, doorKey] = data;

	console.log({cardKey, doorKey});
	const [cardLoopSize, doorLoopSize] = data.map(publicKey=>findLoopSize(publicKey));
	const cardEncryptionKey = transform(doorKey, cardLoopSize);
	const doorEncryptionKey = transform(cardKey, doorLoopSize);
	console.log({cardEncryptionKey, doorEncryptionKey});
	return data;
}
function findLoopSize(publicKey, subjectNumber=7){
	let loopSize = 0;
	let result = 1;
	while( result !== publicKey ){
		result = (result * subjectNumber) % 20201227;
		loopSize++;
	}
	return loopSize;
}
function transform(subjectNumber, loopSize){
	let result=1;
	for(let i=0; i<loopSize; i++){
		result = (result * subjectNumber) % 20201227;
	}
	return result;
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.split('\n').map(line=>parseInt(line.trim()));
}