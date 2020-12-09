# Standard File import method
inputfile = open('input.txt','r')
inputtext = inputfile.read()
inputfile.close()

# Lesson learned:
# list[i:j] creates a list of values from list[i]->list[j-1]

# --- Solution code --- 
def hasSumToNum(inputList, inputNum):
	checkedList = []
	for sumNum in inputList:
		for checkedNum in checkedList:
			if sumNum + checkedNum == inputNum:
				return True
		checkedList.append(sumNum)	
	return False

def castToInt(val):
	trimmedVal = val.strip()
	return int(trimmedVal)

inputlist = list(map(castToInt, inputtext.split('\n')))
preambleSize = 25
key = -1

for i in range(preambleSize, len(inputlist)):
	numsToSumStart = i-preambleSize
	numsToSumEnd = i
	numToCheck = inputlist[i]
	numsToSum = inputlist[numsToSumStart:numsToSumEnd]
	if( not hasSumToNum(numsToSum, numToCheck)):
		key = numToCheck
		print('Invalid Number : {} at {}'.format(numToCheck, i ))
		break

for i in range(0, len(inputlist)):
	for j in range(i, len(inputlist)):
		listToCheck = inputlist[i:j]
		if( sum(listToCheck) == key):
			minimum = min(listToCheck)
			maximum = max(listToCheck)
			print('Min:{}, Max:{}, Sum:{}'.format(minimum, maximum, minimum + maximum ) )