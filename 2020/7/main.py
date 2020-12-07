inputfile = open('input.txt','r')
inputlines = inputfile.readlines()
inputfile.close()

def processRule(ruleLine):
	subjectContentSplit = ruleLine.split('contain')
	ruleSubject = subjectContentSplit[0][:-6]
	ruleContent = subjectContentSplit[1].strip()

	searchLoc = 1
	contentDict = {}
	while(searchLoc > 0):
		searchLoc = ruleContent.find('bag')
		if( searchLoc < 0 ):
			break
		currentTargetParts = ruleContent[:searchLoc].strip().split(' ')
		if currentTargetParts[0] == 'no': # ['no','other']
			break
		currentTargetNumber = int(currentTargetParts[0])
		currentTargetParts.pop(0)
		currentTargetSubject = ' '.join(currentTargetParts)
		contentDict[currentTargetSubject] = currentTargetNumber
		if( currentTargetNumber > 1 ):
			ruleContent = ruleContent[searchLoc+5:]
		else:
			ruleContent = ruleContent[searchLoc+4:]
	return ruleSubject, contentDict

rulesDict = {}
for line in inputlines:
	subject, content = processRule(line)
	rulesDict[subject] = content

print(rulesDict)

# part 1
def countPossibleContainerBags(colorToFind, rulesDict):
	searchList = [colorToFind]
	resultList = []
	while(len(searchList)> 0):
		nextSearchList = []
		for color, contents in rulesDict.items():
			for contentColor in contents.keys():
				if contentColor in searchList:
					resultList.append(color)
					nextSearchList.append(color)
		searchList = set(nextSearchList)
	return set(resultList)
print(len(countPossibleContainerBags('shiny gold', rulesDict)))

# part 2
def countRequiredBagsWithinRecursive(colorToFind, rulesDict, isTop=False):
	result = 0 if isTop else 1
	for colorWithin, colorCount in rulesDict[colorToFind].items():
		result += colorCount * countRequiredBagsWithinRecursive(colorWithin, rulesDict)
	return result
	
print(countRequiredBagsWithinRecursive('shiny gold', rulesDict, True))