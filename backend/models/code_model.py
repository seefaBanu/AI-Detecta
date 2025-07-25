import torch
from transformers import RobertaTokenizer, T5ForConditionalGeneration
from torch import nn

# Load model from W&B once
import wandb

# W&B init just to download artifacts
run = wandb.init(project="codet5p-classification", entity="seefabanugafoor-sb", reinit=True)

# Download model artifact
artifact = run.use_artifact('seefabanugafoor-sb/codet5p-classification/fine_tuned_codet5p:v2', type='model')
artifact_dir = artifact.download()
wandb.finish()

# Set device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load tokenizer and model
tokenizer = RobertaTokenizer.from_pretrained(artifact_dir)
model = T5ForConditionalGeneration.from_pretrained(artifact_dir).to(device)

# Add classification head
model.classifier = nn.Linear(model.config.d_model, 2).to(device)

# Prediction function
def detect_code(code_text):
    try:
        inputs = tokenizer(
            code_text,
            max_length=512,
            padding="max_length",
            truncation=True,
            return_tensors="pt"
        ).to(device)

        model.eval()
        with torch.no_grad():
            encoder_outputs = model.encoder(
                input_ids=inputs["input_ids"],
                attention_mask=inputs["attention_mask"]
            )
            last_hidden_state = encoder_outputs.last_hidden_state[:, 0, :]
            logits = model.classifier(last_hidden_state)
            pred = torch.argmax(logits, dim=1).item()
            prob = torch.softmax(logits, dim=1)[0][pred].item()

        result = {
            "message": "Likely AI-Generated Code" if pred == 1 else "Likely Human-Written Code",
            "confidence": round(prob * 100, 2)
        }
    except Exception as e:
        result = {
            "message": f"Error: {str(e)}",
            "confidence": 0
        }

    return result
