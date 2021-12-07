const fs = require('fs');
const path = require('path');


class BingoNumber {
	constructor(number){
		this.value = number;
		this.isChecked = false;
	}
}
class BingoCard {
	constructor(cardNumbers, index){
		this.index = index;
		this.numbers = cardNumbers.map(line => line.map(val => new BingoNumber(val)));
		this.hasWon = false;
	}
	callNumber(calledNumber){
		for( let i=0; i<this.numbers.length; i++){
			const thisRow = this.numbers[i];
			for( let j=0; j<thisRow.length; j++){
				const thisNumber = thisRow[j];
				if( calledNumber === thisNumber.value ){
					this.numbers[i][j].isChecked = true;
				}
			}
		}
	}
	checkWin(){
		// Check columns
		for( let i=0; i<this.numbers[0].length; i++){
			const column = this.numbers.map(row => row[i]);
			if( column.every(val => val.isChecked) ){
				return true
			}
		}

		// Check rows
		return this.numbers.some(row => row.every(val => val.isChecked))
	}
	getUncheckedNumbers(){
		return this.numbers.reduce((checkedNumbers, row)=>{
			return [...checkedNumbers, ...row.filter(val=>!val.isChecked).map(val=>val.value)]
		}, [])
	}
}

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function playRoundOfBingo(calledNumber, cardsInPlay){
	cardsInPlay.forEach(card => card.callNumber(calledNumber));
	const {hasWinner, winningIndex} = cardsInPlay.reduce(
		({hasWinner, winningIndex}, card, i) => {
		const isWinner = card.checkWin();
		return { hasWinner : hasWinner || isWinner, winningIndex : isWinner ? i : winningIndex };
	}, {hasWinner : false, winningIndex : -1});
	return [hasWinner, winningIndex];
}

function solution(data){
	const {calls, cards} = data;
	const bingoDeck = cards.map((card, i) => new BingoCard(card, i));
	let pastWinners = [];
	for( let i=0; i<calls.length; i++ ){
		const calledNumber = calls[i];
		bingoDeck.forEach(card => {
			card.callNumber(calledNumber);
			card.hasWon = card.checkWin();
		});
		const winnersAfterThisRound = bingoDeck.filter(card=>card.hasWon).map(card=>card.index);
		if(winnersAfterThisRound.length === bingoDeck.length){
			console.log('All cards have won!')
			const [finalWinner] = winnersAfterThisRound.filter(winner => !pastWinners.includes(winner));
			const finalWinnerUnchecked = bingoDeck[finalWinner].getUncheckedNumbers()
			const finalWinnerScore = (finalWinnerUnchecked.reduce((sum,val)=>sum+val, 0)) * calledNumber; 
			console.log(`The final winner is card ${finalWinner} with a score of ${finalWinnerScore}`);
			return finalWinnerScore;
		}
		pastWinners = winnersAfterThisRound;
	}
	return -1;
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	let [calls, ...cards] = inputData.split('\r\n\r\n');
	calls = calls.split(',').map(val => parseInt(val))
	cards = cards.map(
		card => card.split('\r\n').map(
			line=>line.split(' ')
					.filter(val => val !== '')
					.map(val => parseInt(val))
		)
	)
	return {calls, cards}
}