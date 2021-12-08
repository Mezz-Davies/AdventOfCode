const fs = require('fs');
const path = require('path');
const IntCode = require('./intCode');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const originalSettings = [0,1,2,3,4];
	const settingsPermutations = permutation(originalSettings);
	for( settings of settingsPermutations ){
		const amps = settings.map(val=>new IntCode(data, [val]));
		let inputVal=0,currentAmp=0;
		while( !amps.every(amp=>amp.complete) ){
			
		}
	}
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.trim().split(',').map(item=>parseInt(item.trim(),10));
}
function permutation(array) {
    function p(array, temp) {
        var i, x;
        if (!array.length) {
            result.push(temp);
        }
        for (i = 0; i < array.length; i++) {
            x = array.splice(i, 1)[0];
            p(array, temp.concat(x));
            array.splice(i, 0, x);
        }
    }
    var result = [];
    p(array, []);
    return result;
}