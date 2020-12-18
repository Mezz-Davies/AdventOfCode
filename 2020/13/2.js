const fs = require('fs');
const path = require('path');

const ExampleResult = solution(parseInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(parseInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function parseInput(str) {
	const [line1, line2] = str.split('\n');
	const buses = line2.split(',')
		.map((x,i) => [x,i])
		.filter(([x,i]) => x !== 'x')
		.map(([x,i]) => [+x,i]);
	return buses;
}
function solution(buses){
	const N = buses.map(([bus, offset]) => BigInt(bus));
	const A = buses.map(([bus, offset]) => BigInt(modulo(-offset, bus)));
	return Number(bigIntChineseRemainder(A, N));
}

function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.split('\n').map(line=>line.trim().split(','));
}

// Modular multiplicative inverse
// https://en.wikipedia.org/wiki/Modular_multiplicative_inverse
// x where `ax % m == 1`
function bigIntModMulInverse(a, m) {
	let b = a % m;
	for (let i = 1n; i < m; ++i) {
		if ((b * i) % m == 1n) {
			return i;
		}
	}
	return 1n;
}

function product(arr) {
	return arr.reduce((a, b) => a * b);
}

function modulo(x, m) {
	while (x < 0) x += m;
	return x % m;
}

// Chinese remainder theorem
// https://en.wikipedia.org/wiki/Chinese_remainder_theorem
// x where `x % Ni == Ai` for all i
function bigIntChineseRemainder(A, N) {
	let prod = product(N);
	let p;
	let sum = 0n;
	for (let i = 0; i < A.length; ++i) {
		p = prod / N[i];
		sum += A[i] * p * bigIntModMulInverse(p, N[i]);
	}
	return sum % prod;
}
