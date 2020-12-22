const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);

const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const players = data;
	const winner = players[recursiveCombat(players.map(player=>player.deck))];
	console.log(winner);
	return winner.deck.reduce((playerscore, card, index, deck)=>playerscore+(card*(deck.length-index)), 0);		
}
function recursiveCombat(decksInPlay, depth=1){
	const gameRoundsTracker = {};
	while( decksInPlay.every(deck=>deck.length > 0)){
		if( decksInPlay.some(deck=>gameRoundsTracker.hasOwnProperty(JSON.stringify(deck)))){
			return 0;
		} else {
			decksInPlay.forEach(deck=>{
				gameRoundsTracker[JSON.stringify(deck)] = true 
			})
		}
		let cardsInPlay = decksInPlay.map(deck=>deck.shift());
		const subGameRequired = decksInPlay.map((deck, index)=>deck.length>=cardsInPlay[index]).every(playerResult=>playerResult);
		const winnerIndex = subGameRequired ?
			recursiveCombat([...decksInPlay.map((deck, index)=>deck.slice(0, cardsInPlay[index]))], depth+1)
			:
			cardsInPlay.reduce(([highestCard, indexOfHighestCard], card, index )=>{
				if(card > highestCard){
					return [ card, index ];
				}
				return [ highestCard, indexOfHighestCard ];
			}, [0,0]).pop();
		cardsInPlay = [ ...cardsInPlay.slice(winnerIndex, winnerIndex+1), ...cardsInPlay.filter((val,index)=>index!==winnerIndex) ];
		cardsInPlay.forEach(card=>decksInPlay[winnerIndex].push(card));
	}
	const overallWinningIndex = decksInPlay.reduce((winner, deck, index)=>deck.length > 0 ? index : winner, -1);
	return overallWinningIndex;
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