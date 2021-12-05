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

def main(filePath):
    try:
        text = str(textract.process(filePath)).encode('windows-1252').decode('utf-8')
        language = "en"
        max_ngram_size = 1
        deduplication_threshold = 0.9
        numOfKeywords = 10
        custom_kw_extractor = yake.KeywordExtractor(lan=language, n=max_ngram_size, dedupLim=deduplication_threshold, top=numOfKeywords, features=None)
        keywords = list(map(lambda x: x[0], custom_kw_extractor.extract_keywords(text)))
        return keywords
    except:
        return ""