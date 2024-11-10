from flask import Flask, request, jsonify, send_file
import os
import json
from g4f.client import Client
from g4f.Provider.GeminiPro import GeminiPro
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
# Constants
IMAGE_FOLDER = "uploaded_images"  # Folder to save uploaded images
JSON_FILE = "crop.json"
API_KEY = "AIzaSyDptjvhpE4lYnD0ln5NbpZ74L8DvT9Kfp8"

# Ensure the image folder exists
os.makedirs(IMAGE_FOLDER, exist_ok=True)


def get_crop_info(image_path):
    """Get crop information using the GeminiPro API."""
    client = Client(api_key=API_KEY, provider=GeminiPro)
    with open(image_path, "rb") as image_file:
        response = client.chat.completions.create(
            model="gemini-1.5-flash",
            messages=[
                {
                    "role": "user",
                    "content": (
                        "Give me info about the type of Corp there is in the image & the amount of moisture in the soil "
                        "if the according to corp there is enogh hydration and is the pestisite good enough according to "
                        "quality of corp. I WANT CORP TYPE, IS THERE ENOGH HYDRATION, AND IS THE PESTISIE GOOD ENOUGH, "
                        "IN JSON FORMAT ONLY JASON PART NO OTHER FORMATIONG LIKE CODE BLOCK AND ALL 4 FIELD DESCRIPTION "
                        "IN WHICH ALL THE THINGS AS IT IS AND CORPTYPE FIELD then HYDRATION FIELD NUMERIC DATA then I want two more field one that says Time: Time Left to harvest in DAYS  & Recomendation Field where room for improvement is there (in 2 points max 4 words max in a point)& is CROP CUT OR NOT True or false ACURATE ANSWERS ONLY"
                        "QUALITY FIELD WITH NUMERIC DATA NUMERIC DATA IN BETWEEN 0 to 100 NO 'CODE BLOCK THIS IS NOT AN WEB BROWSER,NO /n"
                    ),
                }
            ],
            image=image_file,
        )
    return response.choices[0].message.content


def save_to_json(data):
    """Save data to a JSON file."""
    with open(JSON_FILE, "w") as json_file:
        json.dump(data, json_file, indent=4)


@app.route("/upload-images", methods=["POST"])
def upload_images():
    """Handle image uploads from the frontend."""
    if "images" not in request.files:
        return jsonify({"error": "No images provided"}), 400

    crop_results = []

    # Process each uploaded image
    for file in request.files.getlist("images"):
        if file:
            image_path = os.path.join(IMAGE_FOLDER, file.filename)
            file.save(image_path)
            crop_info = get_crop_info(image_path)
            crop_results.append(crop_info)

    save_to_json(crop_results)  # Save all results to JSON
    return jsonify(crop_results), 200


@app.route("/crop")
def send_json():
    """Send the crop JSON file."""
    return send_file(JSON_FILE, download_name="crop.json")


if __name__ == "__main__":
    app.run(debug=True, port=5001)
