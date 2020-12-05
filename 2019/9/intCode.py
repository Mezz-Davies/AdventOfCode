def decodeInstruction(instructionToDecode):
    paddedInstruction = str(instructionToDecode).rjust(5, '0')
    instruction = int(paddedInstruction[-2:])
    parameter1mode = int(paddedInstruction[-3:-2])
    parameter2mode = int(paddedInstruction[-4:-3])
    parameter3mode = int(paddedInstruction[-5:-4])
    return instruction, parameter1mode, parameter2mode, parameter3mode

def castToInt(string):
    return int(string)

class IntCodeComputer:
    def __init__(self, stringProgram=''):
        self.reset(stringProgram)

    def reset(self, stringProgram='', resetMemory=True):
        self.program = list(map(castToInt,stringProgram.split(','))) if stringProgram != '' else []
        self.position = 0
        self.complete = False
        self.waiting = False
        self.inputs = []
        self.outputs = []
        self.memory = dict()

    def getParameterValue(self, parameterLoc, parameterMode):
        if(parameterMode == 0): # Position
            parameterValueLocation = self.program[parameterLoc]
            return self.program[parameterValueLocation]
        elif(parameterMode == 1): # Immediate
            return self.program[parameterLoc]

    def setParameterValue(self, parameterLoc, parameterValue):
        self.program[parameterLoc] = parameterValue

    def step(self):
        startPosition = self.position
        nextPosition = self.position
        instruction, parameter1mode, parameter2mode, parameter3mode = decodeInstruction(self.program[startPosition])
        if(instruction == 1): # SUM
            param1 = self.getParameterValue(startPosition+1, parameter1mode)
            param2 = self.getParameterValue(startPosition+2, parameter2mode)
            writeDestination = self.program[startPosition+3]
            self.setParameterValue(writeDestination, param1+param2)
            nextPosition += 4
        elif(instruction == 2): # MULTIPLY
            param1 = self.getParameterValue(startPosition+1, parameter1mode)
            param2 = self.getParameterValue(startPosition+2, parameter2mode)
            writeDestination = self.program[startPosition+3]
            self.setParameterValue(writeDestination, param1*param2)
            nextPosition += 4
        elif(instruction == 3): # INPUT
            if( len(self.inputs) > 0 ):
                presetInput = int(self.inputs[0])
                writeDestination = self.program[startPosition+1]
                self.setParameterValue(writeDestination, presetInput)
                self.inputs.pop(0)
            else:
                user_input = int(input('Please provide requested number input:'))
                writeDestination = self.program[startPosition+1]
                self.setParameterValue(writeDestination, user_input)
            nextPosition += 2
        elif(instruction == 4): # OUTPUT
            valueToOutput = self.getParameterValue(startPosition+1, parameter1mode)
            self.outputs.append(valueToOutput)
            self.waiting = True
            nextPosition += 2
        elif(instruction == 5): # JUMP-IF-TRUE
            param1 = self.getParameterValue(startPosition+1, parameter1mode)
            param2 = self.getParameterValue(startPosition+2, parameter2mode)
            if(param1 != 0):
                nextPosition = param2
            else:
                nextPosition += 3
        elif(instruction == 6): # JUMP-IF-NOT-TRUE
            param1 = self.getParameterValue(startPosition+1, parameter1mode)
            param2 = self.getParameterValue(startPosition+2, parameter2mode)
            if(param1 == 0):
                nextPosition = param2
            else:
                nextPosition += 3
        elif(instruction == 7): # LESS THAN
            param1 = self.getParameterValue(startPosition+1, parameter1mode)
            param2 = self.getParameterValue(startPosition+2, parameter2mode)
            writeDestination = self.program[startPosition+3]
            if(param1 < param2):
                self.setParameterValue(writeDestination, 1)
            else:
                self.setParameterValue(writeDestination, 0)
            nextPosition += 4
        elif(instruction == 8): # EQUALS
            param1 = self.getParameterValue(startPosition+1, parameter1mode)
            param2 = self.getParameterValue(startPosition+2, parameter2mode)
            writeDestination = self.program[startPosition+3]
            if(param1 == param2):
                self.setParameterValue(writeDestination, 1)
            else:
                self.setParameterValue(writeDestination, 0)
            nextPosition += 4
        elif(instruction == 99):
            self.complete = True
        else:
            print('Unrecognised command!')
        return nextPosition
    
    def run(self, inputArray=[]):
        self.waiting = False
        self.inputs.extend(inputArray)
        while(self.complete != True and self.waiting != True):
            self.position = self.step()
            if(self.position > len(self.program)):
                print('Error! Program out of bounds')
                self.complete = True
        return self.outputs