# Standard File import method
inputfile = open('input.txt','r')
inputtext = inputfile.read()
inputfile.close()

# --- Solution code --- 


def processInputToSpreadsheet(input : str) -> list :
    return [[int(x) for x in line.split()] for line in input.splitlines()]
    

# part 1
example = '''5 1 9 5
7 5 3
2 4 6 8'''

def calculateSpreadsheetChecksum(spreadsheet : list) -> int:
    sum = 0
    for line in spreadsheet:
        sum += max(line) - min(line) 
    return sum

def solvePart1(input : str):
    print(calculateSpreadsheetChecksum(processInputToSpreadsheet(input)))

solvePart1(example)
solvePart1(inputtext)

# part 2

example2 = '''5 9 2 8
9 4 7 3
3 8 6 5'''

def sumEvenlyDivisibleNumbers(spreadsheet : list) -> int:
    sum = 0
    for line in spreadsheet:
        for i in range(len(line)):
            for j in range(len(line)):
                if i != j:
                    a = line[i]
                    b = line[j]
                    if (float(a//b) == a/b):
                        sum += a//b
    return sum

def solvePart2(input : str):
    print(sumEvenlyDivisibleNumbers(processInputToSpreadsheet(input)))

solvePart2(example2)
solvePart2(inputtext)