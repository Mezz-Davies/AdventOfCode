# Standard File import method
inputfile = open('input.txt','r')
inputtext = inputfile.read()
inputfile.close()

example = '''0
3
0
1
-3'''
# --- Solution code --- 

#Part 1
def countJumpsToExit(input : list) -> int:
    loc = 0
    count = 0
    while loc >= 0 and loc < len(input):
        val = input[loc]  
        nextLoc = loc + val
        input[loc] += 1
        count += 1
        loc = nextLoc
    return count

def parseInputToIntList(input : str) -> list:
    return [int(x) for x in input.splitlines()]

print(countJumpsToExit(parseInputToIntList(example)))
print(countJumpsToExit(parseInputToIntList(inputtext)))

# Part 2
def countJumpsToExitPart2(input : list) -> int:
    loc = 0
    count = 0
    while loc >= 0 and loc < len(input):
        val = input[loc]
        nextLoc = loc + val
        if val >= 3:
            input[loc] -= 1
        else:
            input[loc] += 1
        count += 1
        loc = nextLoc
    return count

print(countJumpsToExitPart2(parseInputToIntList(example)))
print(countJumpsToExitPart2(parseInputToIntList(inputtext)))