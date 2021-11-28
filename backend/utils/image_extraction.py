import os
import io

try:
    from PIL import Image
except:
    os.system("pip install -U Pillow")
    from PIL import Image

try:
    import pytesseract
    from pytesseract import Output
except:
    os.system("pip install -U pytesseract")
    import pytesseract
    from pytesseract import Output

try:
    import wcag_contrast_ratio as contrast
except:
    os.system("pip install -U wcag_contrast_ratio")
    import wcag_contrast_ratio as contrast

try:
    import fitz
except:
    os.system("pip install -U PyMuPDF")
    import fitz

def main(filePath):
    try:
        pytesseract.pytesseract.tesseract_cmd = "C:\\Program Files\\Tesseract-OCR\\tesseract.exe"

        # open the file
        pdf_file = fitz.open(filePath)
        contrasts = []
        # iterate over PDF pages
        for page_index in range(len(pdf_file)):
            # get the page itself
            page = pdf_file[page_index]
            image_list = page.get_images()
            # printing number of images found in this page
            """
            if image_list:
                print(f"[+] Found a total of {len(image_list)} images in page {page_index}")
            else:
                print("[!] No images found on page", page_index)
            """
            for image_index, img in enumerate(image_list, start=1):
                # get the XREF of the image
                xref = img[0]
                # extract the image bytes
                base_image = pdf_file.extract_image(xref)
                image_bytes = base_image["image"]
                # load it to PIL
                image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

                fullImageColors = image.getcolors(image.size[0]*image.size[1])
                #backgroundColor = fullImageColors[-1][1]
                backgroundColor = tuple(ti/255.0 for ti in fullImageColors[-1][1]) 

                d = pytesseract.image_to_data(image, output_type=Output.DICT)
                n_boxes = len(d['level'])
                for i in range(n_boxes):
                    (x, y, w, h) = (d['left'][i], d['top'][i], d['width'][i], d['height'][i])
                    im_crop = image.crop((x, y, x + w, y + h))
                    colors = sorted(im_crop.getcolors(im_crop.size[0]*im_crop.size[1]))
                    # textColor = colors[-1][1]
                    textColor = tuple(ti/255.0 for ti in colors[-1][1]) 
                    contrastValue = contrast.rgb(backgroundColor, textColor)
                    contrasts.append(contrastValue)
                    #print(textColor, contrastValue)

        # minimum contrast
        return str(min(contrasts))
    except:
        return str(-1)

