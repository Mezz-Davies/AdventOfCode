const fs = require('fs');
const path = require('path');
const Tile = require('./Tile');

const seaMonster = readFile('seaMonster.txt').split('\n');
const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);

const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const tiles = data.map(
		({id, data})=>({id, tile: new Tile(id, data)}))
	.reduce(
		(obj, {id, tile})=>Object.assign(obj, {[id]:tile}), {}
	);
	
	const tileIdsSearchList = [Object.keys(tiles).shift()];
	while(tileIdsSearchList.length > 0){
		const currentTileId = tileIdsSearchList.shift();
		const currentTile = tiles[currentTileId];
		const borders = currentTile.getBorderOptions();
		const { id } = currentTile;
		if( currentTile.up === '' ){
			const { top } = borders;
			const topNeighbour = tiles[getIdOfNeighbourWithBorder(tiles, id, top)];
			if( topNeighbour ){
				topNeighbour.alignSideToVal('bottom', top);
				tileIdsSearchList.push(topNeighbour.id);
				currentTile.linkTo(topNeighbour);
			}	
		}
		if( currentTile.right === ''){
			const { right } = borders;
			const rightNeighbour = tiles[getIdOfNeighbourWithBorder(tiles, id, right)];
			if( rightNeighbour ){
				rightNeighbour.alignSideToVal('left', right);
				tileIdsSearchList.push(rightNeighbour.id);
				currentTile.linkTo(rightNeighbour);
			}
		}
		if( currentTile.left === ''){
			const { left } = borders;
			const leftNeighbour = tiles[getIdOfNeighbourWithBorder(tiles, id, left)];
			if( leftNeighbour ){
				leftNeighbour.alignSideToVal('right', left);
				tileIdsSearchList.push(leftNeighbour.id);
				currentTile.linkTo(leftNeighbour);
			}
		}
		if( currentTile.down === ''){
			const { bottom } = borders;
			const downNeighbour = tiles[getIdOfNeighbourWithBorder(tiles, id, bottom)];
			if( downNeighbour ){
				downNeighbour.alignSideToVal('top', bottom);
				tileIdsSearchList.push(downNeighbour.id);
				currentTile.linkTo(downNeighbour);
			}
		}
	}
	let starterTile = tiles[Object.keys(tiles).shift()];
	while( starterTile.up !== '' ){
		starterTile = tiles[starterTile.up];
	}
	while( starterTile.right !== ''){
		starterTile = tiles[starterTile.right];
	}
	const grid = [];
	let rowStartTile = starterTile;
	while(rowStartTile){
		const gridRow = [ rowStartTile.id ];
		let currentTile = rowStartTile;
		while( currentTile.left !== '' ){
			gridRow.push(currentTile.left);
			currentTile = tiles[currentTile.left];
		}
		rowStartTile = tiles[rowStartTile.down];
		grid.push(gridRow);
	}
	const assembledMap = `\n${grid.map(
		line=>{
			const output = [];
			const tilesInLine = line.map(tileId=>{
				tiles[tileId].flipX();
				return tiles[tileId];
			});
			/*
			// To Show with borders and gaps
			for(let i=0; i<tilesInLine[0].data.length; i++){
				output.push(tilesInLine.map(tile=>tile.data[i].join('')).join(' '));
			}
			return output.join('\n');
			*/
			for(let i=1; i<tilesInLine[0].data.length-1; i++){
				output.push(tilesInLine.map(tile=>tile.data[i].slice(1,-1).join('')).join(''));
			}
			return output.join('\n');
		}
	).join('\n')}`;
	const mapTile = new Tile('map', assembledMap.trim().split('\n').map(line=>line.trim().split('')));
	let seaMonsterCount = countSeaMonsters(mapTile.data), iterationCount = 0;
	console.log(countSeaMonsters(mapTile.data));
	while( seaMonsterCount < 1 ){
		if( iterationCount > 100 ){
			break;
		}
		console.log(iterationCount++, seaMonsterCount);
		if( iterationCount % 8 === 0 ){
			mapTile.flipX();
		} else if( iterationCount % 4 === 0){
			mapTile.flipY();
		} else {
			mapTile.rotateClockwise90();
		}
		seaMonsterCount = countSeaMonsters(mapTile.data);
	}
	console.log(seaMonsterCount);
	console.log(mapTile.toString());
	return mapTile.data.reduce((hashCount, line)=>hashCount + line.filter(char=>char==='#').length, 0);
}
function getIdOfNeighbourWithBorder(tileSet, id, val){
	return Object.keys(tileSet).filter(tileId=>
		tileId !== id && Object.values(tileSet[tileId].getBorderOptions()).indexOf(val) > -1
	).shift();
}
function countSeaMonsters(image_array){
	const seaMonsterPoints = seaMonster.map((line, y)=>{
		const res = [];
		for(let x=0; x<line.length; x++){
			if(line.charAt(x) === '#'){
				res.push([x, y]);
			}
		}
		return res;
	}).flat();
	const [maxX, maxY] = seaMonsterPoints.reduce(([maxX, maxY], point)=>{
		return [
			point[0] > maxX ? point[0] : maxX, 
			point[1] > maxY ? point[1] : maxY
		];
	}, [0,0]);
	let seaMonsterCount = 0;
	for( let i=0; i<image_array.length-maxX; i++){
		for( let j=0; j<image_array[i].length-maxY; j++){
			if( seaMonsterPoints.every(([x,y])=>image_array[i+x][j+y]==='#') ){
				seaMonsterCount++;
				for(let k=0; k<seaMonsterPoints.length; k++){
					const [x, y] = seaMonsterPoints[k];
					image_array[i+x][j+y]='O'
				}
			}
		}
	}
	return seaMonsterCount;
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData
		.split('Tile')
		.map(part=>part.trim())
		.filter(part=>part!=='')
		.map(
			part=>{
				const [id, unprocessed] = part.split(':').map(part=>part.trim());
				const data = unprocessed.split('\n').map(line=>line.trim().split(''))
				return { id, data };
			}
		);
}