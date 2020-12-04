# Read input file
inputfile = open('input.txt','r')
inputlines = inputfile.readlines()
inputfile.close()

# Policy 1 - numbers are min and max occurances of letter
def decodeForPolicyOne(policy):
    # Decodes string with format %d-%d %c
    policyparts = policy.split(' ')
    policyletter = policyparts[1]
    minmaxvals = policyparts[0].split('-')
    minval = int(minmaxvals[0])
    maxval = int(minmaxvals[1])
    return policyletter, minval, maxval

policy1ValidCount = 0
for line in inputlines:
    lineparts = line.split(':')
    policy = lineparts[0]
    policyletter, minval, maxval = decodeForPolicyOne(policy)
    password = lineparts[1]
    occurances = password.count(policyletter)
    if( occurances >= minval and occurances <= maxval ):
        policy1ValidCount += 1

print( "{} of {} passwords are valid according to Policy 1".format(policy1ValidCount, len(inputlines) ))

# Policy 2 - numbers are positional options of letter
def decodeForPolicyTwo(policy):
    # Decodes string with format %d-%d %c
    policyparts = policy.split(' ')
    policyletter = policyparts[1]
    positionvals = policyparts[0].split('-')
    position1 = int(positionvals[0])
    position2 = int(positionvals[1])
    return policyletter, position1, position2

policy2ValidCount = 0
for line in inputlines:
    lineparts = line.split(':')
    policy = lineparts[0]
    policyletter, position1, position2 = decodeForPolicyTwo(policy)
    password = lineparts[1]
    if( password[position1] == policyletter and password[position2] != policyletter ):
        policy2ValidCount += 1
    elif( password[position1] != policyletter and password[position2] == policyletter ):
        policy2ValidCount += 1

print( "{} of {} passwords are valid according to Policy 2".format(policy2ValidCount, len(inputlines) ))