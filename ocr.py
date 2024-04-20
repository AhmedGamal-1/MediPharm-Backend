import cv2
import easyocr
import sys


def ocr(image_path):
    reader = easyocr.Reader(['en'])

    # Load and preprocess the image
    query_image = cv2.imread(image_path)

    # Perform OCR to extract text from the query image
    results = reader.readtext(query_image)

    # Extract and lowercase the text
    extracted_text = [detection[1].lower() for detection in results]

    return extracted_text

if __name__ == "__main__":
    image_path = sys.argv[1]
    extracted_text = ocr(image_path)
    print("Extracted text:", extracted_text)
