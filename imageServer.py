from flask import Flask, request, jsonify
import requests
from PIL import Image
from io import BytesIO
import os
import uuid

app = Flask(__name__)

# Ensure the images directory exists
images_dir = "./public/images"
if not os.path.exists(images_dir):
    os.makedirs(images_dir)

@app.route('/upload_image', methods=['POST'])
def upload_image():
    if 'image_url' not in request.json:
        return jsonify({'error': 'No image URL provided'}), 400
    
    image_url = request.json['image_url']
    prompt = request.json['prompt']
    prompt = prompt.replace(" ", "_")
    prompt = prompt + "_" + str(uuid.uuid4())
    
    try:
        response = requests.get(image_url)
        # Check if the request was successful
        if response.status_code == 200:
            # Get the image from the response and save it
            image = Image.open(BytesIO(response.content))
            image_path = os.path.join(images_dir, prompt+".png")
            image.save(image_path)
            return jsonify({'message': 'Image saved successfully', 'path': "http://localhost:3001/images/"+prompt+".png"}), 200
        else:
            return jsonify({'error': 'Failed to fetch image from URL'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
