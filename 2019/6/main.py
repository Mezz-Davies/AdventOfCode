inputfile = open('input.txt','r')
inputlines = inputfile.readlines()
inputfile.close()

class Node:
    def __init__(self, name):
        self.name = name
        self.parent = ''
        self.children = []
    def addChild(self, childname):
        if(not childname in self.children):
            self.children.append(childname)
        else:
            print('Duplicate child {} not added to {}'.format(childname, self.name))
    def setParent(self, parentname):
        if( self.parent != ''):
            print('Overwriting parent of {}'.format(self.name))
        self.parent = parentname
    def __str__(self):
        return '{}){}'.format(self.name, ', '.join(self.children))
    def __repr__(self):
        return '{}){}'.format(self.name, ', '.join(self.children))

StarMapDict = {}

# Input relationships
for line in inputlines:
    relationship = line.split(')')
    parentname = relationship[0].strip()
    parentnode = StarMapDict[parentname] if parentname in StarMapDict else Node(parentname)

    childname = relationship[1].strip()
    childnode = StarMapDict[childname] if childname in StarMapDict else Node(childname)
    childnode.setParent(parentname)
    parentnode.addChild(childname)

    StarMapDict[parentname] = parentnode
    StarMapDict[childname] = childnode

def countOrbitsRecursive(nodename):
    thisNode = StarMapDict[nodename]
    if(thisNode.parent == ''):
        return 0
    else:
        return 1 + countOrbitsRecursive(thisNode.parent)

print(StarMapDict)
orbitCount = sum(map(countOrbitsRecursive, list(StarMapDict)))
print(orbitCount)

# find minimum orbits from 'YOU' to 'SAN'
# Lowest common ancestor
def getListOfAncestors(nodename):
    ancestors = []
    thisNode = StarMapDict[nodename]
    while (thisNode.parent != ''):
        ancestors.append(thisNode.parent)
        thisNode = StarMapDict[thisNode.parent]
    return ancestors

youAncestors = list(getListOfAncestors('YOU'))
youAncestors.reverse()
sanAncestors = list(getListOfAncestors('SAN'))
sanAncestors.reverse()

while( youAncestors[1] == sanAncestors[1] ):
    youAncestors.pop(0)
    sanAncestors.pop(0)

print( youAncestors, sanAncestors )

pathFromYouToSanta = youAncestors.copy()
pathFromYouToSanta.reverse()
sanAncestors.pop(0) # remove common node
pathFromYouToSanta.extend(sanAncestors)

print( pathFromYouToSanta )
print( len(pathFromYouToSanta) - 1 ) # count jumps between nodes