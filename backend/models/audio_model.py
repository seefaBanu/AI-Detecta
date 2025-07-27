import os
import numpy as np
import joblib
import gdown
from tensorflow.keras.models import load_model
from pydub import AudioSegment
import librosa

# Constants
SAMPLE_RATE = 16000
DURATION = 5  # seconds
N_MFCC = 12
OUTPUT_DIR = "/tmp"  # temp storage

# Google Drive file IDs
SCALER_FILE_ID = "1FtS3_Hcko5J97UL_eMhv0Pasf_AiYsbk"
MODEL_FILE_ID = "1_WPnIe2QXVGELGeT4zsVtdZqAPEyL636"

# Local paths
MODEL_PATH = os.path.join("models", "artifacts", "audio_cnn_model.h5")
SCALER_PATH = os.path.join("models", "artifacts", "audio_scaler.pkl")

# Ensure artifacts directory exists
os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)

def download_from_gdrive(file_id, output_path):
    if not os.path.exists(output_path):
        url = f"https://drive.google.com/uc?id={file_id}"
        print(f"Downloading {output_path} from Google Drive...")
        gdown.download(url, output_path, quiet=False)
        print("Download complete.")

# Download model and scaler if missing
download_from_gdrive(SCALER_FILE_ID, SCALER_PATH)
download_from_gdrive(MODEL_FILE_ID, MODEL_PATH)

# Load model and scaler once
model = load_model(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

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

def normalize_audio(audio, sr=SAMPLE_RATE, duration=DURATION):
    try:
        audio = librosa.resample(audio, orig_sr=sr, target_sr=SAMPLE_RATE)
        target_length = SAMPLE_RATE * duration
        if len(audio) > target_length:
            audio = audio[:target_length]
        else:
            audio = np.pad(audio, (0, target_length - len(audio)), mode='constant')
        max_abs = np.max(np.abs(audio))
        if max_abs != 0:
            audio = audio / max_abs
        return audio
    except Exception as e:
        print(f"Error normalizing audio: {e}")
        return None

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
