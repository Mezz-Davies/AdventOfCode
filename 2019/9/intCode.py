def decodeInstruction(instructionToDecode):
    paddedInstruction = str(instructionToDecode).rjust(5, '0')
    instruction = int(paddedInstruction[-2:])
    parameter1mode = int(paddedInstruction[-3:-2])
    parameter2mode = int(paddedInstruction[-4:-3])
    parameter3mode = int(paddedInstruction[-5:-4])
    return instruction, parameter1mode, parameter2mode, parameter3mode

def castToInt(string):
    return int(string)

class IntCodeMemory:
    def __init__(self, programSize):
        self.reset()
        self.programSize = programSize
    def reset(self):
        self.memory = {}
    def get(self, loc):
        locInMemory = self.getMemoryLoc(loc)
        return self.memory[locInMemory]
    def set(self, loc, val):
        locInMemory = self.getMemoryLoc(loc)
        self.memory[locInMemory] = val
    def print(self):
        print(self.memory)
    def getMemoryLoc(self, loc):
        intLoc = loc - self.programSize
        if intLoc < 0:
            return ""
        return str(loc - self.programSize)


class IntCodeComputer:
    def __init__(self, stringProgram='', trace=False):
        self.reset(stringProgram, trace)

    def reset(self, stringProgram='', trace=False):
        self.program = list(map(castToInt,stringProgram.split(','))) if stringProgram != '' else []
        self.position = 0
        self.relativeBase = 0
        self.complete = False
        self.waiting = False
        self.inputs = []
        self.outputs = []
        self.memory = IntCodeMemory(len(self.program))
        self.trace = trace
        self.iterationCount = 0

    def getValueAtLoc(self, parameterLoc):
        if parameterLoc < len(self.program):
            return self.program[parameterLoc]
        else:
            return self.memory.get(parameterLoc)

    def getParameterValue(self, parameterLoc, parameterMode):
        output = None
        if(parameterMode == 0): # Position
            parameterValueLocation = self.program[parameterLoc]
            output = self.getValueAtLoc(parameterValueLocation)
        elif(parameterMode == 1): # Immediate
            output = self.getValueAtLoc(parameterLoc)
        elif(parameterMode == 2): # Relative
            parameterValueLocation = self.program[parameterLoc] + self.relativeBase
            output = self.getValueAtLoc(parameterValueLocation)
        if( self.trace ):
            print(f"Getting parameter @ {parameterLoc} with mode {parameterMode} : {output}")
        return output

    def setParameterValue(self, parameterLoc, parameterValue):
        if( self.trace ):
            print(f"Setting value {parameterValue} at location {parameterLoc}")
        if parameterLoc < len(self.program):
            self.program[parameterLoc] = parameterValue
        else:
            self.memory.set(parameterLoc)
        

    def step(self):
        self.iterationCount += 1
        startPosition = self.position
        nextPosition = self.position
        instruction, parameter1mode, parameter2mode, parameter3mode = decodeInstruction(self.program[startPosition])
        if(instruction == 1): # SUM
            param1 = self.getParameterValue(startPosition+1, parameter1mode)
            param2 = self.getParameterValue(startPosition+2, parameter2mode)
            writeDestination = self.program[startPosition+3]
            self.setParameterValue(writeDestination, param1+param2)
            nextPosition += 4
            if( self.trace ):
                print(f"Adding {param1} to {param2}. Storing in {writeDestination}")
        elif(instruction == 2): # MULTIPLY
            param1 = self.getParameterValue(startPosition+1, parameter1mode)
            param2 = self.getParameterValue(startPosition+2, parameter2mode)
            writeDestination = self.program[startPosition+3]
            self.setParameterValue(writeDestination, param1*param2)
            nextPosition += 4
            if( self.trace ):
                print(f"Multiplied {param1} by {param2}. Storing in {writeDestination}")
        elif(instruction == 3): # INPUT
            if( len(self.inputs) > 0 ):
                presetInput = int(self.inputs[0])
                writeDestination = self.program[startPosition+1]
                self.setParameterValue(writeDestination, presetInput)
                self.inputs.pop(0)
                if( self.trace ):
                    print(f"Read input {presetInput}")
            else:
                user_input = int(input('Please provide requested number input:'))
                writeDestination = self.program[startPosition+1]
                self.setParameterValue(writeDestination, user_input)
                if( self.trace ):
                    print(f"Read input {user_input}")
            nextPosition += 2
        elif(instruction == 4): # OUTPUT
            valueToOutput = self.getParameterValue(startPosition+1, parameter1mode)
            self.outputs.append(valueToOutput)
            self.waiting = True
            nextPosition += 2
            if( self.trace ):
                print(f"Outputting {valueToOutput}")
        elif(instruction == 5): # JUMP-IF-TRUE
            param1 = self.getParameterValue(startPosition+1, parameter1mode)
            param2 = self.getParameterValue(startPosition+2, parameter2mode)
            if(param1 != 0):
                nextPosition = param2
            else:
                nextPosition += 3
            if( self.trace ):
                print(f"Jumping to {param2} if {param1} == 1.")
        elif(instruction == 6): # JUMP-IF-NOT-TRUE
            param1 = self.getParameterValue(startPosition+1, parameter1mode)
            param2 = self.getParameterValue(startPosition+2, parameter2mode)
            if(param1 == 0):
                nextPosition = param2
            else:
                nextPosition += 3
            if( self.trace ):
                print(f"Jumping to {param2} if {param1} == 0.")
        elif(instruction == 7): # LESS THAN
            param1 = self.getParameterValue(startPosition+1, parameter1mode)
            param2 = self.getParameterValue(startPosition+2, parameter2mode)
            writeDestination = self.program[startPosition+3]
            if(param1 < param2):
                self.setParameterValue(writeDestination, 1)
            else:
                self.setParameterValue(writeDestination, 0)
            nextPosition += 4
            if( self.trace ):
                print(f"Checked less than of {param1} and {param2}. Result {param1 < param2}")
        elif(instruction == 8): # EQUALS
            param1 = self.getParameterValue(startPosition+1, parameter1mode)
            param2 = self.getParameterValue(startPosition+2, parameter2mode)
            writeDestination = self.program[startPosition+3]
            if(param1 == param2):
                self.setParameterValue(writeDestination, 1)
            else:
                self.setParameterValue(writeDestination, 0)
            nextPosition += 4
            if( self.trace ):
                print(f"Checked equality of {param1} and {param2}. Result {param1 == param2}")
        elif(instruction == 9): # ADJUST RELATIVE BASE
            param1 = self.getParameterValue(startPosition+1, parameter1mode)
            self.relativeBase += param1
            nextPosition += 2
            if( self.trace ):
                print(f"Adjusted relative base by {param1}. New value: {self.relativeBase}")
        elif(instruction == 99):
            if( self.trace ):
                print(f"Ending after {self.iterationCount} actions!")
            self.complete = True
        else:
            print('Unrecognised command!')
        return nextPosition
    
    def run(self, inputArray=[], runToCompletion=False):
        self.waiting = False
        self.inputs.extend(inputArray)
        while(self.complete != True and (self.waiting != True or runToCompletion)):
            self.position = self.step()
            if(self.position > len(self.program)):
                print('Error! Program out of bounds')
                self.complete = True
        return self.outputs