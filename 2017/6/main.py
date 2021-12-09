import math
# Standard File import method
inputfile = open('input.txt','r')
inputtext = inputfile.read()
inputfile.close()

example = '''0 2 7 0'''
# --- Solution code --- 

def getLocOfLargest(arr : list) -> int:
    largestLoc = -1
    largestVal = -1
    
    for i in range(len(arr)):
        if arr[i] > largestVal:
            largestLoc = i
            largestVal = arr[i]

    return largestLoc

def redistributeValue(arr : list, locToRedistribute : int) -> list:
    valueToRedistribute = arr[locToRedistribute]
    arr[locToRedistribute] = 0
    currentLoc = locToRedistribute
    while(valueToRedistribute > 0):
        currentLoc = (currentLoc + 1) % len(arr)
        arr[currentLoc] += 1
        valueToRedistribute -= 1
    return arr

def getArrayHash(arr : list) -> str:
    return " ".join([str(x) for x in arr])

def solve(initialState : str) -> int:
    iterations = 0
    previousStates = []
    state = [int(x) for x in initialState.split()]
    while not( getArrayHash(state) in previousStates ):
        iterations += 1
        previousStates.append(getArrayHash(state))
        largestLoc = getLocOfLargest(state)
        state = redistributeValue(state, largestLoc)
    
    return iterations, iterations - previousStates.index(getArrayHash(state))

print(solve(example))

print(solve(inputtext))

        