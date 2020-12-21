const fs = require('fs');
const path = require('path');

function encodeBorder(border){
	return parseInt( border.map(char=>char==='#'?'1':'0').join(''),2);
}
class ImageTile {
	constructor(id, imageData=[]){
		this.id=id,
		this.orientation = 0;
		this.hasLeftRightFlipped = false;
		this.hasUpDownFlipped = false;
		this.up = '';
		this.right = '';
		this.down = '';
		this.left = '';
		this.imageData = imageData;
		this.generateBorders();
		this.generateBorderOptions();
	}
	rotateClockwise90(){
		const { up, right, down, left } = Object.assign({}, this);
		console.log(this.imageData.map(line=>line.join('')).join('\n'));
		console.log('\n');
		this.imageData = this.imageData[0].map((_, colIndex, arr)=>this.imageData.map(row=>row[arr.length - (colIndex+1)])).reverse();
		console.log(this.imageData.map(line=>line.join('')).join('\n'));
		this.orientation = (this.orientation + 90) % 360;
		this.up = left;
		this.right = up;
		this.down = right;
		this.left = down;
		this.generateBorders();
		this.generateBorderOptions();
	}
	flipUpDown(){
		const { up, down } = Object.assign({}, this);
		this.imageData.reverse();
		this.generateBorders();
		this.generateBorderOptions();
		this.up = down;
		this.down = up;
		this.hasUpDownFlipped = !this.hasUpDownFlipped;
	}
	flipLeftRight(){
		const { right, left } = Object.assign({}, this);
		this.imageData = this.imageData.map(line=>{
			const lineCopy = line.slice()
			lineCopy.reverse();
			return lineCopy;
		});
		this.generateBorders();
		this.generateBorderOptions();
		this.right = left;
		this.left = right;
		this.hasLeftRightFlipped = !this.hasLeftRightFlipped;		
	}
	getBorders(){
		return {
			top : encodeBorder(this.topBorder),
			right : encodeBorder(this.rightBorder),
			bottom : encodeBorder(this.bottomBorder),
			left : encodeBorder(this.leftBorder)
		}
	}
	generateBorders(){
		this.topBorder = [ ...this.imageData[0]];
		this.rightBorder = this.imageData.map(line=>line[line.length-1]);
		this.bottomBorder = [ ...this.imageData[this.imageData.length-1]] || [];
		this.leftBorder = this.imageData.map(line=>line[0]);
	}
	generateBorderOptions(){
		this.options = [
			encodeBorder(this.topBorder),
			encodeBorder(this.rightBorder),
			encodeBorder(this.bottomBorder),
			encodeBorder(this.leftBorder),
			encodeBorder([ ...this.topBorder].reverse()),
			encodeBorder([ ...this.rightBorder].reverse()),
			encodeBorder([ ...this.bottomBorder].reverse()),
			encodeBorder([ ...this.leftBorder].reverse()),
		]
	}
	alignTileToValOnLeft(encodedBorder){
		let locInOptions = this.options.indexOf(encodedBorder);
		console.log('alignLeft!', locInOptions, encodedBorder);
		switch(locInOptions){
			case 0:
				this.flipUpDown();
				this.rotateClockwise90();
				break;
			case 1:
				this.flipLeftRight();
				break;
			case 2:
				this.rotateClockwise90();
				break;
			case 3:
				break;
			case 4:
				this.rotateClockwise90();
				this.rotateClockwise90();
				this.rotateClockwise90();
				break;
			case 5:
				this.rotateClockwise90();
				this.rotateClockwise90();
				break;
			case 6:
				this.flipLeftRight();
				this.rotateClockwise90();
				break;
			case 7:
				this.flipUpDown();
				break;
			default:
				console.log(this);
				throw new Error(`Unknown Case! ${locInOptions}`);
		}
	}
	alignTileToValOnBottom(encodedBorder){
		let locInOptions = this.options.indexOf(encodedBorder);
		switch(locInOptions){
			case 0:
				this.flipUpDown();
				break;
			case 1:
				this.rotateClockwise90();
				this.flipLeftRight();
				break;
			case 2:
				break;
			case 3:
				this.rotateClockwise90();
				this.rotateClockwise90();
				this.rotateClockwise90();
				break;
			case 4:
				this.rotateClockwise90();
				this.rotateClockwise90();
				break;
			case 5:
				this.rotateClockwise90();
				break;
			case 6:
				this.flipLeftRight();
				break;
			case 7:
				this.flipLeftRight();
				this.rotateClockwise90();
				break;
			default:
				throw new Error(`Unknown Case! ${locInOptions}`);
		}
	}
}

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
/*
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);
*/

function solution(data){
	const squareEdgeLength = Math.sqrt(Object.keys(data).length);
	const tileSet = Object.keys(data).map(id=>new ImageTile(id, data[id]));
	const checkArray = [];
	for( let i=0; i<tileSet.length; i++){
		let tileArrangementOptions = tileSet[i].options;
		for( let option of tileArrangementOptions ){
			checkArray.push(option)
		}
	}
	for( let i=0; i<tileSet.length; i++){
		const tileA = tileSet[i];
		const {top, left, bottom, right} = tileA.getBorders();
		for( let j=0; j<tileSet.length; j++){
			if( i !== j ){
				const tileB = tileSet[j];
				if(tileB.options.includes(top)){
					tileA.up = tileB.id;
				} else if( tileB.options.includes(left)){
					tileA.left = tileB.id;
				} else if( tileB.options.includes(bottom)){
					tileA.down = tileB.id;
				} else if( tileB.options.includes(right)){
					tileA.right = tileB.id;
				}
			}	
		}
	}
	const startCorner = tileSet.filter(
		tile=>[tile.up==='',tile.right==='',tile.left==='',tile.down===''].filter(val=>val).length === 2
	).pop();
	const tileSetMap = tileSet.reduce((map, tile)=>Object.assign(map, {[tile.id]:tile}), {});
	const grid = [];
	while(startCorner.down===''){
		startCorner.rotateClockwise90();
	}
	let rowStartTile = startCorner;
	let rowNum = 0;
	while( rowStartTile ){
		//console.log(++rowNum);
		const thisRow = [];
		let thisTile = rowStartTile;
		if( thisTile.right === '' ){
			thisTile.flipLeftRight();
		}
		let tileNum = 0;
		while( thisTile ){
			//console.log(++tileNum);
			const { id, options } = thisTile;
			console.log({ id, options });
			thisRow.push(thisTile.id);
			if(tileSetMap[thisTile.right]){
				tileSetMap[thisTile.right].alignTileToValOnLeft(encodeBorder(thisTile.rightBorder));
			}
			thisTile = tileSetMap[thisTile.right];
		}
		if(tileSetMap[rowStartTile.down]){
			tileSetMap[rowStartTile.down].alignTileToValOnBottom(encodeBorder(rowStartTile.bottomBorder));
		}
		grid.push(thisRow);
		rowStartTile = tileSetMap[rowStartTile.downTile]
	}
	//console.log(grid);
	const transformedGrid = [];
	for(let i=0; i<grid.length;i++){
		const transformedRow = [];
		for( let j=0; j<grid[i].length; j++){
			transformedRow.push(tileSetMap[grid[i][j]].imageData.map(line=>line.join('')));
		}
		const joinedRow = transformedRow.reduce((joinedArray, tileToAdd)=>{
			if(!joinedArray){
				return tileToAdd;
			}
			return joinedArray.map((val, index)=>val+' '+tileToAdd[index]);
		})
		transformedGrid.push(joinedRow.join('\n'));
	}
	console.log(transformedGrid.join('\n\n'));
	return 0 //corners.map(id=>parseInt(id)).reduce((prod, idAsInt)=>prod*idAsInt, 1);
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.split('Tile ').filter(tile=>tile!=='').map(
		tile=>{
			const [id, rawdata] = tile.trim().split(':');
			const data = rawdata.trim().split('\n').map(line=>line.trim().split(''));
			return { id, data }
		}
	).reduce((obj, tile)=> Object.assign({...obj, [tile.id]:tile.data}), {});
}