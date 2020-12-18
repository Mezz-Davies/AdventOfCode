const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	let currentMask = '';
	const memory = {};
	data.forEach(command => {
		if( command[0] === 'mask' ){
			currentMask = command[1];
		} else {
			const memLocationStart = command[0].indexOf('[');
			const memLocationEnd = command[0].indexOf(']');
			const memLocation = command[0].substr(memLocationStart+1,memLocationEnd-1);
			const addressesToWrite = getMaskMemoryLocations(memLocation, currentMask);
			addressesToWrite.forEach(address=>{
				memory[address] = parseInt(command[1],10);
			})
		}
	});
	//console.log(memory);
	return Object.keys(memory).reduce((total, currentKey)=>total+memory[currentKey], 0);
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.split('\n').map(line=>line.trim().split('=').map(part=>part.trim()));
}
function getMaskMemoryLocations(value, mask){
	const valAsBinaryArray = parseInt(value,10).toString(2).padStart(36, '0').split('');
	const floatingBitLocations = [];
	const valAfterMaskArray = valAsBinaryArray.map((char, index)=>{
		const maskVal = mask.charAt(index);
		if( maskVal === 'X'){
			floatingBitLocations.push(index);
			return maskVal;
		} else if( maskVal === '1'){
			return maskVal;
		} else {
			return char;
		}
	});
	if( floatingBitLocations.length === 0 ){
		return [ valAfterMaskArray.join('') ];
	}
	const floatingBitMap = floatingBitLocations.reduce((map, val, index)=>{ 
		map[val.toString()]=index;
		return map},{});
	const maxVal = parseInt('1'.repeat(floatingBitLocations.length),2)+1;
	const output = [];
	//console.log(floatingBitMap, maxVal);
	for(let i = 0; i<maxVal; i++ ){
		const currentBinaryValue = i.toString(2).padStart(floatingBitLocations.length, '0');
		output.push( parseInt([...valAfterMaskArray].map((char, index)=>{
			if(floatingBitMap.hasOwnProperty(index.toString())){
				return currentBinaryValue.charAt(floatingBitMap[index.toString()]);
			} else {
				return char;
			}
		}).join(''),2) );
	}
	return output;
}