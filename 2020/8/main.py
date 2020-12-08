# Standard File import method
inputfile = open('input.txt','r')
inputtext = inputfile.read()
inputfile.close()

# --- Solution code ---
inputlines = inputtext.split('\n')

# Part 1
def runAccumulator(operationArray, repeatVisitsAllowed = 0):
	value = 0
	loc = 0
	secondRunDict = {}
	while loc < len(operationArray):
		commandValueSplit = operationArray[loc].split(' ')	
		command = commandValueSplit[0]
		commandValue = int(commandValueSplit[1])
		if(command == 'nop'):
			loc += 1
		elif( command == 'acc'):
			value += commandValue
			loc += 1
		elif( command == 'jmp'):
			loc += commandValue
		dictKey = str(loc)
		if dictKey in secondRunDict :
			if( secondRunDict[dictKey] + 1 > repeatVisitsAllowed ):
				#print('Repeat command detected! Location: {}, AccValue:{}'.format(loc, value))
				return False, value
			else:
				secondRunDict[dictKey] += 1
		else:
			secondRunDict[dictKey] = 0
		if( loc == len(operationArray)):
			print('Normal Termination! AccValue:{} Value:{}'.format(loc, value))
	print('Normal Termination! AccValue:{} Value:{}'.format(loc, value))
	return True, value
runAccumulator(inputlines)

# Part 2
# Find all jmp and nop statements
def getCommandAndCommandValue(command):
	commandValueSplit = command.split(' ')	
	command = commandValueSplit[0]
	commandValue = int(commandValueSplit[1])
	return command, commandValue

jmpOrNopArray = []
for i in range(0, len(inputlines)):
	command, commandValue = getCommandAndCommandValue(inputlines[i])
	if( command == 'nop' or command == 'jmp'):
		jmpOrNopArray.append(i)
jmpOrNopArray.reverse()
for repeatsAllowed in range(0, 10):
	print('Allowing {} repeat visits'.format(repeatsAllowed))
	for locToSwitch in jmpOrNopArray:
		thisProgram = inputlines.copy()
		if 'nop' in thisProgram[locToSwitch]:
			thisProgram[locToSwitch] = thisProgram[locToSwitch].replace('nop', 'jmp')
		else:
			thisProgram[locToSwitch] = thisProgram[locToSwitch].replace('jmp', 'nop')
		#print( 'Loc {}, {}->{}'.format(locToSwitch, inputlines[locToSwitch], thisProgram[locToSwitch]))
		runAccumulator(thisProgram, repeatsAllowed)
		