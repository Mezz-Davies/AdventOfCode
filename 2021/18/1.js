const fs = require('fs');
const path = require('path');
const common = require('../../common/common');

const [ exampleResult, exampleRuntime ] = readPrepareAndSolve('example_input.txt');
console.log(`Example : ${exampleResult} Runtime : ${exampleRuntime}ms`);

const [ solutionResult, solutionRuntime ] = readPrepareAndSolve('input.txt');
console.log(`Solution : ${solutionResult} Runtime : ${solutionRuntime}ms`);

function getDepthOfPair(inputString, pairLoc){
	let depth = 0;
	for(let i=0; i<pairLoc;i++){
		const c = inputString[i];
		if(c === '['){
			depth++;
		} else if (c === ']'){
			depth--;
		}
	}
	return depth;
}

function replaceMatchesWithStrings(stringToModify, matchReplaceObjectArray){
	let offset = 0;
	let modifiedString = stringToModify;
	
	matchReplaceObjectArray.forEach(matchReplaceObject => {
		//console.log({modifiedString, matchReplaceObject});
		const {index, match, replace} = matchReplaceObject;
		const stringBeforeMatch = modifiedString.slice(0, index+offset);
		const stringAfterMatch = modifiedString.slice(index+offset+match.length);
		modifiedString = stringBeforeMatch + replace + stringAfterMatch;
		offset += replace.length - match.length;
	});
	
	return modifiedString;
}


function reduce(inputString){
	const pairRegex = /\[(?<a>[\d]+),(?<b>[\d]+)\]/gi;
	const pairs = [...inputString.matchAll(pairRegex)];
	const pairsWithDepthOf4 = pairs.map(pair=>({...pair, depth : getDepthOfPair(inputString, pair.index)})).filter(pair=>pair.depth >= 4);
	const digitRegex = /([\d]+)/gi;
	const digits = [...inputString.matchAll(digitRegex)];

	//console.log(pairsWithDepthOf4);
	if( pairsWithDepthOf4.length > 0 ){
		const leftMostPair = pairsWithDepthOf4[0];
		// Explode

		let leftDigit = null;
		let rightDigit = null;

		digits.forEach(digit=>{
			if(digit.index < leftMostPair.index){
				leftDigit = digit;
			} else if (digit.index > (leftMostPair.index + leftMostPair[0].length) && rightDigit === null ){
				rightDigit = digit;
			}
		});
		
		const matchReplaceObjectArray = [];
		if( leftDigit !== null ){
			const newDigit = (parseInt(leftDigit[0]) + parseInt(leftMostPair.groups.a)).toString();
			const matchReplaceObject = {
				index : leftDigit.index,
				match : leftDigit[0],
				replace : newDigit
			}
			matchReplaceObjectArray.push(matchReplaceObject)
		}
		matchReplaceObjectArray.push({
			index : leftMostPair.index,
			match : leftMostPair[0],
			replace : '0'
		})
		if( rightDigit !== null ){
			const newDigit = (parseInt(rightDigit[0]) + parseInt(leftMostPair.groups.b)).toString();
			const matchReplaceObject = {
				index : rightDigit.index,
				match : rightDigit[0],
				replace : newDigit
			}
			matchReplaceObjectArray.push(matchReplaceObject)
		}

		return replaceMatchesWithStrings(inputString, matchReplaceObjectArray);

	} else {
		const digitsWithValGreaterThanTen = digits.map(digit=>({...digit, value : parseInt(digit[0])})).filter(digit => digit.value >= 10);
		if(digitsWithValGreaterThanTen.length > 0){
			const leftMostDigit = digitsWithValGreaterThanTen[0];
			const leftMostDigitAsInt = parseInt(leftMostDigit[0]);
			const newBracket = `[${Math.floor(leftMostDigitAsInt/2)},${Math.ceil(leftMostDigitAsInt/2)}]`;

			const matchReplaceObject = {
				index : leftMostDigit.index,
				match : leftMostDigit[0],
				replace : newBracket
			}
			
			return replaceMatchesWithStrings(inputString, [matchReplaceObject]);
		}
	}
	return inputString;
}

function getMagnitude(stringToGetMagnitude){
	const pairRegex = /\[(?<a>[\d]+),(?<b>[\d]+)\]/gi;
	let stringValue = stringToGetMagnitude;
	let pairs = [...stringValue.matchAll(pairRegex)];
	while (pairs.length > 0){
		const matchReplacementObjectArray = pairs.map(pair=>{
			const magnitude = (parseInt(pair.groups.a) * 3) + (parseInt(pair.groups.b) * 2);
			return {
				index : pair.index,
				match : pair[0],
				replace : magnitude.toString()
			}
		});
		stringValue = replaceMatchesWithStrings(stringValue, matchReplacementObjectArray);
		pairs = [...stringValue.matchAll(pairRegex)];
	}
	return stringValue;
}
function solution(data){
	const [starter, ...stringsToAdd] = data;
	const additionResult = stringsToAdd.reduce((value, stringToAdd)=>{
		let currentValue = `[${value},${stringToAdd}]`;
		let done = false;
		let nextValue = '';
		while(!done){
			nextValue = reduce(currentValue);
			done = currentValue === nextValue;
			currentValue = nextValue;
		}
		return currentValue;
	}, starter);
	console.log(additionResult)
	const magnitude = getMagnitude(additionResult);
	console.log(`EXAMPLE : ${getMagnitude('[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]')}`)
	return magnitude;
}
function prepareInput(inputData){
	return inputData.split('\n').map(line=>line.trim());
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