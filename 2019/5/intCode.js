const CONST_MODE_POSITION = 'POSITION';
const CONST_MODE_IMMEDIATE = 'IMMEDIATE';
const MODES = [
	CONST_MODE_POSITION,
	CONST_MODE_IMMEDIATE
];

class IntCode {
	constructor(programArray){
		this.program = [ ...programArray ];
		this.complete = false;
		this.pointer = 0;
		this.input = [];
		this.output = [];
	}
	getModeConst(modeInt){
		return MODES[modeInt];
	}
	decodeCommand(command){
		const commandString = command.toString(10).padStart(5,'0');
		const optCode = parseInt(commandString.slice(-2), 10);
		const p1mode = this.getModeConst(parseInt(commandString.slice(-3,-2), 10));
		const p2mode = this.getModeConst(parseInt(commandString.slice(-4,-3), 10));
		const p3mode = this.getModeConst(parseInt(commandString.slice(-5,-4), 10));
		return { optCode, p1mode, p2mode, p3mode };
	}
	readValue(loc, mode){
		if( mode === CONST_MODE_POSITION ){
			return this.program[loc];
		} else if( mode === CONST_MODE_IMMEDIATE ) {
			return loc;
		}
	}
	writeValue(loc, mode, value){
		this.program[loc] = value;
	}
	execute(){
		const {optCode, p1mode, p2mode, p3mode } = this.decodeCommand(this.program[this.pointer]);
		const p1 = this.program[this.pointer + 1];
		const p2 = this.program[this.pointer + 2];
		const p3 = this.program[this.pointer + 3];

		switch(optCode){
			case 1: // ADD
				this.writeValue(p3, p3mode, this.readValue(p1, p1mode) + this.readValue(p2, p2mode));
				this.pointer += 4;
				break;
			case 2: // MULTIPLY
				this.writeValue(p3, p3mode, this.readValue(p1, p1mode) * this.readValue(p2, p2mode));
				this.pointer += 4;
				break;
			case 3: // INPUT
				const inputVal = this.input.shift();
				this.writeValue(p1, p1mode, inputVal);
				this.pointer += 2;
				break;
			case 4: // OUTPUT
				this.output.push(this.readValue(p1, p1mode));
				this.pointer += 2;
				break;
			case 5: // JUMP-IF-TRUE
				if( this.readValue(p1, p1mode) !== 0 ){
					this.pointer = this.readValue(p2, p2mode);
				} else {
					this.pointer += 3;
				}
				break;
			case 6: // JUMP-IF-FALSE
				if( this.readValue(p1, p1mode) === 0 ){
					this.pointer = this.readValue(p2, p2mode);
				} else {
					this.pointer += 3;
				}
				break;
			case 7: // LESS THAN
				this.writeValue(p3, p3mode, this.readValue(p1, p1mode) < this.readValue(p2, p2mode) ? 1 : 0 );
				this.pointer += 4;
				break;
			case 8: // EQUALS
				this.writeValue(p3, p3mode, this.readValue(p1, p1mode) === this.readValue(p2, p2mode) ? 1 : 0 );
				this.pointer += 4;
				break;
			case 99:
				this.complete = true;
				break;
			default:
				console.log(`Unknown optCode! ${optCode}`);
				throw new Error();
		}
	}
}
module.exports = IntCode;