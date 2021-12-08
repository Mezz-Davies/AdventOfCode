import intCode

# Standard File import method
inputfile = open('input.txt','r')
inputtext = inputfile.read()
inputfile.close()

example = '''109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99'''

# --- Solution code --- 
exampleCompute = intCode.IntCodeComputer(example, trace=True)
print(exampleCompute.run(runToCompletion=True))
exampleCompute.memory.print()