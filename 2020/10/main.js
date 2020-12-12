const fs = require('fs');
const path = require('path');
const fileContents = fs.readFileSync(path.resolve(__dirname, 'input.txt'), {encoding:'UTF-8'});

// Part 1 Solution
const adapterArray = fileContents.split('\n').map(stringval=>parseInt(stringval)).sort((a,b)=>a-b);

const adapterArrayWithWall = [ 0, ...adapterArray, Math.max(...adapterArray) + 3];

console.log(adapterArrayWithWall)
const differences = adapterArrayWithWall.reduce((differences, currentAdapter, index)=>{
	if( index > 0 ){
		const lastAdapter = adapterArrayWithWall[index-1];
		const thisAdapter = adapterArrayWithWall[index];
		const thisDifference = (thisAdapter - lastAdapter).toString();
		differences[thisDifference] = differences[thisDifference] ? differences[thisDifference] + 1 : 1;
	}
	return differences;
}, {});
console.log(differences);
console.log(differences['1'] * differences['3']);

// Part 2. Number of different arrangements
const adapterArray2 = fileContents.split('\n').map(stringval=>parseInt(stringval)).sort((a,b)=>a-b);

function solution(data) { 
	return data.reduce((computed, volt)=>{
		computed[volt] = 
			(computed[volt-3] || 0 ) +
			(computed[volt-2] || 0 ) +
			(computed[volt-1] || 0 );
		return computed;
	}, [1]).pop();
}
console.log(solution(adapterArray2));