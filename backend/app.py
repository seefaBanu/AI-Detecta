from flask import Flask, request, jsonify
from flask_cors import CORS
from models.audio_model import detect_audio
from models.video_model import detect_video
from models.image_model import detect_image
from models.code_model import detect_code
import os


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/detect/audio', methods=['POST'])
def detect_audio_api():
    if 'audio' not in request.files:
        return jsonify({"message": "No file uploaded", "confidence": 0}), 400
    file = request.files['audio']
    result = detect_audio(file)
    return jsonify(result)

@app.route('/api/detect/video', methods=['POST'])
def detect_video_api():
    file = request.files.get('video')
    if not file:
        return jsonify({"error": "No video uploaded"}), 400

    temp_path = os.path.join('/tmp', file.filename)
    file.save(temp_path)

    try:
        result = detect_video(temp_path)
        os.remove(temp_path)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/detect/image', methods=['POST'])
def image_endpoint():
    file = request.files.get('image')
    if file is None:
        return jsonify({"error": "No image file uploaded"}), 400

    result = detect_image(file)
    return jsonify(result)

@app.route('/api/detect/code', methods=['POST'])
def code():
    data = request.get_json()
    code_text = data.get("code", "")
    result = detect_code(code_text)
    return jsonify(result)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)