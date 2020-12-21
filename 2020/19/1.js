const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);

const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const [ rules, tests ] = data;
	const processedRules = rules.map(rule=>{
		const [index, componentsBeforeProcessing ] = rule.split(':').map(part=>part.trim());
		const components = componentsBeforeProcessing.split('|').map(part=>{
			if(part.indexOf("\"") > -1 ){
				return part.replace(/"/g,"");
			} else {
				return part.trim().split(' ');
			}
		});
		return { index, components }
	}).reduce((lookup,processedRule)=>{
		return { ...lookup, [processedRule.index] : processedRule.components }
	}, {});
	console.log(JSON.stringify(processedRules));
	const createValidOptionsRecursive = (ruleIndex) => {
		const result = [];
		if(processedRules[ruleIndex] === undefined){
			console.log(`Unknown Index: ${ruleIndex}`)
			return [''];
		} else {
			for( const ruleOption of processedRules[ruleIndex]){
				if( !Array.isArray(ruleOption)){
					console.log(ruleOption);
					result.push(ruleOption);
				} else {
					const subRuleResults = ruleOption.map(subRuleIndex=>createValidOptionsRecursive(subRuleIndex));
					const ruleOptionResult = subRuleResults.reduce((ruleOptionResult,subRuleResult)=>{
						if( ruleOptionResult.length === 0 ){ return subRuleResult; }
						const results = [];
						for (let i=0; i<ruleOptionResult.length; i++){
							for( let j=0; j<subRuleResult.length; j++){
								results.push(`${ruleOptionResult[i]}${subRuleResult[j]}`);
							}
						}
						return results;
					},[]);
					result.push(ruleOptionResult);
				}
			}
		}
		return result.flat();
	}
	const validOptions = createValidOptionsRecursive('0');
	console.log(validOptions);
	return tests.filter(test=>validOptions.indexOf(test)>-1).length;;
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	const data = inputData.split('\n').map(line=>line.trim())
	const empty = data.indexOf('');
	return [ data.slice(0, data.indexOf('')), data.slice(data.indexOf('')+1)];
}