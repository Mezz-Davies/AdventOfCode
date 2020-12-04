import re
inputfile = open('input.txt','r')
inputtext = inputfile.read()
inputfile.close()

def convertBatchInputToDict(batchInputLine):
    strippedBatchInputLine = batchInputLine.strip()
    newLineSeparatedFields = strippedBatchInputLine.split('\n')
    fields = []
    for field in newLineSeparatedFields:
        spaceSeparatedFields = field.split(' ')
        fields.extend(spaceSeparatedFields)
    outputDict = {}
    for field in fields:
        if(field != ''):
            fieldParts = field.split(':')
            fieldName = fieldParts[0]
            fieldValue = fieldParts[1]
            outputDict[fieldName] = fieldValue
    return outputDict

inputlines = inputtext.split('\n\n')
docsToValidate = []
for batchInput in inputlines:
    docsToValidate.append(convertBatchInputToDict(batchInput))

# byr (Birth Year) 4 digits, 1920 <= byr <= 2002
# iyr (Issue Year) 4 digits, 2010 <= byr <= 2020
# eyr (Expiration Year) 4 digits, 2020 <= byr <= 2030
# hgt (Height) number, followed by cm or in, if cm: 150 <= cm <= 193, if in: 59 <= in < 73
# hcl (Hair Color) hex color
# ecl (Eye Color) on of 'amb blu brn gry grn hzl oth'
# pid (Passport ID) 9 digits, including leading zeroes
# cid (Country ID) -- OPTIONAL

fieldsInValidDoc = ['byr','iyr','eyr','hgt','hcl','ecl','pid']
validEyeColors = ['amb','blu','brn','gry','grn','hzl','oth']

validDocsNumber = 0
for docToValidate in docsToValidate:
    isValid = True
    for field in fieldsInValidDoc:
        if not field in docToValidate:
            isValid = False
        else:
            val = docToValidate[field]
            if field == 'byr':
                isValid = isValid and int(val) >= 1920 and int(val) <= 2002
            elif field == 'iyr':
                isValid = isValid and int(val) >= 2010 and int(val) <= 2020
            elif field == 'eyr':
                isValid = isValid and int(val) >= 2020 and int(val) <= 2030
            elif field == 'hgt':
                cmIndex = val.find('cm')
                inIndex = val.find('in')
                if(cmIndex > -1):
                    cmValue = int(val[:cmIndex])
                    isValid = isValid and cmValue >= 150 and cmValue <= 193
                elif(inIndex > -1):
                    inValue = int(val[:inIndex])
                    isValid = isValid and inValue >= 59 and inValue <= 76
                else:
                    isValid = isValid and False
            elif field == 'hcl':
                colorSearch = re.search('^#(?:[0-9a-fA-F]{3}){1,2}$', val)
                if colorSearch == None:
                    isValid = isValid and False
            elif field == 'ecl':
                if not val in validEyeColors:
                    isValid = isValid and False
            elif field == 'pid':
                digitsSearch = re.search('^(?:[0-9]{9})$', val)
                if digitsSearch == None:
                    isValid = isValid and False
    if isValid:
        validDocsNumber += 1

print(validDocsNumber)