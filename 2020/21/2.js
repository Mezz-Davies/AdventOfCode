const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);

const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const [allergenList, ingredientsOccurances] = data.reduce(([allergenList, ingredientsOccurances], line)=>{
		const [ingredients, presentAllergens] = line;
		//console.log(ingredients, presentAllergens);
		for( let ingredient of ingredients){
			ingredientsOccurances[ingredient] = (ingredientsOccurances[ingredient] || 0) + 1;
		}
		for( const allergen of presentAllergens ){
			if( !allergenList[allergen] ){
				allergenList[allergen] = ingredients;
			} else {
				allergenList[allergen] = allergenList[allergen].filter(item=>ingredients.indexOf(item)>-1);
			}
		}
		return [ allergenList, ingredientsOccurances ];
	}, [{},{}]);
	const finalAllergenList = {};
	const allergensToAllocate = Object.keys(allergenList);
	while( allergensToAllocate.length > 0 ){
		allergensToAllocate.sort((a,b)=>allergenList[a].length-allergenList[b].length);
		const allergenName = allergensToAllocate[0];
		const ingredientWithAllergen = allergenList[allergenName].shift();
		finalAllergenList[allergenName] = ingredientWithAllergen;
		Object.keys(allergenList).forEach(
			key=>{
				allergenList[key] = allergenList[key].filter(item=>item!==ingredientWithAllergen);
			}
		)
		allergensToAllocate.shift();
	}
	console.log(finalAllergenList);
	return Object.keys(finalAllergenList).sort().map(item=>finalAllergenList[item]).join(',');
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.trim().split('\n').map(line=>{
		const [ingredients, allergens] = line.trim().split('(contains ');
		//console.log(ingredients, allergens);
		return [ingredients.trim().split(' ').map(item=>item.trim()), allergens.slice(0, allergens.length-1).split(',').map(item=>item.trim())]
	});
}