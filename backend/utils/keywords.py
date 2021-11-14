import sys
import os

try:
    import textract
except:
    os.system("pip install -U textract")
    import textract

try:
    import yake
except:
    os.system("pip install -U yake")
    import yake

kw_extractor = yake.KeywordExtractor()
text = str(textract.process(sys.argv[1])).encode('windows-1252').decode('utf-8')
language = "en"
max_ngram_size = 1
deduplication_threshold = 0.9
numOfKeywords = 20
custom_kw_extractor = yake.KeywordExtractor(lan=language, n=max_ngram_size, dedupLim=deduplication_threshold, top=numOfKeywords, features=None)
keywords = custom_kw_extractor.extract_keywords(text)
for kw in keywords:
    print(kw)
sys.stdout.flush()