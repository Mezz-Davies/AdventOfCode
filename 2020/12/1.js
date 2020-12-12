const fs = require('fs');
const path = require('path');

class Ship {
	constructor(){
		this.x = 0;
		this.y = 0;
		this.r = 270; // Starts facing Left
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
	execute = (command) => {
		const action = command.substr(0,1);
		const value = parseInt(command.substr(1),10);
		switch(action){
			case 'N':
				this.y += value;
				break;
			case 'S':
				this.y -= value;
				break;
			case 'E':
				this.x += value;
				break;
			case 'W':
				this.x -= value;
				break;
			case 'L':
				this.r -= value;
				if( this.r < 0 ){
					this.r = 360 + this.r;
				}
				if( this.r > 360){
					this.r = (this.r % 360);
				}
				break;
			case 'R':
				this.r += value;
				if( this.r < 0 ){
					this.r = 360 + this.r;
				}
				if( this.r >= 360){
					this.r = (this.r % 360);
				}
				break;
			case 'F':
				if( this.r === 0 ){
					this.y += value;
				} else if ( this.r === 90 ){
					this.x += value;
				} else if ( this.r === 180 ){
					this.y -= value;
				} else if ( this.r === 270 ){
					this.x -= value;
				} else {
					console.log(`Weird r : ${this.r}`);
				}
				break;
			default:
				console.log(`Unrecognised Action : ${action}`)
		}
		console.log(`Command : ${command}. Position now: (${this.x},${this.y})`)
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