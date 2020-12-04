import intCode
import itertools

inputfile = open('input.txt','r')
inputprogram = inputfile.read()
inputfile.close()

possibleSettings = [5,6,7,8,9]
possiblePermutations = itertools.permutations(possibleSettings)

ampNumber = 5
ampArray = []
ampStatus = []
for i in range(0, ampNumber):
    ampArray.append( intCode.IntCodeComputer() )
    ampStatus.append( False )

def resetPrograms():
    for amp in ampArray:
        amp.reset(inputprogram)
    for i in range(0,len(ampStatus)):
        ampStatus[i] = False

highestOutput = 0
highestOutputPermutation = []
for permutation in possiblePermutations:
    resetPrograms()
    for i in range(0, len(permutation)):
        ampArray[i].inputs.append(permutation[i])
    lastoutput = 0
    programFinished = False
    currentAmp = 0
    print(permutation)
    while( not programFinished):
        print( 'Running amp {} with input {}'.format(currentAmp, lastoutput))
        amp = ampArray[currentAmp]
        ampoutput = amp.run([lastoutput])
        programFinished = amp.complete
        lastoutput = ampoutput[len(ampoutput) - 1]
        currentAmp = (currentAmp + 1) % ampNumber
        ampStatus[currentAmp] = amp.complete
        for status in ampStatus:
            programFinished = programFinished and status
    # for i in range(0, ampNumber):
    #     amp = ampArray[i]
    #     ampoutput = amp.run([permutation[i], lastoutput])
    #     lastoutput = ampoutput[0]
    if( lastoutput > highestOutput ):
        highestOutput = lastoutput
        highestOutputPermutation = permutation

print('{} was the highest output from settings {}'.format(highestOutput, highestOutputPermutation))