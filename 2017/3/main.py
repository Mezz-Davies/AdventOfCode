import math
# Standard File import method
inputfile = open('input.txt','r')
inputtext = inputfile.read()
inputfile.close()

# --- Solution code --- 
def getShellMaxValue(shellN : int) -> int:
    return ((shellN * 2)+1)**2

def getSpiralCoordsOfN(n : int) -> tuple:
    if n <= 1:
        return (0, 0)
    
    shellNumber = 0
    while (shellNumber * 2 + 1)**2 < n:
        shellNumber += 1
    
    # Min value is max val of previous shell plus 1
    shellMin = getShellMaxValue(shellNumber-1)+1
    shellMax = getShellMaxValue(shellNumber)
    shellSize = shellMax - shellMin + 1

    distanceAlongShell = n - shellMin
    edgeSize = shellSize // 4
    edge = distanceAlongShell // edgeSize
    distanceAlongEdge = (n-shellMin) - (edgeSize * edge)

    x = 0
    y = 0
    if edge == 0:
        x = shellNumber
        y = -shellNumber+1 + distanceAlongEdge
    elif edge == 1:
        x = shellNumber-1 - distanceAlongEdge
        y = shellNumber
    elif edge == 2:
        x = -shellNumber
        y = shellNumber-1 - distanceAlongEdge
    elif edge == 3:
        x = -shellNumber+1 + distanceAlongEdge
        y = -shellNumber 
    return (x, y)

def getManhattanDistanceToOrigin(point : tuple) -> int:
    x, y = point
    if x < 0:
        x *= -1
    if y < 0:
        y *= -1
    return x + y

def solvePart1(n : int):
    point = getSpiralCoordsOfN(n)
    print(getManhattanDistanceToOrigin(point))
'''
solvePart1(1) # 0
solvePart1(12) # 1
solvePart1(23) # 1
solvePart1(1024) # 1
solvePart1(347991)
'''

# Part 2
def getArrayOfSurroundingPoints(point : tuple) -> list:
    output = []
    x, y = point
    pointRange = [-1,0,1]
    for i in pointRange:
        for j in pointRange:
            if not(i == 0 and j == 0):
                output.append((x + i, y + j))
    return output

def populateValues(maxValue : int):
    values = {(0,0) : 1}
    done = False
    n = 2
    while not(done):
        point = getSpiralCoordsOfN(n)
        surroundingPoints = getArrayOfSurroundingPoints(point)
        value = 0
        for surround in surroundingPoints:
            if surround in values:
                value += values[surround]
        if value > maxValue:
            done = True
            return value
        values[point] = value
        #print(point, value, surroundingPoints)
        n += 1

print(getSpiralCoordsOfN(1))
print(getArrayOfSurroundingPoints((0, 0)))
print(populateValues(347991))
