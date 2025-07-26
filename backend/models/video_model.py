import torch
import torchvision
from torchvision import transforms
from torch.utils.data import Dataset
import numpy as np
import cv2
import face_recognition
import os
from torch import nn
from torchvision import models

# Model definition
class Model(nn.Module):
    def __init__(self, num_classes, latent_dim=2048, lstm_layers=1, hidden_dim=2048, bidirectional=False):
        super(Model, self).__init__()
        model = models.resnext50_32x4d(pretrained=True)
        self.model = nn.Sequential(*list(model.children())[:-2])
        self.lstm = nn.LSTM(latent_dim, hidden_dim, lstm_layers, bidirectional)
        self.relu = nn.LeakyReLU()
        self.dp = nn.Dropout(0.4)
        self.linear1 = nn.Linear(2048, num_classes)
        self.avgpool = nn.AdaptiveAvgPool2d(1)

    def forward(self, x):
        batch_size, seq_length, c, h, w = x.shape
        x = x.view(batch_size * seq_length, c, h, w)
        fmap = self.model(x)
        x = self.avgpool(fmap)
        x = x.view(batch_size, seq_length, 2048)
        x_lstm, _ = self.lstm(x, None)
        return fmap, self.dp(self.linear1(x_lstm[:, -1, :]))

# Dataset for video processing
class validation_dataset(Dataset):
    def __init__(self, video_names, sequence_length=20, transform=None):
        self.video_names = video_names
        self.transform = transform
        self.count = sequence_length

    def __len__(self):
        return len(self.video_names)

    def __getitem__(self, idx):
        video_path = self.video_names[idx]
        frames = []
        a = int(100 / self.count)
        first_frame = np.random.randint(0, a)
        for i, frame in enumerate(self.frame_extract(video_path)):
            faces = face_recognition.face_locations(frame)
            try:
                top, right, bottom, left = faces[0]
                frame = frame[top:bottom, left:right, :]
            except:
                pass
            frames.append(self.transform(frame))
            if len(frames) == self.count:
                break
        frames = torch.stack(frames)
        frames = frames[:self.count]
        return frames.unsqueeze(0)

    def frame_extract(self, path):
        vidObj = cv2.VideoCapture(path)
        success = 1
        while success:
            success, image = vidObj.read()
            if success:
                yield image

# Prediction function
im_size = 112
mean = [0.485, 0.456, 0.406]
std = [0.229, 0.224, 0.225]
sm = nn.Softmax(dim=1)

def predict(model, img):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    fmap, logits = model(img.to(device))
    logits = sm(logits)
    _, prediction = torch.max(logits, 1)
    confidence = logits[:, int(prediction.item())].item() * 100
    return [int(prediction.item()), confidence]

# Initialize model and transforms
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model = Model(2).to(device)
# Update this path to where your model file is stored
model_path = '/Users/seefabanu/Desktop/AI-Detecta/backend/models/artifacts/video_model.pt'
model.load_state_dict(torch.load(model_path, map_location=device))
model.eval()

train_transforms = transforms.Compose([
    transforms.ToPILImage(),
    transforms.Resize((im_size, im_size)),
    transforms.ToTensor(),
    transforms.Normalize(mean, std)
])

def detect_video(video_path):
    """
    Process a video file and return prediction result.
    Args:
        video_path (str): Path to the video file.
    Returns:
        dict: Dictionary containing prediction ('REAL' or 'FAKE') and confidence.
    """
    if not os.path.exists(video_path):
        raise FileNotFoundError("Video file not found")

    video_dataset = validation_dataset([video_path], sequence_length=20, transform=train_transforms)
    prediction = predict(model, video_dataset[0])
    
    result = 'REAL' if prediction[0] == 1 else 'FAKE'
    return {
        'prediction': result,
        'confidence': round(prediction[1], 2)
    }