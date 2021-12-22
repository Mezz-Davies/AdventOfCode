const fs = require('fs');
const path = require('path');
const common = require('../../common/common');

class Point3d {
	constructor(x, y, z, val){
		this.x = x;
		this.y = y;
		this.z = z;
		this.val = val;
		this.key = `(${this.x},${this.y},${this.z})`;
	}
}

const [ exampleResult, exampleRuntime ] = readPrepareAndSolve('example_input.txt');
console.log(`Example : ${exampleResult} Runtime : ${exampleRuntime}ms`);

const [ solutionResult, solutionRuntime ] = readPrepareAndSolve('input.txt');
console.log(`Solution : ${solutionResult} Runtime : ${solutionRuntime}ms`);

function solution(data){
	const initialRegion = {
		xMin : -50,
		xMax : 50,
		yMin : -50,
		yMax : 50,
		zMin : -50,
		zMax : 50
	}
	const activityMap = {};
	data.filter(({cmd, xMin, xMax, yMin, yMax, zMin, zMax})=>{
		return !(xMax < initialRegion.xMin || xMin > initialRegion.xMax ||
			yMax < initialRegion.yMin || yMin > initialRegion.yMax ||
			zMax < initialRegion.zMin || zMin > initialRegion.zMax);
	}).forEach(({cmd, xMin, xMax, yMin, yMax, zMin, zMax}, i) => {
		//console.log(`Processing command ${i+1}`);
		for(let z=zMin;z<=zMax;z++){
			for(let y=yMin;y<=yMax;y++){
				for(let x=xMin;x<=xMax;x++){
					const thisKey = `(${x},${y},${z})`
					const thisPoint = activityMap[thisKey] || new Point3d(x, y, z);
					thisPoint.val = (cmd === 'on');
					activityMap[thisKey] = thisPoint;
				}
			}
		}
	});

	// filter for values in initial range that are on.
	const litNodesInInitialRange = Object.keys(activityMap).filter(key=>{
		const point = activityMap[key];
		return point.x >= -50 && point.x <= 50 &&
				point.y >= -50 && point.y <= 50 &&
				point.z >= -50 && point.z <= 50 &&
				point.val === true;
	});
	return litNodesInInitialRange.length;
}
function prepareInput(inputData){
	const commands = inputData.split('\n').map(line=>{
		const [ matchedLine ] = [...line.trim().matchAll(/^(?<cmd>[\w]+) x=(?<xMin>\-?[\d]+)\.\.(?<xMax>\-?[\d]+),y=(?<yMin>\-?[\d]+)\.\.(?<yMax>\-?[\d]+),z=(?<zMin>\-?[\d]+)\.\.(?<zMax>\-?[\d]+)$/gm)];
		const cmd = matchedLine.groups.cmd;
		const xMin = parseInt(matchedLine.groups.xMin);
		const xMax = parseInt(matchedLine.groups.xMax);
		const yMin = parseInt(matchedLine.groups.yMin);
		const yMax = parseInt(matchedLine.groups.yMax);
		const zMin = parseInt(matchedLine.groups.zMin);
		const zMax = parseInt(matchedLine.groups.zMax);
		return { cmd, xMin, xMax, yMin, yMax, zMin, zMax };
	});
	return commands;
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