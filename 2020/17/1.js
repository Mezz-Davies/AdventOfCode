const fs = require('fs');
const path = require('path');

class Point{
	constructor(x,y,z,isActive){
		this.x = x;
		this.y = y;
		this.z = z;
		this.isActive = isActive;
	}
	isNeighbourOf(point){
		return point.x >= this.x-1 && point.x <= this.x+1
		&& point.y >= this.y-1 && point.y <= this.y+1
		&& point.z >= this.z-1 && point.z <= this.z+1;
	}
	isEqual(point){
		return point.x === this.x
		&& point.y === this.y
		&& point.z === this.z;
	}
	getNeighbours(){
		let neighbours = [];
		for(let z=this.z-1;z<=this.z+1;z++){
			for(let y=this.y-1;y<=this.y+1;y++){
				for(let x=this.x-1;x<=this.x+1;x++){
					if( !(z===this.x && y===this.y && x===this.z) ){
						neighbours.push(new Point(x, y, z, false) );
					}
				}
			}
		}
		return neighbours;
	}
}

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);

const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	// Make an array of active points
	console.log(data);
	let state = [...data.map((line,yIndex)=>line.map((val,xIndex)=>new Point(xIndex, yIndex, 0, val==='#'))).flat()];
	let cycle = 0;
	while(cycle<6){
		console.log(`Cycle ${cycle}!`);
		/*
		console.log('Before');
		displayState(state);
		*/
		state = processState(state);
		/*
		console.log('After');
		displayState(state);
		*/
		
		cycle++;
	}
	return state.filter(point=>point.isActive).length;
}
function processState(state){
	const nextStateSpace = state.reduce((nextStateSpace, point)=>{
		const pointsToAdd = point.getNeighbours()
		.filter(neighbour=>!nextStateSpace.some(val=>val.isEqual(neighbour)))
		return [ 
			...nextStateSpace, 
			...pointsToAdd
		];
	}, [...state]);
	const nextState = nextStateSpace.map(point=>{
		const activeNeighboursInSpace = nextStateSpace.filter(
			other=>
				!point.isEqual(other)
				&& point.isNeighbourOf(other)
				&& other.isActive
		).length;
		const isActive = point.isActive ? (activeNeighboursInSpace === 2 || activeNeighboursInSpace === 3) : activeNeighboursInSpace === 3;
		return new Point(point.x, point.y, point.z, isActive);
	}).filter(point=>point.isActive);
	return nextState;
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.trim().split('\n').map(line=>line.trim().split(''));
}

function displayState(state){
	state.sort((a,b)=>a.z-b.z);
	let xMin=Infinity, xMax=-Infinity, yMin=Infinity, yMax=-Infinity, zMin=Infinity, zMax=-Infinity;
	for( let point of state){
		if( point.x < xMin ){xMin = point.x};
		if( point.x > xMax ){xMax = point.x};
		if( point.y < yMin ){yMin = point.y};
		if( point.y > yMax ){yMax = point.y};
		if( point.z < zMin ){zMin = point.z};
		if( point.z > zMax ){zMax = point.z};
	}
	console.log({xMin, xMax, yMin, yMax});
	for(let z=zMin; z<=zMax; z++){
		const thisLevel = state.filter(point=>point.z===z);
		let thisLevelString = '';
		for(let y=yMin; y<=yMax; y++){
			const thisColumn = thisLevel.filter(point=>point.y===y);
			for(let x=xMin; x<=xMax;x++){
				const thisPoint = thisColumn.filter(point=>point.x===x).pop();
				if(thisPoint && thisPoint.isActive){
					thisLevelString += '#';
				} else {
					thisLevelString += '.';
				}
			}
			thisLevelString += '\n';
		}
		console.log(`z=${z}`);
		console.log(thisLevelString);
	}
}