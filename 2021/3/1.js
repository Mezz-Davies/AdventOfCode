const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);

const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);


function solution(data){
	countDict = {};
	for( i=0; i<data.length;i++){
		const value=data[i];
		for(j=0;j<value.length;j++){
			const bitValue = value[j]
			countDict[j] = countDict[j] !== undefined ? countDict[j] : {}; 
			countDict[j][bitValue] = countDict[j][bitValue] !== undefined ? countDict[j][bitValue] + 1 : 1;
		}
	}

	const {gamma, epsilon} = Object.keys(countDict).reduce(({gamma, epsilon}, loc)=>{
		const zeroCount = countDict[loc]['0'];
		const oneCount = countDict[loc]['1'];
		if(zeroCount > oneCount ){
			return { gamma: gamma + '0', epsilon: epsilon + '1'}
		} else {
			return { gamma: gamma + '1', epsilon: epsilon + '0'}
		}
	}, {gamma : '', epsilon: ''})

	const [gammaInt, epsilonInt] = [parseInt(gamma,2), parseInt(epsilon,2)]

	return gammaInt * epsilonInt;
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.split('\n').map(line=>line.trim());
}