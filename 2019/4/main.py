import re

input = '178416-676461'

print('--- Part 1 ---')
def isValidPassword(passwordToCheck):
    is6Digits = len(passwordToCheck) == 6
    hasIncreasingDigitValues = True
    hasPairOfDigits = False
    for i in range(1, len(passwordToCheck) ):
        thisDigit = int(passwordToCheck[i])
        lastDigit = int(passwordToCheck[i-1])
        if( thisDigit == lastDigit ):
            hasPairOfDigits = True
        hasIncreasingDigitValues = hasIncreasingDigitValues and ( thisDigit >= lastDigit )
    return is6Digits and hasIncreasingDigitValues and hasPairOfDigits

inputvalues = input.split('-')
minvalue = int(inputvalues[0])
maxvalue = int(inputvalues[1])
print( isValidPassword('111111') )
validCount = 0
for i in range(minvalue, maxvalue):
    passwordToCheck = str(i)
    if( isValidPassword(passwordToCheck) ):
        validCount += 1

print(validCount)

print('--- Part 2 ---')
def find_all(a_str, sub):
    start = 0
    while True:
        start = a_str.find(sub, start)
        if start == -1: return
        yield start
        start += len(sub) # use start += 1 to find overlapping matches

def isValidPasswordPart2(passwordToCheck):
    is6Digits = len(passwordToCheck) == 6
    hasIncreasingDigitValues = True
    hasPairOfDigits = False
    for i in range(1, len(passwordToCheck) ):
        thisDigit = int(passwordToCheck[i])
        lastDigit = int(passwordToCheck[i-1])
        hasIncreasingDigitValues = hasIncreasingDigitValues and ( thisDigit >= lastDigit )
    for i in range(0, 10):
        regexstring = '^[^{}]*{}{}[^{}]*$'.format(i, i, i, i)
        result = re.findall(regexstring, passwordToCheck)
        if( len(result)>0 ):
            hasPairOfDigits = True

    return is6Digits and hasIncreasingDigitValues and hasPairOfDigits
            
part2ValidCount = 0
for i in range(minvalue, maxvalue):
    passwordToCheck = str(i)
    if( isValidPasswordPart2(passwordToCheck) ):
        part2ValidCount += 1 
print(part2ValidCount)         