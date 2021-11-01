import sys
import subprocess
import json
import readibility as r
import image_extraction


#readibility = subprocess.check_output([sys.executable, "readibility.py", sys.argv[1]])
#check_ratio = subprocess.check_output([sys.executable, "image-extraction.py", sys.argv[1]])

readibility = r.main(sys.argv[1])
check_ratio = image_extraction.main(sys.argv[1])

print(json.dumps({"readibility": float(readibility), "check_ratio": float(check_ratio)}))
sys.stdout.flush()