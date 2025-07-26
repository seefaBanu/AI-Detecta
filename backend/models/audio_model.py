import numpy as np
from tensorflow.keras.models import load_model
import joblib
import os
from pydub import AudioSegment
import librosa

# Constants
SAMPLE_RATE = 16000
DURATION = 5  # seconds
N_MFCC = 12
OUTPUT_DIR = "/tmp"  # temporary conversion

# Load once globally
MODEL_PATH = "/Users/seefabanu/Desktop/AI-Detecta/backend/models/artifacts/audio_cnn_model.h5"
SCALER_PATH = "/Users/seefabanu/Desktop/AI-Detecta/backend/models/artifacts/audio_scaler.pkl"
model = load_model(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

# Helper: Convert to wav
def convert_to_wav(uploaded_file, output_dir=OUTPUT_DIR):
    try:
        filename = "temp.wav"
        filepath = os.path.join(output_dir, filename)
        audio = AudioSegment.from_file(uploaded_file)
        audio = audio.set_channels(1).set_frame_rate(SAMPLE_RATE)
        audio.export(filepath, format="wav")
        return filepath
    except Exception as e:
        print(f"Error converting audio: {e}")
        return None

# Helper: Normalize audio
def normalize_audio(audio, sr=SAMPLE_RATE, duration=DURATION):
    try:
        audio = librosa.resample(audio, orig_sr=sr, target_sr=SAMPLE_RATE)
        target_length = SAMPLE_RATE * duration
        if len(audio) > target_length:
            audio = audio[:target_length]
        else:
            audio = np.pad(audio, (0, target_length - len(audio)), mode='constant')
        audio = audio / np.max(np.abs(audio)) if np.max(np.abs(audio)) != 0 else audio
        return audio
    except Exception as e:
        print(f"Error normalizing audio: {e}")
        return None

# Helper: Extract features
def extract_audio_features(file_path):
    try:
        audio, sr = librosa.load(file_path, sr=SAMPLE_RATE)
        audio = normalize_audio(audio, sr)
        if audio is None:
            return None
        mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=N_MFCC)
        mfccs_mean = np.mean(mfccs, axis=1)
        pitches, _ = librosa.piptrack(y=audio, sr=sr)
        pitch_values = pitches[pitches > 0]
        pitch_mean = np.mean(pitch_values) if pitch_values.size > 0 else 0
        zcr = np.mean(librosa.feature.zero_crossing_rate(y=audio))
        centroid = np.mean(librosa.feature.spectral_centroid(y=audio, sr=sr))
        bandwidth = np.mean(librosa.feature.spectral_bandwidth(y=audio, sr=sr))
        return np.concatenate([mfccs_mean, [pitch_mean, zcr, centroid, bandwidth]])
    except Exception as e:
        print(f"Feature extraction error: {e}")
        return None

# 🔍 Main detect function (like your detect_code)
def detect_audio(file):
    try:
        wav_path = convert_to_wav(file)
        if not wav_path:
            return {"message": "Audio conversion failed", "confidence": 0}

        features = extract_audio_features(wav_path)
        if features is None:
            return {"message": "Failed to extract features", "confidence": 0}

        features_scaled = scaler.transform([features])
        prediction = model.predict(features_scaled, verbose=0)
        label = int(np.argmax(prediction))
        prob = float(prediction[0][label])

        return {
            "message": "Likely AI-Generated Audio" if label == 1 else "Likely Human-Generated Audio",
            "confidence": round(prob * 100, 2)
        }
    except Exception as e:
        return {
            "message": f"Error: {str(e)}",
            "confidence": 0
        }
