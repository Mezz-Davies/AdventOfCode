const fs = require('fs');
const path = require('path');
const common = require('../../common/common');

const ExampleResult = readPrepareAndSolve('example_input.txt');
console.log(`Example : ${ExampleResult}`);

const SolutionResult = readPrepareAndSolve('input.txt');
console.log(`Solution : ${SolutionResult}`);

function sortString(input){
	return input.split('').sort().join('')
}

function decodeOutputValue(line){
	const [ config, display ] = line
	const {oneVal, fourVal, sevenVal, eightVal} = config.reduce((
		{oneVal, fourVal, sevenVal, eightVal}, val) => {
			if( val.length === 2 ){
				return {oneVal : val, fourVal, sevenVal, eightVal}
			}
			if( val.length === 3 ){
				return {oneVal, fourVal, sevenVal : val, eightVal}
			}
			if( val.length === 4){
				return {oneVal, fourVal : val, sevenVal, eightVal}
			}
			if( val.length === 7){
				return {oneVal, fourVal, sevenVal, eightVal : val}
			}
			return {oneVal, fourVal, sevenVal, eightVal}
		}, {}
	);

	const oneValAsArray = oneVal.split('');
	const fourValAsArray = fourVal.split('');
	const sevenValAsArray = sevenVal.split('');
	 
	const zeroSixOrNine = config.filter(val=> val.length === 6);
	const {zeroVal, sixVal, nineVal} = zeroSixOrNine.reduce(
		({zeroVal, sixVal, nineVal}, val) => {
			const valAsArray = val.split('');
			const valDiffOne = common.diff(valAsArray, oneValAsArray);
			if( valDiffOne.length === valAsArray.length - 1 ){
				return {zeroVal, sixVal : val, nineVal}
			}
			const valDiffFour = common.diff(valAsArray, fourValAsArray);
			if( valDiffFour.length === 2 ){
				return {zeroVal, sixVal, nineVal : val}
			}
			return {zeroVal : val, sixVal, nineVal}
		}, {}
	);

	const nineValAsArray = nineVal.split('');

	const twoThreeOrFive = config.filter(val => val.length === 5);
	const {twoVal, threeVal, fiveVal} = twoThreeOrFive.reduce(
		({twoVal, threeVal, fiveVal}, val) => {
			const valAsArray = val.split('');
			const valDiffSeven = common.diff(valAsArray, sevenValAsArray);
			if( valDiffSeven.length === 2 ){
				return {twoVal, threeVal : val, fiveVal}
			}
			const valDiffNine = common.diff(valAsArray, nineValAsArray);
			if( valDiffNine.length === 1 ){
				return {twoVal : val, threeVal, fiveVal}
			}
			return {twoVal, threeVal, fiveVal : val}
		}, {}
	)

	const digitStrings = [zeroVal, oneVal, twoVal, threeVal, fourVal, fiveVal, sixVal, sevenVal, eightVal, nineVal];

	const displayMap = digitStrings.reduce(
		(displayMap, displayString, i) =>{
			const normalisedKey = sortString(displayString);
			displayMap[normalisedKey] = i.toString();
			return displayMap;
		}, {})

	const displayValString = display.map(val =>{
		const normalisedKey = sortString(val);
		return displayMap[normalisedKey];
	}).join('');

	//console.log({displayMap, display, displayValString});
	return parseInt(displayValString)
}

function solution(data){
	return data.reduce((sum, line) => sum + decodeOutputValue(line), 0 );
}
function prepareInput(inputData){
	return inputData.split('\n').map(
		line => line.trim().split('|').map(
			val => val.split(' ').filter(val => val != '')
			)
		);
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function readPrepareAndSolve(filename){
	const fileData = readFile(filename);
	const inputData = prepareInput(fileData);
	const result = solution(inputData);
	return result;
}