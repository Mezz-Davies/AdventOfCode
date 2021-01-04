const fs = require('fs');
const path = require('path');

class Tile {
	constructor(x,y,isBlack=false){
		this.x=x;
		this.y=y;
		this.isBlack=isBlack;
	}
	makeNeighbourTiles(){
		const neighbours = [];
		for( let y=this.y-1; y<=this.y+1; y++ ){
			for(let xMod=-1; xMod<=1; xMod++){
				if( !(xMod === 0)){
					neighbours.push( new Tile( y===this.y ? this.x+xMod : this.x+(xMod/2), y, 0) );
				}
			}
		}
		return neighbours;
	}
	isNeighbour(tile){
		const yDiff = Math.abs(this.y - tile.y);
		const xDiff = Math.abs(this.x - tile.x);
		if(yDiff === 0 ){
			return xDiff === 1;
		} else if (yDiff === 1){
			return xDiff === 0.5;
		} else {
			return false;
		}
	}
	isEqual(tile){
		return this.x === tile.x && this.y === tile.y;
	}
}

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
	const startState = Object.keys(flipCount).filter(tileCoord=>flipCount[tileCoord] % 2 === 1).map(coordString=>{
		const {x,y} = JSON.parse(coordString);
		return new Tile(x,y,true);
	});
	console.log(startState);
	let moveCount = 1;
	let state = startState;
	while( moveCount <= 100 ){
		const stateSpace = state.reduce((searchSpace, tile)=>{
			const tileNeighbours = tile.makeNeighbourTiles().filter(neighbour=>!searchSpace.some(searchSpaceTile=>searchSpaceTile.isEqual(neighbour)));
			return [ ...searchSpace, ...tileNeighbours];
		}, [...state]);
		const stateSpaceWithChanges = stateSpace.map((tile, _, arr)=>{
			const tileNeighboursInSpace = arr.filter(possibleNeighbour=>tile.isNeighbour(possibleNeighbour));
			const numBlackNeighbourTiles = tileNeighboursInSpace.filter(tile=>tile.isBlack).length;
			if(tile.isBlack){
				const nextState = numBlackNeighbourTiles > 0 && numBlackNeighbourTiles <= 2;
				return new Tile(tile.x, tile.y, nextState );
			} else {
				return new Tile(tile.x, tile.y, numBlackNeighbourTiles === 2 );
			}
		});
		state = stateSpaceWithChanges.filter(tile=>tile.isBlack);
		if( moveCount % 10 === 0){
			console.log( `Day ${moveCount}: ${state.length} Black Tiles`);
		}
		moveCount++;
	}
	return state.length;
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