const fs = require('fs');
const path = require('path');

class CircularLinkedList {
	constructor(arrayToLink=[]){
		const arrayLength = arrayToLink.length;
		this.lookup = {}
		arrayToLink.forEach((val, index)=>{
			const linkToAdd = new Link(val);
			linkToAdd.next = index+1 < arrayLength ? arrayToLink[index+1].toString() : arrayToLink[0].toString();
			this.lookup[linkToAdd.key] = linkToAdd;
		}, {});
		this.length = arrayLength;
	}
	get(key){
		return this.lookup[key];
	}
	getNextKey(key){
		return this.get(key).next;
	}
}
class Link {
	constructor(val){
		this.value = val;
		this.next = '';
		this.key = val.toString();
	}
}

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);

const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const maxNumberOfMoves = 10_000_000;
	let currentMove = 0;
	const state = data;
	for( let i = 10; i<1_000_000; i++){
		state.push(i);
	}
	const circularList = new CircularLinkedList(state);
	console.log(`Circular list of length ${circularList.length} created!`);
	let currentCup = circularList.get(state[0].toString());
	console.log(currentCup);
	while(currentMove<maxNumberOfMoves){
		const pickUp1 = currentCup.next;
		const pickUp2 = circularList.get(pickUp1).next;
		const pickUp3 = circularList.get(pickUp2).next;
		const pickedUpCups = [ 
			pickUp1,
			pickUp2,
			pickUp3
		];
		currentCup.next = circularList.getNextKey(pickUp3);
		let destinationCupValue = currentCup.value - 1;
		let destinationCup;
		while(!destinationCup || !pickedUpCups.some(key=>circularList.get(key).value===destinationCupValue)){
			destinationCup = circularList[destinationCupValue.toString()];
			destinationCupValue = destinationCupValue - 1 > 0 ? destinationCupValue - 1 : 1000000;
		}
		circularList.get(pickUp3).next = destinationCup.next;
		circularList.get(destinationCup.key).next = pickUp1;
		//console.log(currentCup, currentCup.right, destinationCup.right, pickedUpCups);
		//console.log('---');
		if( currentMove % 1000 === 0){
			console.log(currentMove);
		}
		currentCup = circularList.get(currentCup).next;
		currentMove++;
	}
	return LinkedList['1'].right.value * LinkedList['1'].right.right.value;
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.split('').map(part=>parseInt(part));
}