# Puzzle : https://adventofcode.com/2020/day/1

input = open("input.txt","r")
inputlines = input.readlines()

numberarray = []
for line in inputlines:
    numberarray.append(int(line.strip()))
calcarray = []

combination = [0,0]
for i in range(0, len(numberarray)):
    first = numberarray[i]
    for j in range(0, len(numberarray)):
        second = numberarray[j]
        if( first + second == 2020 ):
            combination[0] = first
            combination[1] = second

print( 'Part 1:')
print( 'Combination found' )
print( combination )
code = combination[0] * combination[1]
print( 'The code is:')
print( code )

print( 'Part 2:')
combination2 = [0,0, 0]
for i in range(0, len(numberarray)):
    first = numberarray[i]
    for j in range(0, len(numberarray)):
        second = numberarray[j]
        for k in range(0, len(numberarray)):
            third = numberarray[k]
            if( first + second + third == 2020 ):
                combination2[0] = first
                combination2[1] = second
                combination2[2] = third

print( 'Part 2:')
print( 'Combination found' )
print( combination2 )
code = combination2[0] * combination2[1] * combination2[2]
print( 'The code is:')
print( code )