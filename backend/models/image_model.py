import os
import cv2
import numpy as np
from skimage.feature import local_binary_pattern, graycomatrix, graycoprops
from tensorflow.keras.applications import EfficientNetB0
from tensorflow.keras.applications.efficientnet import preprocess_input
from sklearn.preprocessing import StandardScaler
import joblib
import tensorflow as tf
from werkzeug.utils import secure_filename

# Paths to model files (adjust as needed)
MODEL_PATH = "models/artifacts/image_svm_model.pkl"
SCALER_PATH = "models/artifacts/image_scaler.pkl"
IMG_SIZE = (224, 224)

# Set seeds for reproducibility
SEED = 42
np.random.seed(SEED)
tf.random.set_seed(SEED)

# LBP parameters
LBP_RADIUS = 3
LBP_N_POINTS = 8 * LBP_RADIUS
LBP_METHOD = 'uniform'

# GLCM parameters
GLCM_DISTANCES = [1]
GLCM_ANGLES = [0, np.pi/4, np.pi/2, 3*np.pi/4]

# Load model and scaler once
base_model = EfficientNetB0(weights='imagenet', include_top=False, pooling='avg', input_shape=(IMG_SIZE[0], IMG_SIZE[1], 3))
model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

def extract_lbp_features(image):
    lbp = local_binary_pattern(image, LBP_N_POINTS, LBP_RADIUS, method=LBP_METHOD)
    hist, _ = np.histogram(lbp.ravel(), bins=np.arange(0, LBP_N_POINTS + 3), density=True)
    return hist

def extract_glcm_features(image):
    image_uint8 = (image * 255).astype(np.uint8)
    glcm = graycomatrix(image_uint8, distances=GLCM_DISTANCES, angles=GLCM_ANGLES, levels=256, symmetric=True, normed=True)
    features = []
    for prop in ['contrast', 'energy', 'homogeneity']:
        features.extend(graycoprops(glcm, prop).ravel())
    return np.array(features)

def extract_efficientnet_features(image):
    image_3ch = np.repeat(image[:, :, np.newaxis], 3, axis=-1)
    image_3ch = preprocess_input(image_3ch * 255.0)
    image_3ch = np.expand_dims(image_3ch, axis=0)
    features = base_model.predict(image_3ch, verbose=0)
    return features.flatten()

def preprocess_image_from_file(file):
    file_path = os.path.join("/tmp", secure_filename(file.filename))
    file.save(file_path)

    img = cv2.imread(file_path, cv2.IMREAD_GRAYSCALE)
    os.remove(file_path)  # Clean up

    if img is None:
        raise ValueError("Failed to load image")

    img = cv2.resize(img, IMG_SIZE)
    return img.astype(np.float32) / 255.0

def detect_image(file):
    try:
        img = preprocess_image_from_file(file)
        lbp = extract_lbp_features(img)
        glcm = extract_glcm_features(img)
        effnet = extract_efficientnet_features(img)
        features = np.concatenate([lbp, glcm, effnet])
        features_scaled = scaler.transform([features])
        prediction = model.predict(features_scaled)[0]
        proba = model.predict_proba(features_scaled)[0]

        return {
            "label": "REAL" if prediction == 0 else "FAKE",
            "prob_real": round(proba[0] * 100, 2),
            "prob_fake": round(proba[1] * 100, 2)
        }

    except Exception as e:
        return {"error": str(e)}
