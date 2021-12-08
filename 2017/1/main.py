import re

# Standard File import method
inputfile = open('input.txt','r')
inputtext = inputfile.read()
inputfile.close()

examples = [
    '1122',
    '1111',
    '1234',
    '91212129'
]

# Part 1
def solveCaptcha( input : str ) -> int:
    continuousIntInput = [int(x) for x in input + input[0]]
    sum = 0
    for i in range(len(input)):
        if continuousIntInput[i] == continuousIntInput[i + 1]:
            sum += continuousIntInput[i]
    return sum
    
print('PART 1')
for example in examples:
    print(solveCaptcha(example))

print(solveCaptcha(inputtext))

# Part 2
def solveCaptcha2( input : str ) -> int:
    intInput = [int(x) for x in input]
    halfLen = len(intInput) // 2
    sum = 0
    for i in range(len(input)):
        halfwayRoundLoc = (i + halfLen) % len(input)
        if intInput[i] == intInput[halfwayRoundLoc]:
            sum += intInput[i]
    return sum
    
part2Examples = [
    '1212',
    '1221',
    '123425',
    '123123',
    '12131415'
]
print('PART 2')
for example in part2Examples:
    print(solveCaptcha2(example))

print(solveCaptcha2(inputtext))