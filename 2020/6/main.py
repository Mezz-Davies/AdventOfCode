inputfile = open('input.txt','r')
inputtext = inputfile.read()
inputfile.close()

def countUniqueQuestionsAnswered(groupAnswers):
	answersDict = {}
	answersOfPeopleInGroup = groupAnswers.split('\n')
	for person in answersOfPeopleInGroup:
		questionsAnswered = [char for char in person]
		for questionLetter in questionsAnswered:
			answersDict[questionLetter] = True
	return len(answersDict.keys())

groupAnswers = inputtext.split('\n\n')
print(sum(map(countUniqueQuestionsAnswered, groupAnswers)))

def countQuestionsAnsweredAllYes(groupAnswers):
	answersDict = {}
	answersOfPeopleInGroup = groupAnswers.split('\n')
	for person in answersOfPeopleInGroup:
		questionsAnswered = [char for char in person]
		for questionLetter in questionsAnswered:
			if questionLetter in answersDict:
				answersDict[questionLetter] += 1
			else:
				answersDict[questionLetter] = 1
	def filterFunction(item):
		return answersDict[item] == len(answersOfPeopleInGroup)
	allYesAnswers = list(filter(filterFunction,answersDict.keys()))
	return len(allYesAnswers)
secondPartAnswers = inputtext.split('\n\n')
print(sum(map(countQuestionsAnsweredAllYes, secondPartAnswers)))