class IntCode {
	constructor(programArray){
		this.program = [ ...programArray ];
		this.complete = false;
		this.pointer = 0;
	}
	readValue(loc){
		return this.program[loc];
	}
	writeValue(loc, value){
		this.program[loc] = value;
	}
	execute(){
		const optCode = this.program[this.pointer];
		const param1 = this.program[this.pointer + 1];
		const param2 = this.program[this.pointer + 2];
		const param3 = this.program[this.pointer + 3];

		switch(optCode){
			case 1: // ADD
				this.writeValue(param3, this.readValue(param1) + this.readValue(param2));
				this.pointer += 4;
				break;
			case 2: // MULTIPLY
				this.writeValue(param3, this.readValue(param1) * this.readValue(param2));
				this.pointer += 4;
				break;
			case 99:
				this.complete = true;
				break;
			default:
				console.log(`Unknown optCode! ${optCode}`);
		}
	}
}
module.exports = IntCode;