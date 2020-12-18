const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);

const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const {fields, yours, nearby} = data;
	const validTickets = nearby.filter(ticket=>
		ticket.filter(
			val=>fields.every(
				field=>field.ranges.every(
					range=>!(val>=range[0]&&val<=range[1])
				)
			)
		).length === 0
	);
	const allocatedIndexes = [];
	const fieldsWithIndexes = fields.reduce(
		(fieldsValidIndexes,field)=>{
			// Iterate by column
			const fieldValidIndexes = [];
			for(let col=0; col<yours.length;col++){
					const colsOfValid = validTickets.map(ticket=>ticket[col]);
					if( valIsValid(yours[col], field) && colsOfValid.every(ticketVal=>valIsValid(ticketVal,field))){
						fieldValidIndexes.push(col);
					}
			}
			fieldsValidIndexes.push({...field, indexes: fieldValidIndexes});
			return fieldsValidIndexes;
		}, []
	)
	.sort((a,b)=>a.indexes.length-b.indexes.length)
	.map(field=>{
		const validIndex = field.indexes.filter(index=>!allocatedIndexes.includes(index))[0];
		allocatedIndexes.push(validIndex);
		return {...field, index : validIndex};
	});
	console.log(fieldsWithIndexes);
	const yoursFields = fieldsWithIndexes.reduce((obj, field)=>Object.assign(obj, {[field.name]:yours[field.index]}),{});
	console.log(yoursFields);
	return fieldsWithIndexes.filter(field=>field.name.indexOf('departure')>-1).reduce((product, field)=>product*yours[field.index],1);
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	const inputArray = inputData.split('\n').map(line=>line.trim()).filter(line=>line!=='');
	const yoursLoc = inputArray.indexOf('your ticket:');
	const fields = inputArray.slice(0,yoursLoc).map(field=>processField(field));
	const yours = inputArray[yoursLoc+1].trim().split(',').map(val=>parseInt(val));
	const nearby = inputArray.splice(inputArray.indexOf('nearby tickets:')+1, inputArray.length).map(line=>line.trim().split(',').map(val=>parseInt(val)));
	return { fields, yours, nearby };
}
function valIsValid(val, field){
	return field.ranges.some(
		range=>val>=range[0]&&val<=range[1]
	);
}
function processField(fieldIn){
	const nameValueSplit = fieldIn.split(':').map(part=>part.trim());
	const name = nameValueSplit[0];
	const values = nameValueSplit[1].split('or').map(part=>part.trim());
	const ranges = values.map(range=>range.split('-').map(val=>parseInt(val)));
	return {name, ranges};
}