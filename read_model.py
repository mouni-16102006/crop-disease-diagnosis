import pickle

# Open the binary file
with open('app/crop_disease_model.pkl', 'rb') as f:
    model_data = pickle.load(f)

# This prints the structure and internal parameters
print("--- Model Structure & Weights ---")
print(type(model_data))
print(model_data)

# If your model is a dictionary or a list, this will show you the exact values
if isinstance(model_data, dict):
    for key, value in model_data.items():
        print(f"\nKey: {key}")
        print(f"Content: {value}")