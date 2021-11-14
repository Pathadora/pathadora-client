import sys
import json
import readibility as r
import image_extraction
import font_size as fs

readibility = r.main(sys.argv[1])
check_ratio = image_extraction.main(sys.argv[1])
font_size = fs.main(sys.argv[1])

print(json.dumps({"readibility": float(readibility), "check_ratio": float(check_ratio), "font_size": float(font_size)}))
sys.stdout.flush()