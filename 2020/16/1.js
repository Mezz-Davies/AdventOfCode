const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const {fields, yours, nearby} = data;
	const errorVals = nearby.reduce((errorVals, ticket)=>{
		return [
			...errorVals, 
			...ticket.filter(
				val=>fields.every(
					field=>field.ranges.every(
						range=>!(val>=range[0]&&val<=range[1])
					)
				)
			)
		];
	},[]);
	return errorVals.reduce((total, err)=>total+err,0);
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	const inputArray = inputData.split('\n').map(line=>line.trim()).filter(line=>line!=='');
	const yoursLoc = inputArray.indexOf('your ticket:');
	const fields = inputArray.slice(0,yoursLoc).map(field=>processField(field));
	const yours = inputArray[yoursLoc+1];
	const nearby = inputArray.splice(inputArray.indexOf('nearby tickets:')+1, inputArray.length).map(line=>line.trim().split(',').map(val=>parseInt(val)));
	return { fields, yours, nearby };
}
function processField(fieldIn){
	const nameValueSplit = fieldIn.split(':').map(part=>part.trim());
	const name = nameValueSplit[0];
	const values = nameValueSplit[1].split('or').map(part=>part.trim());
	const ranges = values.map(range=>range.split('-').map(val=>parseInt(val)));
	return {name, ranges};
}