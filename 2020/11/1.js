const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	// Round 1
	const numOfRounds = 10;
	let thisRound = data;
	let done = false;
	let lastRountFilledSeatNum = 0;
	while( !done ){
		let nextRound = [];
		//console.log(thisRound.map(row=>row.join('')).join('\n'));
		let thisRoundFilledSeatNum = 0
		for(let i=0; i<thisRound.length; i++){
			nextRound.push([]);
			for(let j=0; j<thisRound[i].length; j++){
				if( thisRound[i][j] === '#' ){
					thisRoundFilledSeatNum++;
					nextRound[i].push(countAdjacentSeats(thisRound, i, j) > 3 ? 'L' : '#');
				} else if( thisRound[i][j] === 'L' ){
					nextRound[i].push(countAdjacentSeats(thisRound, i, j) === 0 ? '#' : 'L');
				}else{
					nextRound[i].push(thisRound[i][j]);
				}
			}
		}
		console.log(thisRoundFilledSeatNum);
		thisRound = nextRound;
		if( thisRoundFilledSeatNum === lastRountFilledSeatNum ){
			done = true;
		}
		lastRountFilledSeatNum = thisRoundFilledSeatNum;
	}

	return null;
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'}).trim();
}
function prepareInput(inputData){
	return inputData.split('\n').map(line=>line.trim().split('').map(val=>val === 'L' ? '#' : val));
}

function countAdjacentSeats(grid, rowNum, colNum){
	let adjacentSeats = 0;
	for(let i = (rowNum - 1); i <=rowNum+1; i++){
		if(i>=0 && i < grid.length){
			for(let j = (colNum - 1); j <= colNum+1; j++){
				if( j>=0 && j < grid[rowNum].length){
					if(!(i===rowNum && j===colNum)){
						adjacentSeats += (grid[i][j] === '#' ? 1 : 0)
					}
				}
			}
		}
	}
	return adjacentSeats;
}