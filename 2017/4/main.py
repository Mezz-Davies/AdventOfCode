# Standard File import method
inputfile = open('input.txt','r')
inputtext = inputfile.read()
inputfile.close()

example = '''aa bb cc dd ee
aa bb cc dd aa
aa bb cc dd aaa'''
# --- Solution code --- 

# Part 1
def isValidPassphrase(passphrase : str) -> bool:
    lookup = {}
    words = passphrase.split(' ')
    for word in words:
        if word in lookup:
            return False
        else:
            lookup[word] = True
    
    return True

def sumValidPassphrases(input: str) -> int:
    passphrases = input.splitlines()
    #print(passphrases)
    return sum([ 1 for passphrase in passphrases if isValidPassphrase(passphrase) ])
results = [isValidPassphrase(passphrase) for passphrase in example.split('\n')]
print(sumValidPassphrases(example))
print(sumValidPassphrases(inputtext))

# Part 1
def isValidPassphraseWithAnagrams(passphrase : str) -> bool:
    lookup = {}
    words = passphrase.split(' ')
    for word in words:
        sortedCharacters = sorted(word)
        sortedWord = "".join(sortedCharacters)
        if sortedWord in lookup:
            return False
        else:
            lookup[sortedWord] = True
    
    return True

def sumValidPassphrasesWithAnagrams(input: str) -> int:
    passphrases = input.splitlines()
    #print(passphrases)
    return sum([ 1 for passphrase in passphrases if isValidPassphraseWithAnagrams(passphrase) ])

print(sumValidPassphrasesWithAnagrams(example))
print(sumValidPassphrasesWithAnagrams(inputtext))