const fs = require('fs');
const path = require('path');
const common = require('../../common/common');

// Need 12 overlapping points
// Therefore, need overlapping diff array of size 12 (from any 1 point on each)
// Need to factor in orientation


// Scanner 0 will be set to direction: x, orientation UP
// direction = x, -x, y, -y, z, -z. Direction to the front of scanner.
// orientation = UP, RIGHT, DOWN, LEFT. Direction of "Up" of scanner.

const directions = ['x','-x','y','-y','z','-z'];

class Scanner{
	constructor(name, readings){
		this.name = name;
		this.readings = readings;
		this.transformedReadings = readings;
		this.direction =  'x';
		this.orientation = 'UP';
		this.diffLookup = {};
		this.calculateDiffLookup();
		this.location = new Point(0, 0, 0);
	}
	// Turn but DO NOT ROTATE
	calculateDiffLookup(){
		this.diffLookup = this.transformedReadings.reduce((lookup, point, _, arr) => {
			const diffPoints = arr.filter(diffPoint=>diffPoint.key !== point.key).map(diffPoint=>point.getDeltaKey(diffPoint));
			lookup[point.key] = diffPoints;
			return lookup;
		}, {});
	}
	getOverlappingBeacons(compScanner){
		// Key-Value map of points in this scanner that map to points in compScanner;
		return this.transformedReadings.reduce((overlappingPoints, point)=>{
			// Points overlap if diff array has intersection
			const thisPointDiffArray = this.diffLookup[point.key];
			Object.keys(compScanner.diffLookup).forEach(compPointKey => {
				const compPointDiffArray = compScanner.diffLookup[compPointKey];
				const intersect = common.intersect(thisPointDiffArray, compPointDiffArray);
				if(intersect.length > 0){
					overlappingPoints[point.key] = compPointKey;
				}
			});
			return overlappingPoints;
		}, {});
	}
	turn(newDirection){
		switch(newDirection){
			case 'x':
				this.transformedReadings = this.readings;
				break;
			case '-x':
				this.transformedReadings = this.readings.map( point => new Point(-point.x, -point.y, point.z));
				break;
			case 'y':
				this.transformedReadings = this.readings.map( point => new Point(point.y, -point.x, point.z));
				break;
			case '-y':
				this.transformedReadings = this.readings.map( point => new Point(point.y, -point.x, point.z));
				break;
			case 'z':
				this.transformedReadings = this.readings.map( point => new Point(-point.z, point.y, point.x));
				break;
			case '-z':
				this.transformedReadings = this.readings.map( point => new Point(point.z, point.y, -point.x));
				break;
			default:
				console.log(`Unknown Direction : ${newDirection}`);
		}
		this.direction = newDirection;
		this.calculateDiffLookup()
	}
	// Rotate about x;
	rotate(degrees){
		switch(degrees % 360){
			case 0:
				this.transformedReadings = this.transformedReadings;
				break;
			case 90:
				this.transformedReadings = this.transformedReadings.map( point => new Point(point.x, -point.z, point.y));
				break;
			case 180:
				this.transformedReadings = this.transformedReadings.map( point => new Point(point.x, point.y, -point.z));
				break;
			case 270:
				this.transformedReadings = this.transformedReadings.map( point => new Point(point.x, point.z, -point.y));
				break;
			default:
				console.log(`Unknown rotation degrees : ${degrees}`);
		}
		this.orientation = (this.orientation + degrees) % 360;
		this.calculateDiffLookup();
	}
}

class Point{
	constructor(x,y,z){
		this.x = x;
		this.y = y;
		this.z = z;
		this.key = `(${x},${y},${z})`;
	}
	getDeltaKey(compPoint){
		const dX = this.x - compPoint.x;
		const dY = this.y - compPoint.y;
		const dZ = this.z - compPoint.z;
		
		// 3 different possible viewpoints
		return `d(${dX},${dY},${dZ})`;
	}
}

const [ exampleResult, exampleRuntime ] = readPrepareAndSolve('example_input.txt');
console.log(`Example : ${exampleResult} Runtime : ${exampleRuntime}ms`);
/*
const [ solutionResult, solutionRuntime ] = readPrepareAndSolve('input.txt');
console.log(`Solution : ${solutionResult} Runtime : ${solutionRuntime}ms`);
*/
function getOverlappingBeaconsWithAllDirectionsAndOrientations(referenceScanner, compScanner){
	for(let i=0;i<directions.length;i++){
		console.log(`Turning ${compScanner.name} to ${directions[i]}`);
		compScanner.turn(directions[i]);
		for(let j=0;j<360;j+=90){
			compScanner.rotate(j);
			const overlappingBeacons = referenceScanner.getOverlappingBeacons(compScanner);
			if( Object.keys(overlappingBeacons) > 0 ){
				return overlappingBeacons;
			}
		}
	}
	return {};
}
function solution(data){
	console.log('here!');
	const [ referenceScanner, ...scannerArray ] = data;
	const processedArray = [];
	let done = false;
	let currentScanner = referenceScanner;
	while(!done){
		
		console.log('here!');
		for(let i=0; i<scannerArray.length; i++){
			const overlappingBeacons = getOverlappingBeaconsWithAllDirectionsAndOrientations(currentScanner, scannerArray[i]);
			if(Object.keys(overlappingBeacons)>=12){
				// we can calculate their difference!
				console.log(overlappingBeacons);
				break;
			}
		}
	}

	console.log(diffKeyCount);
	console.log(Object.keys(diffKeyCount).length);
	return data;
}
function prepareInput(inputData){
	const splitScanners = inputData.split('\r\n\r\n');
	const scanners = splitScanners.map(scannerSection => {
		const [titleLine, ...readingStrings] = scannerSection.split('\n');
		const name = titleLine.match(/[\w]+ [\d]/)[0];
		const readings = readingStrings.map(line=>{
			const [x, y, z] = line.trim().split(',').map(val=>parseInt(val));
			return new Point(x, y, z);
		});
		return new Scanner(name, readings);
	});
	return scanners;
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