import os
import numpy as np
from PIL import Image
from sklearn.ensemble import RandomForestClassifier
import joblib

IMAGE_SIZE = 64  # Using a compact size for smooth processing
X = []
y = []
class_names = ['Diseased', 'Healthy']

print("Looking for dataset images...")

# Load and process images safely
for label_idx, class_name in enumerate(class_names):
    folder_path = f"../dataset/{class_name}"
    if os.path.exists(folder_path):
        for img_name in os.listdir(folder_path):
            try:
                img_path = os.path.join(folder_path, img_name)
                # Open, resize, and flatten image into numbers
                img = Image.open(img_path).convert('RGB').resize((IMAGE_SIZE, IMAGE_SIZE))
                img_array = np.array(img).flatten() / 255.0
                X.append(img_array)
                y.append(label_idx)
            except Exception:
                continue

X = np.array(X)
y = np.array(y)

print(f"Successfully loaded {len(X)} images.")
print("Training lightweight AI Model... This should take under 5 seconds!")

# Build and train a lightweight Random Forest brain
model = RandomForestClassifier(n_estimators=100, random_state=123)
model.fit(X, y)

# Save the trained brain and labels
joblib.dump(model, "crop_disease_model.pkl")
print("Model saved successfully as crop_disease_model.pkl!")

with open("labels.txt", "w") as f:
    for name in class_names:
        f.write(f"{name}\n")
print("Labels saved to labels.txt!")