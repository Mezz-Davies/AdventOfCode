const fs = require('fs');
const path = require('path');
const common = require('../../common/common');

const [ exampleResult, exampleRuntime ] = readPrepareAndSolve('example_input.txt');
console.log(`Example : ${exampleResult}. Runtime : ${exampleRuntime}ms`);

const [ solutionResult, solutionRuntime ] = readPrepareAndSolve('input.txt');
console.log(`Solution : ${solutionResult}. Runtime : ${solutionRuntime}ms`);


function foldDotsAlong(dots, axis, value){
	//console.log({dots, axis, value});
	return dots.map(([dotX, dotY])=>{
		if(axis === 'x'){
			if(dotX > value){
				const distanceFromLine = dotX - value;
				return [value - distanceFromLine, dotY];
			}
			return [dotX, dotY];
		}
		else if( axis === 'y' ){
			if(dotY > value){
				const distanceFromLine = dotY - value;
				return [dotX, value - distanceFromLine];
			}
			return [dotX, dotY];
		}
	})
}

function printGrid(dots){
	const maxX = Math.max(...dots.map(([x, y]) => x))
	const maxY = Math.max(...dots.map(([x, y]) => y))

	const completeDotArray = [];
	for(let i=0; i<=maxY; i++){
		const row = [];
		for(let j=0; j<=maxX; j++){
			row.push(['.']);
		}
		completeDotArray.push(row);
	}

	dots.forEach(([x, y])=>{
		completeDotArray[y][x] = '#';
	});

	const completeDotArrayAsString = completeDotArray.map(
		row => row.join('')
	).join('\n');
	const fillerRow = new Array(maxX+1).fill('.').join('');

	console.log(fillerRow)
	console.log(completeDotArrayAsString);
	console.log(fillerRow)

}
function solution(data){
	const [dots, foldInstructions] = data;
	const finalState = foldInstructions.reduce((state, instructions, i)=>{
		const {axis, value} = instructions;
		const nextState = foldDotsAlong(state, axis, value)
		const {nextStateUnique} = nextState.reduce(({nextStateUnique, nextStateLookup}, dot)=>{
			const dotAsString = `(${dot[0]},${dot[1]})`;
			if( !nextStateLookup.includes(dotAsString)){
				nextStateUnique.push(dot);
				nextStateLookup.push(dotAsString);
			}
			return {nextStateUnique, nextStateLookup}
		},({nextStateUnique :[], nextStateLookup: []}))
		return nextStateUnique;
	}, dots);
	
	printGrid(finalState);
	return 0;
}
function prepareInput(inputData){
	const [dots, foldInstructions] = inputData.split('\r\n\r\n');
	const formattedDots = dots.split('\n').map(line=>line.trim().split(',').map(coord=>parseInt(coord)));
	const formattedFoldInstructions = foldInstructions.split('\n').map(line=>line.trim().slice(11).split('=')).map(([axis, value])=>({axis, value:parseInt(value)}));
	return [
		formattedDots,
		formattedFoldInstructions
	]
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