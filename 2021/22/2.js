const fs = require('fs');
const path = require('path');
const common = require('../../common/common');

class Region {
	constructor({xMin, xMax, yMin, yMax, zMin, zMax}, isOn=false){
		this.xMin = xMin;
		this.xMax = xMax;
		this.yMin = yMin;
		this.yMax = yMax;
		this.zMin = zMin;
		this.zMax = zMax;
		this.isOn = isOn;
		this.size = (this.xMax - this.xMin) * (this.yMax - this.yMin) * (this.zMax - this.zMin);
		this.subRegions = [];
	}
	getOverlappingRegion(otherRegion){
		if (this.xMin > otherRegion.xMax || this.xMax < otherRegion.xMin ||
			this.yMin > otherRegion.yMax || this.yMax < otherRegion.yMin ||
			this.zMin > otherRegion.zMax || this.zMax < otherRegion.zMin ){
				return null;
			};
		const overlapRegionParams = {
			xMin : this.xMin >= otherRegion.xMin ? this.xMin : otherRegion.xMin,
			xMax : this.xMax <= otherRegion.xMax ? this.xMax : otherRegion.xMax,
			yMin : this.yMin >= otherRegion.yMin ? this.yMin : otherRegion.yMin,
			yMax : this.yMax <= otherRegion.yMax ? this.yMax : otherRegion.yMax,
			zMin : this.zMin >= otherRegion.zMin ? this.zMin : otherRegion.zMin,
			zMax : this.zMax <= otherRegion.zMax ? this.zMax : otherRegion.zMax
		}
		
		return new Region(overlapRegionParams, !otherRegion.isOn)
	}
	getSize(){
		const size = this.subRegions.reduce((size, subRegion)=>{
			return size - subRegion.getSize();
		}, (this.xMax - this.xMin + 1) * (this.yMax - this.yMin + 1) * (this.zMax - this.zMin + 1));
		return size;
	}
	subtractSubRegion(subRegionToSubtract){
		this.subRegions.forEach((subRegion, index, subRegionArray)=>{
			const subSubRegion = subRegion.getOverlappingRegion(subRegionToSubtract);
			if(subSubRegion !== null){
				if( subRegion.toString() === subSubRegion.toString()){
					subRegionArray.splice(index, 1);
				} else {
					subRegion.subtractSubRegion(subSubRegion);
				}
			}
		});
		this.subRegions.push(subRegionToSubtract);
	}
	toString(){
		return `x=${this.xMin}..${this.xMax},y=${this.yMin}..${this.yMax},z=${this.zMin}..${this.zMax} ${this.isOn ? 'ON' : 'OFF'}`;
	}
}

const [ personalResult, personalRuntime ] = readPrepareAndSolve('personal_example.txt');
console.log(`Personal : ${personalResult} Runtime : ${personalRuntime}ms`);

const [ exampleResult, exampleRuntime ] = readPrepareAndSolve('example_input.txt');
console.log(`Example : ${exampleResult} Runtime : ${exampleRuntime}ms`);

const [ solutionResult, solutionRuntime ] = readPrepareAndSolve('input.txt');
console.log(`Solution : ${solutionResult} Runtime : ${solutionRuntime}ms`);

function solution(data){
	const regions = data.map((command)=>{
		const {cmd, ...region} = command
		return new Region(region, cmd==='on');
	});
	regions.forEach((region, index, readOnlyRegions)=>{
		for(let i=0;i<index;i++){
			if(readOnlyRegions[i].isOn){
				const overlappingRegion = region.getOverlappingRegion(readOnlyRegions[i]);
				if(overlappingRegion !== null){
					readOnlyRegions[i].subtractSubRegion(overlappingRegion);
				}
			}
		}
	});
	const onCount = regions.reduce((onCount, region)=>{
		if(region.isOn){
			return onCount+region.getSize()
		}
		return onCount;
	}, 0);
	return onCount;
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