const { strict } = require('assert');
const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);

const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	return data.map(line=>doMath(line)).reduce((total, val)=>total+parseInt(val), 0);
}
function doMath(str_in){
	let mathString = str_in;
	while( mathString.indexOf('(') > -1 ){
		let subMathStart = mathString.indexOf('(');
		let subMathEnd = subMathStart + getParenthesisScope(mathString.slice(subMathStart));
		let subMathString = mathString.slice(subMathStart+1, subMathEnd);
		let subMathResult = doMath(subMathString);
		mathString = `${mathString.slice(0, subMathStart)} ${subMathResult} ${mathString.slice(subMathEnd+1)}`;
	}
	let expressionArray = mathString.split(' ').filter(val=>val!=='');
	for(let i=0; i<expressionArray.length; i++){
		if(expressionArray[i+1]==='+'){
			const additionResult = parseInt(expressionArray[i]) + parseInt(expressionArray[i+2]);
			expressionArray.splice(i, 3, additionResult.toString());
			i--;
		}
	}
	const { result } = expressionArray.reduce(({result, mode}, val)=>{
		if( val === '+' || val === '*'){
			return { result, mode : val }
		} else {
			if( mode === '+' ){
				return { result : result + parseInt(val,10), mode }
			} else if ( mode === '*'){
				return { result : result * parseInt(val,10), mode }
			} else {
				return { result : parseInt(val), mode}
			}
		}
	}, 0)
	return result.toString()
}
function getParenthesisScope(str_in){
	//console.log(`Scoping: ${str_in}`);
	let openBr = 1;
	let pos = 1;
	while( openBr > 0 ){
		if(str_in.charAt(pos) === '(' ){
			openBr++;
		} else if (str_in.charAt(pos) === ')'){
			openBr--;
		}
		pos++
	}
	return pos;
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.split('\n').map(line=>line.trim());
}