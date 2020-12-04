# puzzle : https://adventofcode.com/2019/day/2

input = open("input.txt","r")
inputlines = input.read()

def processIntCode(array, startLoc):
    isFinished = False

    command = array[startLoc]
    input1position = array[startLoc+1]
    input2position = array[startLoc+2]
    outputposition = array[startLoc+3]

    if(command == 1):
        outputvalue = array[input1position] + array[input2position]
        array[outputposition] = outputvalue
    elif(command == 2):
        outputvalue = array[input1position] * array[input2position]
        array[outputposition] = outputvalue
    elif(command == 99):
        isFinished = True
    else:
        print('Unrecognised command!')

    return isFinished 

def castToInt(string):
    return int(string)

intcode = list(map(castToInt, inputlines.split(',')))

def runIntCodeProgram(noun, verb):
    checkFinished = False
    startLoc = 0
    intcode = list(map(castToInt, inputlines.split(',')))
    intcode[1] = noun
    intcode[2] = verb
    while(checkFinished == False):
        checkFinished = processIntCode(intcode, startLoc)
        startLoc += 4
    return intcode[0]

for i in range(0, 99):
    for j in range(0, 99):
        result = runIntCodeProgram(i, j)
        if( result == 19690720 ):
            print( "noun : " + str(i) + ", verb : " + str(j) )