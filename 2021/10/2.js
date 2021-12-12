const fs = require('fs');
const path = require('path');
const common = require('../../common/common');

const openBrackets = ['(','[','{','<'];
const closedBrackets = [')',']','}','>'];
const scores = {
	')' : 1,
	']' : 2,
	'}' : 3,
	'>' : 4
}

const [ exampleResult, exampleRuntime ] = readPrepareAndSolve('example_input.txt');
console.log(`Example : ${exampleResult} Runtime : ${exampleRuntime}ms`);

const [ solutionResult, solutionRuntime ] = readPrepareAndSolve('input.txt');
console.log(`Solution : ${solutionResult} Runtime : ${solutionRuntime}ms`);


function isValidChunk(chunk){
	const bracketType = openBrackets.indexOf(chunk[0]);
	return chunk[chunk.length-1] === closedBrackets[bracketType];
}
function getClosingLoc(line, loc){
	let openScopes = 0;
	for( let i=loc; i<line.length;i++ ){
		if(openBrackets.includes(line[i])){
			openScopes++;
		} else {
			openScopes--;
		}
		if(openScopes === 0){
			return i;
		}
	}
	return -1;
}
function getCompleteChunks(line){
	const chunks = line.reduce((chunks, bracket, index) => {
		if(openBrackets.includes(bracket)){
			const closingLoc = getClosingLoc(line, index);
			if( closingLoc > 0){
				const newChunk = line.slice(index, closingLoc + 1);
				chunks.push(newChunk);
			}
		}
		return chunks;
	}, []);
	return chunks;
}

function solution(data){
	const autocompleteScore = data.reduce((lineScores, line)=>{
		const completeChunksInLine = getCompleteChunks(line);
		if( completeChunksInLine.every(chunk=>isValidChunk(chunk))){
			const bracketsToAdd = [];
			for(let i=0; i<line.length;i++){
				if(openBrackets.includes(line[i]) && getClosingLoc(line, i) === -1){
					const bracketType = openBrackets.indexOf(line[i]);
					const bracketToAdd = closedBrackets[bracketType];
					if(!bracketToAdd){
						console.log({bracket : line[i], bracketType});
					}
					bracketsToAdd.push(bracketToAdd);
				}
			}
			bracketsToAdd.reverse();
			const lineScore = bracketsToAdd.reduce((score,bracket)=>(score*5)+scores[bracket],0);
			lineScores.push(lineScore)
		}
		return lineScores;
	}, []);
	autocompleteScore.sort((a,b)=>a-b);
	console.log(autocompleteScore);
	return autocompleteScore[Math.floor(autocompleteScore.length/2)];
}
function prepareInput(inputData){
	return inputData.split('\n').map(line => line.trim().split(''));
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