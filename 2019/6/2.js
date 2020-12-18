const fs = require('fs');
const path = require('path');

class Node {
	constructor(name, parent='', children=[]){
		this.name = name;
		this.parent = parent;
		this.children = children;
	}
	addChild(childToAdd){
		this.children = [ ...new Set([...this.children, childToAdd])];
	}
	setParent(nameOfParent){
		this.parent = nameOfParent;
	}
}

/*
const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
*/
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	console.log(data);
	const orbits = {};
	data.forEach(orbit=>{
		const [parentName, childName] = orbit;
		if( !orbits.hasOwnProperty(parentName) ){
			orbits[parentName] = new Node(parentName);
		}
		orbits[parentName].addChild(childName);
		if( !orbits.hasOwnProperty(childName) ){
			orbits[childName] = new Node(childName);
		}
		orbits[childName].setParent(parentName);
	})
	function getAncestorList(nodeName){
		const output = [];
		let targetNode = nodeName;
		while( orbits[targetNode].parent !== '' ){
			output.push(orbits[targetNode].parent);
			targetNode=orbits[targetNode].parent;
		}
		return output;
	}
	const youAncestors = getAncestorList('YOU').reverse();
	const sanAncestors = getAncestorList('SAN').reverse();

	while(youAncestors[1] === sanAncestors[1]){
		youAncestors.shift();
		sanAncestors.shift();
	}
	sanAncestors.shift();
	sanAncestors.reverse();
	const pathFromYouToSan = [ ...youAncestors, ...sanAncestors];
	return pathFromYouToSan.length;
}



function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.split('\n').map(line=>line.trim().split(')'));
}