const fs = require('fs');
const path = require('path');
const common = require('../../common/common');

const [ exampleResult, exampleRuntime ] = readPrepareAndSolve('example_input.txt');
console.log(`Example : ${exampleResult} Runtime : ${exampleRuntime}ms`);

const [ solutionResult, solutionRuntime ] = readPrepareAndSolve('input.txt');
console.log(`Solution : ${solutionResult} Runtime : ${solutionRuntime}ms`);

function trimLeadingZeros(stringToTrim){
	return stringToTrim.replace(/^0+/, '');
}
function processLiteralValuePacket(packetString){
	let valueBinString = '';
	let i = 0;
	let done = false;
	while( !done ){
		const nextPart = packetString.slice(i, i+5);
		const doneIndicator = nextPart[0];
		valueBinString += nextPart.slice(1);
		done = doneIndicator === '0';
		i += 5;
	}
	
	const valueBinStringWithoutLeadingZeros = trimLeadingZeros(valueBinString);
	const value = parseInt(valueBinStringWithoutLeadingZeros, 2);
	const processedLength = i;
	return [value, processedLength ]
}

// Return subOfVersionNumbers, processed length
function processPacket(packetString){
	const packetVersion = parseInt(packetString.slice(0,3),2);
	const packetType = parseInt(packetString.slice(3,6),2);
	if(packetType === 4){
		// literal value
		const [value, processedLength] = processLiteralValuePacket(packetString.slice(6));
		console.log({value, processedLength});
		return [packetVersion, 6 + processedLength];
	}
	const lengthTypeId = parseInt(packetString.slice(6,7),2);
	let subPacketVersionNumberSum = 0;
	let subPacketStartPointer = 0;
	let subPacketProcessedLength = 0;
	let leadingSectionLength = 7;
	if(lengthTypeId === 0){
		console.log('BitLength!')
		// subPacketLengths in bits
		leadingSectionLength = 7 + 15;
		const binaryValue = trimLeadingZeros(packetString.slice(7, leadingSectionLength));
		const subPacketLengthInBits = parseInt(binaryValue, 2);
		const subPackets = packetString.slice(leadingSectionLength);
		console.log({leadingSectionLength, subPackets})
		if(subPackets === '') {
			throw error
		}
		while(subPacketProcessedLength < subPacketLengthInBits){
			const [versionNumberSum, processedLength] = processPacket(subPackets.slice(subPacketStartPointer));
			subPacketVersionNumberSum += versionNumberSum;
			subPacketProcessedLength += processedLength;
			subPacketStartPointer += processedLength;
			console.log({subPacketProcessedLength, subPacketLengthInBits, subPacketStartPointer})
		}
	} else {
		console.log('Subpacket number')
		// Number of subpackets
		leadingSectionLength = 7 + 11;
		const binaryValue = trimLeadingZeros(packetString.slice(7, leadingSectionLength));
		const numberOfSubPackets = parseInt(binaryValue, 2);
		const subPackets = packetString.slice(leadingSectionLength);
		let subPacketCount = 0;
		console.log({leadingSectionLength, subPackets})
		if(subPackets === '') {
			throw error
		}
		while(subPacketCount < numberOfSubPackets){
			const [versionNumberSum, processedLength] = processPacket(subPackets.slice(subPacketStartPointer));
			subPacketVersionNumberSum += versionNumberSum;
			subPacketProcessedLength += processedLength;
			subPacketCount++;
			subPacketStartPointer += processedLength;
		}
	}
	return [subPacketVersionNumberSum + packetVersion, subPacketProcessedLength + leadingSectionLength]
}
function solution(data){
	const [sumOfPacketVersions, processedLength] = processPacket(data);
	return sumOfPacketVersions;
}
function prepareInput(inputData){
	return inputData.split('').reduce((string, val)=>{
		const valAsBin = parseInt('0x'+val).toString(2);
		return string + valAsBin.padStart(4, '0');
	}, '');
}
function readFile(filename){
	return fs.readFileSync(path.resolve(__dirname, filename),{encoding:'utf-8'});
}
function readPrepareAndSolve(filename){
	const fileData = readFile(filename);
	const startTime = Date.now();
	const inputData = prepareInput(fileData);
	const result = solution(inputData);
	const runtime = Date.now() - startTime;
	return [result, runtime];
}