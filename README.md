<p align="center">
  <img src="./backend/static/logo.svg" alt="CropDiag AI Logo" width="150" height="150">
</p>

# 🌱 Automated Crop Disease Diagnosis using CNN

> ** Third Year B.Tech (Artificial Intelligence & Data Science) Project**
>
> A production-ready Full Stack AI web application that detects plant leaf diseases using Convolutional Neural Networks (CNN). The system supports multiple agricultural crops and provides instant disease prediction, confidence analysis, PDF report generation, and administrative analytics through an elegant modern web interface.

---

# 🌐 Live Demo

**🔗 Try it live:** [https://crop-disease-diagnosis-1-3amx.onrender.com/](https://crop-disease-diagnosis-1-3amx.onrender.com/)



---

# 👩‍🎓 Project Information

**Project Title:** Automated Crop Disease Diagnosis using CNN

**Student Name:** Mounisha P

**Register Number:** 922524243113

**Degree:** Bachelor of Technology (B.Tech)

**Department:** Artificial Intelligence and Data Science (AI & DS)

**College:** VSB Engineering College, Karur

---

# 🌐 Live Demo & Public Deployment

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Render-brightgreen?style=for-the-badge&logo=render)](https://crop-disease-diagnosis-1-3amx.onrender.com/)

- **Live Production URL:** **[https://crop-disease-diagnosis-1-3amx.onrender.com/](https://crop-disease-diagnosis-1-3amx.onrender.com/)**
- **Local Application URL:** `http://127.0.0.1:8080/`

---

# 📸 Application Interface & Demo

### 🏠 Website Homepage
<p align="center">
  <img src="./sc/website%20.jpeg" alt="Website Homepage" width="100%">
</p>

### 📥 Image Upload Input
<p align="center">
  <img src="./sc/input.jpeg" alt="Image Upload Input" width="100%">
</p>

### 🔬 AI Diagnosis Output
<p align="center">
  <img src="./sc/output1.jpeg" alt="AI Diagnosis Output" width="100%">
</p>

### 💊 Remedy Suggestions
<p align="center">
  <img src="./sc/reme.jpeg" alt="Remedy Suggestions" width="100%">
</p>

### 📖 Crop Encyclopedia
<p align="center">
  <img src="./sc/ency.jpeg" alt="Crop Encyclopedia" width="100%">
</p>

### ⚠️ Disease Risk Predictor
<p align="center">
  <img src="./sc/risk%20factor.jpeg" alt="Disease Risk Predictor" width="100%">
</p>

### 📊 Model Accuracy & Training Metrics
<p align="center">
  <img src="./sc/accuracy.jpeg" alt="Model Accuracy" width="100%">
</p>

---

---

# 📖 Project Overview

Agriculture is one of the most important sectors contributing to food production worldwide. Early identification of crop diseases helps farmers minimize crop losses and improve productivity.

This project uses **Deep Learning (CNN)** to automatically identify diseases from uploaded crop leaf images. The application provides a fast, user-friendly interface with real-time predictions and comprehensive disease reports.

The system has been designed for:

- Final Year Engineering Projects
- Academic Demonstrations
- IEEE Research Publications
- Hackathons
- Production Deployment

---

# ✨ Key Features

## 🌿 AI Disease Detection

- Upload crop leaf images
- Automatic disease prediction
- CNN-based image classification
- Prediction confidence score
- Healthy/Diseased classification

---

## 📊 Dashboard

- Total predictions
- Disease statistics
- Crop-wise analytics
- Interactive charts
- Prediction history

---

## 👤 User Management

- User Registration
- Secure Login
- User Profile
- Prediction History
- Authentication System

---

## 📄 Report Generation

- Automatic PDF Report
- QR Code Integration
- Disease Information
- Prediction Summary
- Downloadable Reports

---

## 🔐 Security Features

- SQL Injection Protection
- XSS Input Filtering
- Rate Limiting
- Secure Session Handling
- Parameterized SQL Queries

---

# 🛠 Technology Stack

## Frontend

- React.js
- TypeScript
- Tailwind CSS
- Framer Motion
- Recharts
- Axios
- Lucide React Icons

---

## Backend

- Python
- Flask
- Flask-CORS
- SQLite Database
- ReportLab
- Pandas
- OpenPyXL

---

## Artificial Intelligence

- TensorFlow
- Keras CNN
- Scikit-Learn
- Multi Layer Perceptron (Fallback Model)

---

# 🌾 Supported Crops

The application currently supports disease diagnosis for:

- Tomato
- Potato
- Rice
- Corn (Maize)
- Cotton
- Apple
- Pepper
- Grape
- Banana
- Mango

---
## Demo

### Website home
![Website](sc/website%20.jpeg)

### Image Upload Input
![Image Upload Input](sc/input.jpeg)

### AI Diagnosis Output
![AI Diagnosis Output](sc/output1.jpeg)

### Remedy Suggestions
![Remedy Suggestions](sc/reme.jpeg)

### Crop Encyclopedia
![Crop Encyclopedia](sc/ency.jpeg)

### Disease Risk Predictor
![Disease Risk Predictor](sc/risk%20factor.jpeg)

### Model Accuracy & Training Metrics
![Model Accuracy](sc/accuracy.jpeg)

# 📁 Project Structure

```
crop-disease-diagnosis/
│
├── backend/
│   ├── app.py
│   ├── database.db
│   ├── init_db.py
│   ├── train_model.py
│   ├── disease_model.h5
│   ├── requirements.txt
│   │
│   └── static/
│       ├── uploads/
│       └── metrics/
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    │
    └── src/
        ├── App.tsx
        ├── main.tsx
        ├── index.css
        ├── assets/
        ├── components/
        ├── services/
        └── pages/
```

---

# ⚙ Installation Guide

## Step 1

Clone the repository

```bash
git clone <repository-url>
```

---

## Step 2

Navigate to backend

```bash
cd backend
```

---

## Step 3

Install dependencies

```bash
pip install -r requirements.txt
```

---

## Step 4

Initialize database

```bash
python init_db.py
```

---

## Step 5

Train CNN Model

```bash
python train_model.py
```

---

## Step 6

Run Flask Server

```bash
python app.py
```

---

## Step 7

Open another terminal

```bash
cd frontend
```

---

## Step 8

Install frontend dependencies

```bash
npm install
```

---

## Step 9

Run React Application

```bash
npm run dev
```

---

## Step 10

Open your browser

```
http://127.0.0.1:8080/
```

---

# 🗄 Database

The project uses **SQLite** to store:

- User Accounts
- Prediction Results
- Crop Information
- Disease Details
- Login History
- Dashboard Statistics

---

# 📊 AI Model

Model Type:

- Convolutional Neural Network (CNN)

Framework:

- TensorFlow
- Keras

Fallback Model:

- Scikit-Learn MLP Classifier

The fallback model guarantees successful startup even on systems without AVX/AVX2 CPU instruction support.

---

# 🔒 Security

The application follows secure development practices including:

- SQL Injection Prevention using Parameterized Queries
- XSS Protection through Input Sanitization
- Rate Limiting (60 Requests/Minute)
- Secure Authentication
- Session Management
- Firebase Authentication Fallback

---

# 📈 Future Enhancements

- Mobile Application
- Live Camera Disease Detection
- Farmer Recommendation System
- Cloud Deployment
- Multi-language Support
- Disease Severity Estimation
- Weather-based Prediction
- Fertilizer Recommendation
- Voice Assistant Integration

---

# 🎯 Project Objectives

- Detect crop diseases automatically.
- Improve disease diagnosis accuracy using CNN.
- Reduce manual inspection time.
- Provide instant prediction reports.
- Assist farmers in early disease management.

---

# 📚 Academic Purpose

This project has been developed as a Final Year Engineering Project for the degree of

**Bachelor of Technology (B.Tech)**

**Department of Artificial Intelligence and Data Science**

**VSB Engineering College, Karur**

---

# 👩‍💻 Developed By

**Mounisha P**

**Register Number:** 922524243113

**B.Tech – Artificial Intelligence and Data Science**

**VSB Engineering College**

**Karur, Tamil Nadu**

---

# 📄 License

This project is developed for academic and educational purposes.

© 2026 Mounisha P. All Rights Reserved.
