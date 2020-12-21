const fs = require('fs');
const { parse } = require('path');
const path = require('path');

function encodeBorder(border){
	return parseInt(border.map(char=>char==='#'? 1 : 0).join(''),2);
}
class ImageTile {
	constructor(id, imageData=[]){
		this.id=id,
		this.orientation = 0;
		this.topBorder = imageData[0];
		this.leftBorder = imageData.map(line=>line[line.length-1]);
		this.bottomBorder = imageData[imageData.length-1] || [];
		this.rightBorder = imageData.map(line=>line[0]);
	}
	rotateClockwise90(){
		const { topBorder, leftBorder, bottomBorder, rightBorder } = Object.assign({}, this);
		this.topBorder = rightBorder;
		this.leftBorder = topBorder;
		this.bottomBorder = leftBorder;
		this.rightBorder = bottomBorder;
		this.orientation = (this.orientation + 90) % 360;
	}
	flipUpDown(){
		const { topBorder, bottomBorder } = Object.assign({}, this);
		this.topBorder = bottomBorder;
		this.bottomBorder = topBorder;
		this.leftBorder.reverse();
		this.rightBorder.reverse();
	}
	flipLeftRight(){
		const { leftBorder, rightBorder } = Object.assign({}, this);
		this.leftBorder = rightBorder;
		this.rightBorder = leftBorder;
		this.topBorder.reverse();
		this.bottomBorder.reverse();
	}
	getBorders(){
		return {
			top : encodeBorder(this.topBorder),
			left : encodeBorder(this.leftBorder),
			bottom : encodeBorder(this.bottomBorder),
			right : encodeBorder(this.rightBorder)
		}
	}
	getBorderArray(){
		return [
			encodeBorder(this.topBorder),
			encodeBorder(this.leftBorder),
			encodeBorder(this.bottomBorder),
			encodeBorder(this.rightBorder)
		]
	}
	getAllBorderOptions(){
		return [
			encodeBorder(this.topBorder),
			encodeBorder(this.leftBorder),
			encodeBorder(this.bottomBorder),
			encodeBorder(this.rightBorder),
			encodeBorder([ ...this.topBorder].reverse()),
			encodeBorder([ ...this.leftBorder].reverse()),
			encodeBorder([ ...this.bottomBorder].reverse()),
			encodeBorder([ ...this.rightBorder].reverse()),
		]
	}
}

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const squareEdgeLength = Math.sqrt(Object.keys(data).length);
	const tileSet = Object.keys(data).map(id=>new ImageTile(id, data[id]));
	const checkArray = [];
	for( let i=0; i<tileSet.length; i++){
		let tileArrangementOptions = tileSet[i].getAllBorderOptions();
		for( let option of tileArrangementOptions ){
			checkArray.push(option)
		}
	}
	const corners = [];
	const edges = [];
	const rest = [];
	for( let i=0; i<tileSet.length; i++){
		const tileOptions = tileSet[i].getAllBorderOptions();
		const occuranceCount = tileOptions.map(option=>checkArray.reduce((count,check)=>check === option ? count + 1 : count, 0));
		if( occuranceCount.filter(count=>count < 2).length == 4 ){
			corners.push(tileSet[i].id);
		}
	}
	return corners.map(id=>parseInt(id)).reduce((prod, idAsInt)=>prod*idAsInt, 1);
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