# puzzle : https://adventofcode.com/2019/day/3
import math

input = open("input.txt","r")
inputlines = input.readlines()

class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    def isCenter(self):
        return self.x == 0 and self.y == 0
    def __str__(self):
        return '('+str(self.x)+','+str(self.y)+')'
    def __repr__(self):
        return '('+str(self.x)+','+str(self.y)+')'

class PathSegment:
    def __init__(self, point1, point2):
        self.point1 = point1
        self.point2 = point2
        self.x1 = point1.x
        self.x2 = point2.x
        self.y1 = point1.y
        self.y2 = point2.y
        self.a = self.y2 - self.y1
        self.b = self.x1 - self.x2
        self.c = (self.a * self.x1) + (self.b * self.y1)
    
    def isPointInSegment(self, pointToCheck):
        xInRange = min(self.x1, self.x2) <= pointToCheck.x and pointToCheck.x <= max(self.x1, self.x2 )
        yInRange = min(self.y1, self.y2) <= pointToCheck.y and pointToCheck.y <= max(self.y1, self.y2 )
        return xInRange and yInRange

    def getIntersectingPoint(self, segmentToCheck):
        a1 = self.a
        b1 = self.b
        c1 = self.c

        a2 = segmentToCheck.a
        b2 = segmentToCheck.b
        c2 = segmentToCheck.c

        det = a1*b2 - a2*b1
        if( det == 0 ):
            #Parallel. Cannot cross.
            return False

        intersectX = (b2*c1 - b1*c2) / det
        intersectY = (a1*c2 - a2*c1) / det

        crossingPoint = Point(intersectX, intersectY)
        if( self.isPointInSegment(crossingPoint) and segmentToCheck.isPointInSegment(crossingPoint) and not crossingPoint.isCenter()):
            return crossingPoint
        return False

    def getSegmentSteps(self):
        xDiff = math.fabs(self.x1 - self.x2)
        yDiff = math.fabs(self.y1 - self.y2)
        return xDiff + yDiff

    def __str__(self):
        return str(self.point1)+'->'+str(self.point2)
    def __repr__(self):
        return "<Segment a:%s b:%s>" % (str(self.point1), str(self.point2))
    
class Path:
    def __init__(self):
        self.points = [Point(0, 0)]
        self.segments = []

    def getLastPoint(self):
        return self.points[len(self.points)-1]

    def addPointToPath(self, pointToAdd):
        segmentToAdd = PathSegment(self.getLastPoint(), pointToAdd)
        self.points.append(pointToAdd)
        self.segments.append(segmentToAdd)

    def getIntersectingPoints(self, otherPathToCheck):
        intersectingPoints = []
        for selfSegment in self.segments:
            for otherSegment in otherPathToCheck.segments:
                intersectingPoint = selfSegment.getIntersectingPoint(otherSegment)
                if( intersectingPoint != False ):
                    intersectingPoints.append(intersectingPoint)
        return intersectingPoints
    
    def getStepsToPoint(self, point):
        stepsTaken = 0
        for segment in self.segments:
            if( not segment.isPointInSegment(point)):
                stepsTaken += segment.getSegmentSteps()
            else:
                tempSegment = PathSegment(segment.point1, point)
                stepsTaken += tempSegment.getSegmentSteps()
                break
        return stepsTaken

    def __repr__(self):
        return ', '.join(map(str,self.segments))
                

def getNextPointFromCommand(startPoint, command):
    commandDirection = command[0]
    commandValue = int(command[1:])
    next_point = Point(startPoint.x, startPoint.y)
    if( commandDirection == 'U' ):
        next_point.y += commandValue
    elif( commandDirection == 'D' ):
        next_point.y -= commandValue
    elif( commandDirection == 'R' ):
        next_point.x += commandValue
    elif( commandDirection == 'L' ):
        next_point.x -= commandValue
    else:
        print('Command ' + commandDirection + ' not recognised' )
    return next_point

def getManhattanDistanceBetweenPoints(a, b):
    xDiff = math.fabs(a.x - b.x)
    yDiff = math.fabs(a.y - b.y)
    return xDiff + yDiff
def getManhattanDistanceToCentre(point):
    centre = Point(0, 0)
    return getManhattanDistanceBetweenPoints(centre, point)

Paths = []
for line in inputlines:
    commandList = line.split(',')
    thisPath = Path()
    for command in commandList:
        lastPoint = thisPath.getLastPoint()
        nextPoint = getNextPointFromCommand(lastPoint, command)
        thisPath.addPointToPath(nextPoint)
    Paths.append(thisPath)

print('*** PATHS ***')
print(Paths)
print('*** CROSSING POINTS ***')
intersectingPoints = Paths[0].getIntersectingPoints(Paths[1])
print( intersectingPoints )
print('*** MANHATTAN DISTANCE ***')
minimumMahattanDistance = min(map(getManhattanDistanceToCentre, intersectingPoints))

stepsToIntersect = []
for intersect in intersectingPoints:
    def countStepsToPoint(Path):
        return Path.getStepsToPoint(intersect)
    stepsToIntersect.append( sum(map(countStepsToPoint, Paths) ) )

print(min(stepsToIntersect))
print(minimumMahattanDistance)
