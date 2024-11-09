# -*- coding: utf-8 -*-
from flask import Flask, send_file, jsonify
import requests
import json
from g4f.client import Client
from g4f.Provider.GeminiPro import GeminiPro
from PIL import Image
from io import BytesIO

app = Flask(__name__)

# Constants
API_KEY = "AIzaSyDptjvhpE4lYnD0ln5NbpZ74L8DvT9Kfp8"
CROP_INFO_JSON_FILE = 'crop.json'

# Sample API endpoint to get image URLs (replace with your actual endpoint)
IMAGE_API_ENDPOINT = "http://your-api-endpoint.com/get-images"

def fetch_images():
    """Fetch images from the API endpoint."""
    response = requests.get(IMAGE_API_ENDPOINT)
    if response.status_code == 200:
        return response.json()  # Assuming the API returns a JSON array of image URLs
    else:
        print("Failed to fetch images. Status code:", response.status_code)
        return []

def merge_images(image_urls):
    """Merge multiple images into one."""
    images = []
    for url in image_urls:
        img_response = requests.get(url)
        if img_response.status_code == 200:
            img = Image.open(BytesIO(img_response.content))
            images.append(img)
        else:
            print(f"Failed to download image from {url}. Status code:", img_response.status_code)

    # Assuming all images are of the same size for simplicity
    total_width = sum(img.width for img in images)
    max_height = max(img.height for img in images)

    # Create a new blank image with the total width and maximum height
    merged_image = Image.new('RGB', (total_width, max_height))

    # Paste each image into the merged image
    x_offset = 0
    for img in images:
        merged_image.paste(img, (x_offset, 0))
        x_offset += img.width

    return merged_image

def get_crop_info(merged_image):
    """Get crop information using the GeminiPro API."""
    client = Client(api_key=API_KEY, provider=GeminiPro)
    
    with BytesIO() as image_file:
        merged_image.save(image_file, format='JPEG')
        image_file.seek(0)  # Move to the beginning of the BytesIO buffer
        
        response = client.chat.completions.create(
            model="gemini-1.5-flash",
            messages=[{
                "role": "user",
                "content": ("Give me info about the type of Crop there is in the image & the amount of moisture in "
                            "the soil if according to crop there is enough hydration and is the pesticide good enough according to "
                            "quality of crop. I WANT CROP TYPE, IS THERE ENOUGH HYDRATION, AND IS THE PESTICIDE GOOD ENOUGH, "
                            "IN JSON FORMAT ONLY JSON PART NO OTHER FORMATTING LIKE CODE BLOCK AND ALL 4 FIELD DESCRIPTION "
                            "IN WHICH ALL THE THINGS AS IT IS AND CROP TYPE FIELD then HYDRATION FIELD NUMERIC DATA then I want two more field one that says Time: Time Left to harvest in DAYS & is CROP CUT OR NOT True or false ACCURATE ANSWERS ONLY "
                            "QUALITY FIELD WITH NUMERIC DATA NUMERIC DATA IN BETWEEN 0 to 100 NO 'CODE BLOCK THIS IS NOT A WEB BROWSER, NO /n"
                            )
            }],
            image=image_file
        )
    
    return response.choices[0].message.content

def save_to_json(data):
    """Save data to a JSON file."""
    with open(CROP_INFO_JSON_FILE, 'w') as json_file:
        json.dump(data, json_file, indent=4)
    print(f"Data has been written to '{CROP_INFO_JSON_FILE}'")

@app.route('/crop')
def send_json():
    """Send the crop JSON file."""
    return send_file(CROP_INFO_JSON_FILE, download_name='crop.json')

@app.route('/merge-images')
def merge_and_get_crop_info():
    """Merge images from API and get crop information."""
    image_urls = fetch_images()
    
    if not image_urls:
        return jsonify({"error": "No images found."}), 404
    
    merged_image = merge_images(image_urls)
    
    crop_info = get_crop_info(merged_image)
    
    save_to_json(crop_info)
    
    return jsonify({"message": "Images merged and crop info retrieved successfully."})

if __name__ == "__main__":
    app.run(debug=True, port=5000)