from flask import Flask, request, jsonify
from flask_cors import CORS
from models.audio_model import detect_audio
from models.video_model import detect_video
from models.image_model import detect_image
from models.code_model import detect_code

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/detect/audio', methods=['POST'])
def audio():
    file = request.files.get('audio')
    result = detect_audio(file)
    return jsonify(result)

@app.route('/api/detect/video', methods=['POST'])
def video():
    file = request.files.get('video')
    result = detect_video(file)
    return jsonify(result)

@app.route('/api/detect/image', methods=['POST'])
def image():
    file = request.files.get('image')
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