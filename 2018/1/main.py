import re

# Standard File import method
inputfile = open('input.txt','r')
inputtext = inputfile.read()
inputfile.close()

example1 = '1122'

pattern = re.compile(r"(.)\1{1,}")

def getSumOfMatchingChars(input : str) -> int:
    sum = 0
    for match in pattern.findall(input):
        sum += 0


print(getSumOfMatchingChars(example1))