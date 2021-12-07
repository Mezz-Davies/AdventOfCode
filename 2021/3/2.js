const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);

const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function countZerosAndOnesAtLoc(arr, loc){
	const {zeroCount, oneCount} = arr.reduce(({zeroCount, oneCount}, value) => {
		return {
			zeroCount : zeroCount + (value[loc] === '0' ? 1 : 0),
			oneCount : oneCount + (value[loc] === '1' ? 1 : 0)
		}
	}, {zeroCount : 0, oneCount : 0});
	return {zeroCount, oneCount}
}
function solution(data){
	let n = 0
	let oxygenRatingCandidates = [...data]
	while(oxygenRatingCandidates.length > 1){
		const {zeroCount, oneCount} = countZerosAndOnesAtLoc(oxygenRatingCandidates, n);
		if( zeroCount > oneCount ){
			oxygenRatingCandidates = oxygenRatingCandidates.filter(val => val[n] === '0');
		} else {
			oxygenRatingCandidates = oxygenRatingCandidates.filter(val => val[n] === '1');
		}
		n += 1;
	}
	const [oxygenRating] = oxygenRatingCandidates;
	const oxygenRatingInt = parseInt(oxygenRating, 2);

	n = 0
	let co2RatingCandidates = [...data]
	while(co2RatingCandidates.length > 1){
		const {zeroCount, oneCount} = countZerosAndOnesAtLoc(co2RatingCandidates, n);
		if( zeroCount <= oneCount ){
			co2RatingCandidates = co2RatingCandidates.filter(val => val[n] === '0');
		} else {
			co2RatingCandidates = co2RatingCandidates.filter(val => val[n] === '1');
		}
		n += 1;
	}
	const [co2Rating] = co2RatingCandidates;
	const co2RatingInt = parseInt(co2Rating, 2);

	return oxygenRatingInt * co2RatingInt;
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.split('\n').map(line=>line.trim());
}