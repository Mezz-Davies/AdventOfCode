const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const tileCoords = data.map(
		commandsToTile=>commandsToTile.reduce(({x,y}, command)=>{
			switch(command){
				case 'nw':
					return {x : x + 0.5, y : y + 1};
				case 'ne':
					return {x : x - 0.5, y : y + 1};
				case 'e':
					return {x : x - 1, y};
				case 'se':
					return {x : x - 0.5, y : y - 1};
				case 'sw':
					return {x : x + 0.5, y : y - 1};
				case 'w':
					return {x : x + 1, y : y};
				default:
					throw new Error(`Unknown command ${command}`);
			}
		}, {x:0, y:0})
	);
	const flipCount = tileCoords.reduce((lookup, tile)=>{
		const tileCoordString = JSON.stringify(tile);
		lookup[tileCoordString] = ( lookup[tileCoordString] || 0 ) + 1;
		return lookup;
	}, {});
	console.log(flipCount);
	return Object.keys(flipCount).filter(tileCoord=>flipCount[tileCoord] % 2 === 1).length;
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.split('\n').map(line=>line.trim().split('').reduce(([directions, prefix], char)=>{
		if(char === 'n' || char === 's'){
			prefix.push(char);
		} else {
			directions.push([prefix.shift(), char].join(''));
		}
		return [ directions, prefix ];
	}, [[],[]]).shift()
	);
}