import math
inputfile = open('input.txt','r')
inputlines = inputfile.readlines()
inputfile.close()

def findSeatId(passCode):
    rowRange = list(range(0, 128))
    colRange = list(range(0, 8))

    rowCode = passCode[:7]
    for letter in rowCode :
        if( letter == 'F' ):
            rowRange = rowRange[:math.ceil(len(rowRange)/2)]
        if( letter == 'B'):
            rowRange = rowRange[math.floor(len(rowRange)/2):]

    colCode = passCode[-3:]
    for letter in colCode :
        if( letter == 'L' ):
            colRange = colRange[:math.ceil(len(colRange)/2)]
        if( letter == 'R'):
            colRange = colRange[math.floor(len(colRange)/2):]
    
    rowVal = rowRange[0]
    colVal = colRange[0]

    return (rowVal * 8) + colVal

def processPassCode(passCodeToProcess):
    passCode = passCodeToProcess.strip()
    return findSeatId(passCode)

#part 1
print(max(map(processPassCode, inputlines)))

#part 2
existingSeatIds = list(map(processPassCode, inputlines))
existingSeatIds.sort()

for i in range(0, len(existingSeatIds)-1):
    thisSeat = existingSeatIds[i]
    nextSeat = existingSeatIds[i+1]
    if(thisSeat != (nextSeat-1)):
        print('Missing seat ID between {} and {}. Id of missing seat is {}'.format(thisSeat, nextSeat, (thisSeat+1)))