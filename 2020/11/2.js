const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
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
					nextRound[i].push(countVisibleOccupiedSeats(thisRound, i, j) > 4 ? 'L' : '#');
				} else if( thisRound[i][j] === 'L' ){
					nextRound[i].push(countVisibleOccupiedSeats(thisRound, i, j) === 0 ? '#' : 'L');
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

function countVisibleOccupiedSeats(grid, rowNum, colNum){
	let visibleSeats = 0;
	visibleSeats += getFirstVisibleSeat(grid, rowNum, colNum, -1, -1) === '#' ? 1 : 0; // NW
	visibleSeats += getFirstVisibleSeat(grid, rowNum, colNum, -1, 0) === '#' ? 1 : 0; // N
	visibleSeats += getFirstVisibleSeat(grid, rowNum, colNum, -1, +1) === '#' ? 1 : 0; // NE
	visibleSeats += getFirstVisibleSeat(grid, rowNum, colNum, 0, -1) === '#' ? 1 : 0; // W
	visibleSeats += getFirstVisibleSeat(grid, rowNum, colNum, 0, 1) === '#' ? 1 : 0; // E
	visibleSeats += getFirstVisibleSeat(grid, rowNum, colNum, 1, -1) === '#' ? 1 : 0; // SW
	visibleSeats += getFirstVisibleSeat(grid, rowNum, colNum, 1, 0) === '#' ? 1 : 0; // S
	visibleSeats += getFirstVisibleSeat(grid, rowNum, colNum, 1, 1) === '#' ? 1 : 0; // SE
	return visibleSeats;
}
function getFirstVisibleSeat(grid, rowStart, colStart, rowStep, colStep){
	let rowPosition = rowStart + rowStep;
	let colPosition = colStart + colStep;
	let visibleSeat = '';
	while( rowPosition>=0 && rowPosition < grid.length && colPosition>=0 && colPosition < grid[rowPosition].length && visibleSeat === '' ){
		if( grid[rowPosition][colPosition] !== '.' ){
			visibleSeat = grid[rowPosition][colPosition];
		}
		rowPosition += rowStep;
		colPosition += colStep;
	}
	return visibleSeat;
}