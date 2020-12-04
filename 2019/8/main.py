import math
inputfile = open('input.txt','r')
inputtext = inputfile.read()
inputfile.close()

imgWidth = 25
imgHeight = 6
def splitTextToImgLayers(text, imgWidth, imgHeight):
    output = []
    tmptext = text
    while( len(tmptext) >= imgWidth * imgHeight ):
        layer = tmptext[:(imgWidth * imgHeight)]
        tmptext = tmptext[(imgWidth * imgHeight):]
        output.append(layer)
    return output

imgLayers = splitTextToImgLayers(inputtext, imgWidth, imgHeight)

lowestZeroCount = math.inf
lowestZeroLocation = -1
for i in range(0, len(imgLayers)):
    thisLayer = imgLayers[i]
    zeroCount = thisLayer.count('0')
    if( zeroCount < lowestZeroCount ):
        lowestZeroCount = zeroCount
        lowestZeroLocation = i

twoCount = imgLayers[lowestZeroLocation].count('2')
oneCount = imgLayers[lowestZeroLocation].count('1')
print( oneCount * twoCount )

def decodeImg(imgLayers, imgWidth, imgHeight):
    outputImg = list()
    for i in range(0, imgWidth * imgHeight ):
        pixelValue = ''
        j = 0
        while( j < len(imgLayers)):
            thisPixel = imgLayers[j][i]
            if( thisPixel == '1'):
                pixelValue = '#'
                j = len(imgLayers) 
            elif( thisPixel == '0' ):
                pixelValue = '.'
                j = len(imgLayers) 
            j += 1
        outputImg.append(pixelValue)
    return ''.join(outputImg)

decodedImg = decodeImg(imgLayers, imgWidth, imgHeight)

# print img rows
while( len(decodedImg) >= imgWidth ):
    print(decodedImg[:imgWidth])
    decodedImg = decodedImg[imgWidth:]