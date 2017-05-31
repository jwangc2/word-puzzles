import requests
import pickle

def extractWords(jsonResult):
    key = "word"
    words = []
    for entry in jsonResult:
        if key in entry:
            words.append(entry[key])
    return words

def getWordsThatStartWith(letter, wordLength):
    queryStr = "https://api.datamuse.com/words?sp=%c"%letter;
    queryStr += "?" * max(wordLength - 1, 0)
    r = requests.get(queryStr)
    return extractWords(r.json())
    
def getWordsThatSplit(word, gapLength, abet):
    if len(word) % 2 != 0:
        return []
        
    for c in word:
        if c not in abet:
            return []
    
    half = int(len(word) / 2)
    gap = "?" * max(gapLength, 1)
    queryStr = "https://api.datamuse.com/words?sp=%s%s%s"%(word[:half], gap, word[half:])
    #print(queryStr)
    r = requests.get(queryStr)
    return extractWords(r.json())
    
offset = ord('a')
abet = list(map(chr, range(offset, offset + 26)))
abetSet = set(abet)
gapLength = 2
wordLengths = [4, 6]
splitWords = []

print("[")
for wordLength in wordLengths:
    for letter in abet:
        words = getWordsThatStartWith(letter, wordLength)
        for word in words:
            newWords = getWordsThatSplit(word, gapLength, abetSet)
            if len(newWords) > 0:
                try:
                    print({word : newWords})
                except UnicodeEncodeError as e:
                    pass
print("]")