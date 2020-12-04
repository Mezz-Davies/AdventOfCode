# puzzle : https://adventofcode.com/2019/day/1
from functools import reduce
import math
input = open("input.txt","r")
inputlines = input.readlines()

numberarray = []
for line in inputlines:
    numberarray.append(int(line.strip()))

def calcFuelRequirement(mass):
    fuelRequirement = math.floor(mass / 3) - 2
    if( fuelRequirement < 0 ):
        return 0
    return fuelRequirement + calcFuelRequirement(fuelRequirement) # recursive component added for part 2
def calcTotalFuelRequirement(runningTotal, mass):
    return runningTotal + calcFuelRequirement(mass)

totalFuelRequirements = reduce(calcTotalFuelRequirement, numberarray, 0)
print( totalFuelRequirements )