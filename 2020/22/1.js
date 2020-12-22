const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);

const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	let roundNum=0;
	const players = data;
	console.log(JSON.stringify(players));
	while( players.every(player=>player.deck.length > 0)){
		const cardsInPlay = players.map(player=>player.deck.shift());
		const winnerIndex = cardsInPlay.reduce(([highestCard, indexOfHighestCard], card, index )=>{
			if(card > highestCard){
				return [ card, index ];
			}
			return [ highestCard, indexOfHighestCard ];
		}, [0,0]).pop();
		//console.log(`Round ${++roundNum}. Winner is Player ${players[winnerIndex].num}`);
		cardsInPlay.sort((a,b)=>b-a);
		cardsInPlay.forEach(card=>players[winnerIndex].deck.push(card));
	}
	const winner = players.filter(player=>player.deck.length>0).shift();
	console.log(winner);
	return winner.deck.reduce((playerscore, card, index, deck)=>playerscore+(card*(deck.length-index)), 0);
			
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData
		.split('Player')
		.filter(part=>part!=='')
		.map(
			part=>{
				const [playerNum, rawPlayerDeck] = part.trim().split(':');
				const playerDeck = rawPlayerDeck.split('\n').map(card=>parseInt(card.trim())).filter(card=>!isNaN(card));
				return { num:playerNum, deck:playerDeck }
		});
}