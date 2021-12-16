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
		return [value, packetVersion, 6 + processedLength];
	}
	const lengthTypeId = parseInt(packetString.slice(6,7),2);
	let subPacketVersionNumberSum = 0;
	let subPacketStartPointer = 0;
	let subPacketProcessedLength = 0;
	let leadingSectionLength = 7;
	let subPacketValues = [];
	if(lengthTypeId === 0){
		// subPacketLengths in bits
		leadingSectionLength = 7 + 15;
		const binaryValue = trimLeadingZeros(packetString.slice(7, leadingSectionLength));
		const subPacketLengthInBits = parseInt(binaryValue, 2);
		const subPackets = packetString.slice(leadingSectionLength);
		if(subPackets === '') {
			throw error
		}
		while(subPacketProcessedLength < subPacketLengthInBits){
			const [subPacketValue, versionNumberSum, processedLength] = processPacket(subPackets.slice(subPacketStartPointer));
			subPacketVersionNumberSum += versionNumberSum;
			subPacketProcessedLength += processedLength;
			subPacketStartPointer += processedLength;
			subPacketValues.push(subPacketValue)
		}
	} else {
		// Number of subpackets
		leadingSectionLength = 7 + 11;
		const binaryValue = trimLeadingZeros(packetString.slice(7, leadingSectionLength));
		const numberOfSubPackets = parseInt(binaryValue, 2);
		const subPackets = packetString.slice(leadingSectionLength);
		let subPacketCount = 0;
		if(subPackets === '') {
			throw error
		}
		while(subPacketCount < numberOfSubPackets){
			const [subPacketValue, versionNumberSum, processedLength] = processPacket(subPackets.slice(subPacketStartPointer));
			subPacketVersionNumberSum += versionNumberSum;
			subPacketProcessedLength += processedLength;
			subPacketCount++;
			subPacketStartPointer += processedLength;
			subPacketValues.push(subPacketValue)
		}
	}

	let packetValue = 0;

	switch(packetType){
		case 0:
			//sum!
			packetValue = subPacketValues.reduce((sum, val)=>sum+val, 0);
			break;
		case 1:
			//product!
			packetValue = subPacketValues.reduce((product, val, i)=>{
				if(i === 0){
					return val;
				} else {
					return product * val
				}
			});
			break;
		case 2:
			//minimum!
			packetValue = Math.min(...subPacketValues);
			break;
		case 3:
			// maximum!
			packetValue = Math.max(...subPacketValues);
			break;
		// 4 is handled above
		case 5:
			// Greater than. Only 2 subpackets!
			packetValue = subPacketValues[0] > subPacketValues[1] ? 1 : 0
			break;
		case 6:
			// Less than. Only 2 subpackets!
			packetValue = subPacketValues[0] < subPacketValues[1] ? 1 : 0
			break;
		case 7:
			// Equal to. Only 2 subpackets!
			packetValue = subPacketValues[0] === subPacketValues[1] ? 1 : 0
			break;
		default:
			console.error(`Unknown packet type ${packetType}`);
			throw error;
	}

	return [packetValue, subPacketVersionNumberSum + packetVersion, subPacketProcessedLength + leadingSectionLength]
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