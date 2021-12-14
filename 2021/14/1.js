const fs = require('fs');
const path = require('path');
const common = require('../../common/common');

const [ exampleResult, exampleRuntime ] = readPrepareAndSolve('example_input.txt');
console.log(`Example : ${exampleResult} Runtime : ${exampleRuntime}ms`);

const [ solutionResult, solutionRuntime ] = readPrepareAndSolve('input.txt');
console.log(`Solution : ${solutionResult} Runtime : ${solutionRuntime}ms`);

function stepPolymerisation(template, pairs){
	return template.split('').reduce((nextString, currentChar, i, arr)=>{
		let stringToAdd = currentChar;
		if( i < arr.length - 1 ){
			const pairKey = `${currentChar}${arr[i+1]}`;
			if( pairs[pairKey] !== undefined ){
				stringToAdd = `${stringToAdd}${pairs[pairKey]}`
			};
		}
		return `${nextString}${stringToAdd}`;
	}, '');
}

function solution(data){
	const {template, pairs} = data;
	const stepsToComplete = 10;
	let polymer = template;
	for( let i=0; i<stepsToComplete;i++){
		polymer = stepPolymerisation(polymer, pairs);
	}
	const occurances = polymer.split('').reduce((countLookup, char) => {
		countLookup[char] = countLookup[char] !== undefined ? countLookup[char] + 1 : 1;
		return countLookup;
	}, {});

	const maxOccurance = Math.max(...Object.values(occurances));
	const minOccurance = Math.min(...Object.values(occurances));

	return maxOccurance - minOccurance;
}
function prepareInput(inputData){
	const [template, pairs ] = inputData.split('\r\n\r\n');
	const formattedPairs = pairs.split('\n').map(line=>line.trim().split(' -> '));
	const formattedPairsLookup = formattedPairs.reduce((lookup, [key, valToInsert]) => {
		lookup[key] = valToInsert;
		return lookup
	}, {});
	return {template, pairs : formattedPairsLookup};
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function readPrepareAndSolve(filename){
	const fileData = readFile(filename);
	const startTime = Date.now();
	const inputData = prepareInput(fileData);
	const result = solution(inputData);
	const runtime = Date.now() - startTime;
	return [result, runtime];
}