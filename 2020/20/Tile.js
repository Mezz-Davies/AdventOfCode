const encodeBorder = (borderToEncode) => {
	return parseInt(borderToEncode.map(char=>char==='#'?'1':'0').join(''), 2);
}
class Tile {
	constructor(id, data){
		this.id = id;
		this.data = data;
		this.up = '';
		this.right = '';
		this.down = '';
		this.left = '';
		this.setBorders();
		this.transforms = [];
	}
	setBorders(){
		this.borderTop = this.data[0].slice();
		this.borderRight = this.data.map(line=>line[line.length-1]);
		this.borderBottom = this.data[this.data.length-1].slice();
		this.borderLeft = this.data.map(line=>line[0]);
	}
	flipX(){
		this.data = this.data.map(line=>line.slice().reverse());
		this.transforms.push('flipX');
		this.setBorders();
	}
	flipY(){
		this.data.reverse();
		this.transforms.push('flipY');
		this.setBorders();
	}
	rotateClockwise90(times=1){
		for(let i=0; i<times; i++){
			const preTransformArray = this.data.map(line=>line.slice());
			this.data = preTransformArray[0].map((_, colIndex)=>preTransformArray.map(row=>row[colIndex]).reverse());
			this.transforms.push('r90');
		}
		this.setBorders();
	}
	alignSideToVal(side, val){
		let options, iterCount=0, iterMax=100;
		options = this.getBorderOptions();
		while( options[side] !== val ){
			if( iterCount++ > iterMax ){
				throw new Error(`Max iterations exceeded`);
			}
			const optionPos = ( Object.entries(options).filter(([pos, posVal])=>posVal===val).shift() || [] ).shift();
			if( !optionPos ){
				throw new Error(`Cannot find val in options!`);
			}
			if(
				optionPos === 'rTop' 
				|| optionPos === 'rBottom' 
				|| (optionPos === 'right' && side === 'left') 
				|| (optionPos === 'left' && side === 'right')
			){
				this.flipX();
			} else if(
				optionPos === 'rRight' 
				|| optionPos === 'rLeft' 
				|| (optionPos === 'top' && side === 'bottom') 
				|| (optionPos === 'bottom' && side === 'top')
			){
				this.flipY();
			} else {
				this.rotateClockwise90();
			}
			options = this.getBorderOptions();
		}
	}
	linkTo(tile){
		const { borderTop, borderRight, borderBottom, borderLeft } = tile;
		if( encodeBorder(this.borderTop) === encodeBorder(borderBottom) ){
			this.up = tile.id;
			tile.down = this.id;
		} else if( encodeBorder(this.borderRight) === encodeBorder(borderLeft) ){
			this.right = tile.id;
			tile.left = this.id;
		} else if( encodeBorder(this.borderBottom) === encodeBorder(borderTop) ){
			this.down = tile.id;
			tile.up = this.id;
		} else if ( encodeBorder(this.borderLeft) === encodeBorder(borderRight) ){
			this.left = tile.id;
			tile.right = this.id;
		} else {
			throw new Error(`Cannot find link side between tiles ${this.id} and ${tile.id}`);
		}
	}
	getBorderOptions(){
		return {
			top : encodeBorder(this.borderTop.slice()),
			right : encodeBorder(this.borderRight.slice()),
			bottom : encodeBorder(this.borderBottom.slice()),
			left : encodeBorder(this.borderLeft.slice()),
			rTop : encodeBorder(this.borderTop.slice().reverse()),
			rRight : encodeBorder(this.borderRight.slice().reverse()),
			rBottom : encodeBorder(this.borderBottom.slice().reverse()),
			rLeft : encodeBorder(this.borderLeft.slice().reverse())
		}
	}
	toString(){
		return [ this.id, this.data.map(line=>line.join('')).join('\n') ].join('\n');
	}
}
module.exports = Tile;