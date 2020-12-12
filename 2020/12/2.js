const fs = require('fs');
const path = require('path');

class Ship {
	constructor(){
		this.x = 0;
		this.y = 0;
		this.waypoint = { x: 10, y:1 };
	}
	
	/*
	Action N means to move north by the given value.
	Action S means to move south by the given value.
	Action E means to move east by the given value.
	Action W means to move west by the given value.
	Action L means to turn left the given number of degrees.
	Action R means to turn right the given number of degrees.
	Action F means to move forward by the given value in the direction the
	*/
	rotateWaypoint = (value) => {
		const { x, y } = this.waypoint;
		switch( value ){
			case -90:
			case 270:
				this.waypoint.x = -y;
				this.waypoint.y = x;
				break;
			case 90:
			case -270:
				this.waypoint.x = y;
				this.waypoint.y = -x;
				break;
			case 180:
			case -180:
				this.waypoint.x = -x;
				this.waypoint.y = -y;
				break;
			default:
				console.log(`Unresolved value : ${value}`);
		}
		
	}
	execute = (command) => {
		const action = command.substr(0,1);
		const value = parseInt(command.substr(1),10);
		switch(action){
			case 'N':
				this.waypoint.y += value;
				break;
			case 'S':
				this.waypoint.y -= value;
				break;
			case 'E':
				this.waypoint.x += value;
				break;
			case 'W':
				this.waypoint.x -= value;
				break;
			case 'L':
				this.rotateWaypoint(-value);
				break;
			case 'R':
				this.rotateWaypoint(value);
				break;
			case 'F':
				this.x += this.waypoint.x * value;
				this.y += this.waypoint.y * value;
				break;
			default:
				console.log(`Unrecognised Action : ${action}`)
		}
	}
}

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const ship = new Ship();
	data.forEach(command => {
		ship.execute(command);
	});
	return Math.abs(ship.x) + Math.abs(ship.y);
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.trim().split('\n').map(str=>str.trim());
}