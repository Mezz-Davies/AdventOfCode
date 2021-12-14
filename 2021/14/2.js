const fs = require('fs');
const path = require('path');
const common = require('../../common/common');

const [ exampleResult, exampleRuntime ] = readPrepareAndSolve('example_input.txt');
console.log(`Example : ${exampleResult} Runtime : ${exampleRuntime}ms`);

const [ solutionResult, solutionRuntime ] = readPrepareAndSolve('input.txt');
console.log(`Solution : ${solutionResult} Runtime : ${solutionRuntime}ms`);

function getPairsCount(template){
	return template.split('').reduce((pairs, currentChar, i, arr)=>{
		if( i < arr.length - 1){
			const pairKey = `${currentChar}${arr[i+1]}`;
			pairs[pairKey] = pairs[pairKey] !== undefined ? pairs[pairKey] + 1 : 1
		}
		return pairs;
	}, {})
}
function stepPolymerisation(template, pairs){
	return Object.keys(template).reduce((nextPairsCount, currentKey)=>{
		if(pairs[currentKey] !== undefined){
			const letterToInsert = pairs[currentKey]
			const newKey1 = `${currentKey[0]}${letterToInsert}`;
			const newKey2 = `${letterToInsert}${currentKey[1]}`;

			nextPairsCount[newKey1] = nextPairsCount[newKey1] !== undefined ? nextPairsCount[newKey1] + template[currentKey] : template[currentKey];
			nextPairsCount[newKey2] = nextPairsCount[newKey2] !== undefined ? nextPairsCount[newKey2] + template[currentKey] : template[currentKey];
		} else {
			nextPairsCount[currentKey] = template[currentKey];
		}
		return nextPairsCount;
	}, {});
}

function solution(data){
	const {template, pairs} = data;
	const stepsToComplete = 40;
	let polymer = getPairsCount(template);
	console.log(polymer);

	for( let i=0; i<stepsToComplete;i++){
		polymer = stepPolymerisation(polymer, pairs);
	}
	console.log(polymer);
	
	const occurances = Object.keys(polymer).reduce((countLookup, key)=>{
		const char = key[0];
		countLookup[char] = countLookup[char] !== undefined ? countLookup[char] + polymer[key] : polymer[key];
		return countLookup;
	}, {});
	// Count last letter
	occurances[template[template.length - 1] ] += 1;

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