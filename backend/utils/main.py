import sys
import json
import readibility as r
import image_extraction
import font_size as fs
import keywords as kw

readibility = r.main(sys.argv[1])
contrast_ratio = image_extraction.main(sys.argv[1])
font_size = fs.main(sys.argv[1])
keywords = kw.main(sys.argv[1])

print(json.dumps({"readibility": float(readibility), "contrast_ratio": float(contrast_ratio), "font_size": float(font_size), "keywords": keywords}))
sys.stdout.flush()