import re

# Standard File import method
inputfile = open('input.txt','r')
inputtext = inputfile.read()
inputfile.close()

example = '''pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (68) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)'''


# --- Solution code --- 
def solvePart1(input : str) -> str:
    programList = input.splitlines()
    programDict = {}
    for program in programList:
        line = program.split('->')
        programName = line[0].split(' ')[0]
        if not(programName in programDict):
            programDict[programName] = 0
        subCalls = [x.strip() for x in line[1].split(', ')] if len(line) > 1 else []
        for subCall in subCalls:
            if not(subCall in programDict):
                programDict[subCall] = 1
            else:
                programDict[subCall] += 1
    
    print(programDict)
    for programName, callCount in programDict.items():
        if callCount == 0:
            return programName

#print(solvePart1(example))
#print(solvePart1(inputtext))

# Part 2

def getProgramDetailsDict(input : str) -> dict:
    pattern = re.compile(r"(^([\S]+) \(([\d]+)\)$)|(^([\S]+) \(([\d]+)\) -> ([\s\S]+)$)")
    for m in pattern.findall(input):
        if m[0] != '':
            return {
                'name' : m[1],
                'weight' : int(m[2]),
                'calls' : []
            }
        else: 
            return {
                'name' : m[4],
                'weight' : int(m[5]),
                'calls' : [x.strip() for x in m[6].split(',')]
            }

programsDict = {}
def getBranchWeight(name : str) -> int:
    subCalls = [name for name in programsDict[name]['calls']]
    subCallWeights = sum([getBranchWeight(name) for name in subCalls]) if len(programsDict[name]['calls']) > 0 else 0
    return programsDict[name]['weight'] + subCallWeights

def getIndexOfOddValue(inputList : list) -> int:
    valueCounts = {}
    for val in inputList:
        stringVal = str(val)
        if not(stringVal in valueCounts.keys()):
            valueCounts[stringVal] = 1
        else:
            valueCounts[stringVal] += 1
    if len(valueCounts.keys()) > 1:
        for key in valueCounts.keys():
            if valueCounts[key] == 1:
                return inputList.index(int(key))
    return -1


def solvePart2(input : str) -> str:
    for line in input.splitlines():
        programDict = getProgramDetailsDict(line)
        programsDict[programDict['name']] = programDict
    for programName in programsDict.keys():
        subPrograms = programsDict[programName]['calls']
        branchWeights = [(name, getBranchWeight(name)) for name in subPrograms] if len(subPrograms) > 0 else []
        oddIndex = getIndexOfOddValue([weight for (_, weight) in branchWeights])
        if( oddIndex > -1 ):
            print(branchWeights)
            oddEntry = branchWeights.pop(oddIndex)
            targetWeight = branchWeights[0][1]
            weightDiff = oddEntry[1] - targetWeight
            oddName = oddEntry[0]
            oddWeight = programsDict[oddName]['weight']
            newWeight = oddWeight - weightDiff
            print(f"Program {oddName} has weight {oddWeight}, but should weigh {newWeight}")

            
#solvePart2(example)
solvePart2(inputtext)