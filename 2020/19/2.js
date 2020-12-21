const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input2.txt')));
console.log(`Example : ${ExampleResult}`);

const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const [ rules, tests ] = data;
	const rulesMap = new Map(rules.map(r => r.split(': ')));
	return tests.filter(i => testAgainstRules(rulesMap, '0', i).includes('')).length;
}

function testAgainstRules(rules, rule, input) {
	let match;
	if (match = /^"(\w)"$/.exec(rule)) {
		if (input[0] === match[1]) {
			return [input.slice(1)];
		} else {
			return [];
		}
	} else if (/^(\d+)$/.test(rule)) {
		return testAgainstRules(rules, rules.get(rule), input);
	} else if (/\|/.test(rule)) {
		const subrules = rule.split(' | ');
		return flatten(subrules.map(subrule => testAgainstRules(rules, subrule, input)));
	} else {
		const subrules = rule.split(' ');
		let result = [input];
		for (let subrule of subrules) {
			result = flatten(result.map(x => testAgainstRules(rules, subrule, x)));
		}
		return result;
	}
}
function flatten(arr) {
	if (!Array.isArray(arr)) return arr;
	return [].concat(...arr.map(flatten));
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	const inputDataWithChangedRules = inputData.replace("8: 42","8: 42 | 42 8").replace("11: 42 31","11: 42 31 | 42 11 31");
	const data = inputDataWithChangedRules.split('\n').map(line=>line.trim())
	return [ data.slice(0, data.indexOf('')), data.slice(data.indexOf('')+1)];
}