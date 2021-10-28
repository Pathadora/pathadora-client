import sys
import os

try:
    import textract
except:
    os.system("pip install textract")
    import textract

try:
    import nltk
except:
    os.system("pip install nltk")
    import nltk
    nltk.download('punkt')

def inbetween(minv, val, maxv):
    return min(maxv, max(minv, val))

def syllable_count(word):
    word = word.lower()
    count = 0
    vowels = "aeiouy"
    if word[0] in vowels:
        count += 1
    for index in range(1, len(word)):
        if word[index] in vowels and word[index - 1] not in vowels:
            count += 1
    if word.endswith("e"):
        count -= 1
    if count == 0:
        count += 1
    return count

def average_syllabs_for_word(text):
    sum = 0
    count = 0
    words = text.split()

    for word in words:
        sum += syllable_count(word)
        count += 1    

    return sum / count

def word_count(str):
    count = 0
    words = str.split()

    for word in words:
        count += 1

    return count

def average_words_for_sentence(text):
    sentences = nltk.tokenize.sent_tokenize(text)
    sum = 0
    count = 0

    for sentence in sentences:
        sum += word_count(sentence)
        count += 1    

    return sum / count

text = str(textract.process(sys.argv[1])).encode('windows-1252').decode('utf-8')

s = average_syllabs_for_word(text)
p = average_words_for_sentence(text)

result = 206.835-(84.6*s)-(1.015*p)
score = inbetween(0, result, 100)

print(score)
sys.stdout.flush()

"""
with open(sys.argv[1], 'r') as f:
    data = f.read()

    s = average_syllabs_for_word(data)
    p = average_words_for_sentence(data)

    print(206.835-(84.6*s)-(1.015*p))
    sys.stdout.flush()
"""