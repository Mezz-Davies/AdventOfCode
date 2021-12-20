const fs = require('fs');
const path = require('path');
const common = require('../../common/common');

class Point {
	constructor(x, y, val){
		this.x = x;
		this.y = y;
		this.val = val;
		this.key = `(${this.x},${this.y})`;
		//this.surroundingPointKeys = this.getSurroundingPointKeys();
		//this.surroundingPointKeysIncludingSelf = this.getSurroundingPointKeysIncludingSelf();
	}
	getSurroundingPointKeys(){
		const surround = [];
		for(let i=this.y-1;i<=this.y+1;i++){
			for(let j=this.x-1;j<=this.x+1;j++){
				if(!(i===this.y && j===this.x)){
					surround.push(`(${j},${i})`);
				}
			}
		}
		return surround;
	}
	getSurroundingPointKeysIncludingSelf(){
		const surround = [];
		for(let i=this.y-1;i<=this.y+1;i++){
			for(let j=this.x-1;j<=this.x+1;j++){
				surround.push(`(${j},${i})`);
			}
		}
		return surround;
	}
}

const [ exampleResult, exampleRuntime ] = readPrepareAndSolve('example_input.txt');
console.log(`Example : ${exampleResult} Runtime : ${exampleRuntime}ms`);

const [ solutionResult, solutionRuntime ] = readPrepareAndSolve('input.txt');
console.log(`Solution : ${solutionResult} Runtime : ${solutionRuntime}ms`);


function printImage(inputImage){
	const xVals = [...Object.keys(inputImage).map(key=>inputImage[key].x)];
	const minX = Math.min(...xVals);
	const maxX = Math.max(...xVals);
	const yVals = [...Object.keys(inputImage).map(key=>inputImage[key].y)];
	const minY = Math.min(...yVals);
	const maxY = Math.max(...yVals);

	const imageArray = [];
	for(let i=minY;i<=maxY;i++){
		let row = '';
		for(let j=minX;j<=maxX;j++){
			const key = `(${j},${i})`;
			if(inputImage[key] !== undefined){
				row += inputImage[key].val;
			} else {
				row += ' ';
			}
		}
		imageArray.push(row);
	}
	console.log(imageArray.join('\n'));
}
function getNewPixelValue(imageEnhancement, pixelArray, key){
	const pixelString = pixelArray.map(val=>val==='#'?'1':'0').join('')
	const imageEnhancementPixelLoc = parseInt(pixelString, 2);
	//console.log(key, pixelArray.join(''), pixelString, imageEnhancementPixelLoc);
	return imageEnhancement[imageEnhancementPixelLoc];
}
function runEnhancement(imageEnhancement, inputImage, iterationNumber){
	const inputImageWithPadding = inputImage;
	Object.keys(inputImage).forEach(key=>{
		const surroundingPoints = inputImage[key].getSurroundingPointKeys();
		surroundingPoints.forEach(surroundKey=>{
			if( inputImage[surroundKey] === undefined ){
				const match = surroundKey.match(/\((\-?[\d]+),(\-?[\d]+)\)/);
				if(match===null){
					console.error(`Bad match ${surroundKey}`);
				}
				const x = parseInt(match[1]);
				const y = parseInt(match[2]);
				inputImageWithPadding[surroundKey] = new Point(x, y, '.');
			}
		});
	});
	const nextImage = Object.keys(inputImageWithPadding).reduce((nextImage, pixelKey)=>{
		const pixel = inputImageWithPadding[pixelKey];
		const surroundingPointKeys = pixel.getSurroundingPointKeysIncludingSelf();
		const pixelValueArray = surroundingPointKeys.map(key=>{
			if(inputImage[key] !== undefined){
				return inputImage[key].val;
			} else {
				return '.'
			}
		});
		const newPixelValue = getNewPixelValue(imageEnhancement, pixelValueArray, pixelKey);
		if(newPixelValue === '#'){
			const newPixel = new Point(pixel.x, pixel.y, newPixelValue);
			nextImage[newPixel.key] = newPixel;
		}
		return nextImage;
	}, {});

	return nextImage;
}

function solution(data){
	const testPixel = new Point(0, 0, 1);
	const [imageEnhancement, startingImage] = data;
	//printImage(startingImage);
	const imageAfter1Enhancement = runEnhancement(imageEnhancement, startingImage);
	//console.log('----------');
	printImage(imageAfter1Enhancement);
	const imageAfter2Enhancement = runEnhancement(imageEnhancement, imageAfter1Enhancement);
	console.log('----------');
	printImage(imageAfter2Enhancement);

	return Object.keys(imageAfter2Enhancement).filter(key=>imageAfter2Enhancement[key].val==='#').length;
}
function prepareInput(inputData){
	const [imageEnhancement, inputImage] = inputData.split('\r\n\r\n').map(section=>section.trim());
	const imageEnhancementArray = imageEnhancement.split('').map(val=>val.trim());
	const inputImagePoints = inputImage.split('\n').map(
		(line, y)=>line.split('').map((val, x)=>{
			const trimmedVal = val.trim();
			if(trimmedVal === '#'){
				return new Point(x, y, val.trim())
			} else {
				return null;
			}
		})
	);
	const inputImageLookup = inputImagePoints.reduce((lookup, row)=>{
		row.forEach(point=>{
			if(point !== null){
				lookup[point.key] = point
			}
		});
		return lookup;
	}, {});
	return [imageEnhancementArray, inputImageLookup];
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function readPrepareAndSolve(filename){
	const fileData = readFile(filename);
	const startTime = Date.now();
	const inputData = prepareInput(fileData);
	const result = solution(inputData);
	const runtime = Date.now() - startTime;
	return [result, runtime];
}