const fs = require('fs');
const path = require('path');

const ExampleResult = solution(prepareInput(readFile('example_input.txt')));
console.log(`Example : ${ExampleResult}`);
const SolutionResult = solution(prepareInput(readFile('input.txt')));
console.log(`Solution : ${SolutionResult}`);

function solution(data){
	const [departureTime, busses] = data;
	const busDepatureTimes = busses.map(busId=>{
		if(busId === 'x'){return busId;}
		const busDepartsEvery = parseInt(busId, 10);
		const busDeparts = busDepartsEvery * Math.ceil(departureTime / busDepartsEvery);
		return busDeparts;
	});
	console.log(busDepatureTimes);
	const [earliestBusId, waitingTime, earliestDepartureTime] = busDepatureTimes.reduce(
		([earliestBusId, waitingTime, earliestDepartureTime], busDepartureTime, busIdIndex) => [
			busDepartureTime !== 'x' && busDepartureTime < earliestDepartureTime ? busses[busIdIndex] : earliestBusId,
			busDepartureTime !== 'x' && busDepartureTime < earliestDepartureTime ? busDepartureTime - departureTime : waitingTime,
			busDepartureTime !== 'x' && busDepartureTime < earliestDepartureTime ? busDepartureTime : earliestDepartureTime
		]
	, ['', 0, Infinity]);
	console.log({earliestBusId, waitingTime, earliestDepartureTime});
	return parseInt(earliestBusId,10) * waitingTime;
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function prepareInput(inputData){
	return inputData.split('\n').map(line=>line.trim().split(','));
}