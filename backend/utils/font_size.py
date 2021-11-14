import os

try:
    from pdfminer.high_level import extract_pages
    from pdfminer.layout import LTTextContainer, LTChar
except:
    os.system("pip install -U pdfminer.six")
    from pdfminer.high_level import extract_pages
    from pdfminer.layout import LTTextContainer, LTChar

def main(filePath):
    try:
        return str(min([
                char.size
                for page in extract_pages(os.path.expanduser(filePath))
                for paragraph in page
                if isinstance(paragraph, LTTextContainer)
                for line in paragraph
                for char in line
                if isinstance(char, LTChar)
            ]))
    except:
        return str(-1)