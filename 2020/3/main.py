inputfile = open('input.txt','r')
inputlines = inputfile.readlines()
inputfile.close()

def CheckSlope(right, down):
    treecount = 0
    leftloc = 0
    downloc = 0
    while( (downloc+down) < len(inputlines)):
        downloc += down
        line = inputlines[downloc].strip()
        leftloc = (leftloc + right)%len(line)
        print(leftloc, len(line))
        if( line[leftloc] == '#'):
            treecount += 1
    return treecount

slopes = [CheckSlope(1,1), CheckSlope(3,1), CheckSlope(5,1), CheckSlope(7,1), CheckSlope(1,2)]
print(slopes)
product = 0
for slope in slopes:
    if(product ==0 ):
        product = slope
    else:
        product *= slope
print(product)