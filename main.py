import streamlit as st
import numpy as np
from PIL import Image
import joblib
import os

IMAGE_SIZE = 64

# Page configuration with a wide, modern layout
st.set_page_config(
    page_title="Automated Crop Disease Diagnosis", 
    page_icon="🌱",
    layout="centered"
)

# Realistic Leaf-Themed UI Styling injection via CSS
st.markdown("""
    <style>
        /* Overall Page Background & Typography */
        .stApp {
            background-color: #f4f7f5;
        }
        h1, h2, h3, h4, h5, p, span, li {
            color: #1e352a !important;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        /* Sidebar text visibility fixes */
        [data-testid="stSidebar"] h3 {
            color: #ffffff !important;
            font-weight: 600 !important;
        }
        [data-testid="stSidebar"] {
            color: #e2f0e7 !important;
        }
        [data-testid="stSidebar"] p, [data-testid="stSidebar"] div, [data-testid="stSidebar"] span {
            color: #d1e7dd !important;
        }
        [data-testid="stSidebar"] strong {
            color: #ffffff !important;
        }
        
        /* Main Banner Styling */
        .main-header {
            background: linear-gradient(135deg, #2e6f40 0%, #1e462b 100%);
            padding: 2.5rem;
            border-radius: 16px;
            color: white !important;
            text-align: center;
            box-shadow: 0 8px 24px rgba(46, 111, 64, 0.15);
            margin-bottom: 2rem;
        }
        .main-header h1 {
            color: #ffffff !important;
            margin: 0;
            font-weight: 700;
            font-size: 2.2rem;
        }
        .main-header p {
            color: #e2f0e7 !important;
            margin-top: 0.5rem;
            font-size: 1.1rem;
        }

        /* Card Container Styles */
        .dashboard-card {
            background-color: #ffffff;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.03);
            border-left: 5px solid #4caf50;
            margin-bottom: 1.5rem;
        }
        
        /* File Uploader styling custom overrides */
        .stFileUploader {
            background-color: #ffffff;
            border: 2px dashed #a3c4bc;
            border-radius: 12px;
            padding: 1rem;
        }

        /* Fix Streamlit Metrics standard text wash-out */
        [data-testid="stMetricValue"] div {
            color: #1e462b !important;
            font-weight: 700 !important;
        }
        [data-testid="stMetricLabel"] p {
            color: #4a6b5d !important;
            font-weight: 500 !important;
        }
    </style>
""", unsafe_allow_html=True)

# Custom Agriculture-Themed Banner with updated title
st.markdown("""
    <div class="main-header">
        <h1>🌱 Automated Crop Disease Diagnosis</h1>
        <p>Real-time Botanical Vision & Phytopathology Assessment Matrix</p>
    </div>
""", unsafe_allow_html=True)

# Load backend AI elements safely
@st.cache_resource
def load_model():
    if os.path.exists("crop_disease_model.pkl") and os.path.exists("labels.txt"):
        model = joblib.load("crop_disease_model.pkl")
        with open("labels.txt", "r") as f:
            classes = [line.strip() for line in f.readlines()]
        return model, classes
    return None, None

model, class_names = load_model()

if model is None:
    st.error("⚠️ AI Core Offline: Model background files missing.")
else:
    # Sidebar Metadata Dashboard
    with st.sidebar:
        st.markdown("### 📊 System Diagnostics")
        st.write("**Model Engine:** Random Forest Classifier")
        st.write("**Input Dimensions:** 64x64 Spatial Matrix")
        st.write("**Optimized For:** RGB Structural Patterns")
        st.markdown("---")
        st.caption("v2.1.0 • Built for Precision Agriculture")

    # Layout Container for Upload Action
    st.markdown("### 📸 Leaf Specimen Ingestion")
    uploaded_file = st.file_uploader("", type=["jpg", "jpeg", "png"])

    if uploaded_file is not None:
        # Create structural layout columns
        col1, col2 = st.columns([1, 1], gap="medium")
        
        with col1:
            image = Image.open(uploaded_file)
            st.image(image, caption="Uploaded Leaf Specimen", use_container_width=True)
            
        with col2:
            st.markdown("### ⚡ AI Pipeline Analysis")
            status_text = st.empty()
            
            # Mathematical transformation to match array specs
            img_resized = image.convert('RGB').resize((IMAGE_SIZE, IMAGE_SIZE))
            img_array = np.array(img_resized).flatten() / 255.0
            img_input = img_array.reshape(1, -1)
            
            # Predictive inference processing
            prediction_idx = model.predict(img_input)[0]
            probabilities = model.predict_proba(img_input)[0]
            confidence = probabilities[prediction_idx] * 100
            result_health = class_names[prediction_idx]
            
            # Display results in stylized dashboard cards
            st.markdown("#### Diagnostic Summary")
            
            if result_health == "Healthy":
                st.markdown(f"""
                    <div style="background-color: #d1e7dd; padding: 1.2rem; border-radius: 8px; border-left: 6px solid #0f5132; margin-bottom:16px;">
                        <h4 style="color: #0f5132 !important; margin:0; font-weight:700;">🟢 HEALTH STATUS: OPTIMAL</h4>
                        <p style="color: #0f5132 !important; margin: 6px 0 0 0; font-size: 0.95rem; font-weight:500;">
                            Specimen exhibits uniform chlorophyll density patterns.
                        </p>
                    </div>
                """, unsafe_allow_html=True)
                
                # Metric display card
                st.metric(label="Model Identification Confidence", value=f"{confidence:.1f}%")
                
                st.markdown("##### 📝 Cultivation Recommendations")
                st.write("• Maintain standardized irrigation loops.")
                st.write("• Continue routine soil nitrogen monitoring matrix checks.")
            
            else:
                st.markdown(f"""
                    <div style="background-color: #f8d7da; padding: 1.2rem; border-radius: 8px; border-left: 6px solid #842029; margin-bottom:16px;">
                        <h4 style="color: #842029 !important; margin:0; font-weight:700;">🔴 HEALTH STATUS: ANOMALY DETECTED</h4>
                        <p style="color: #842029 !important; margin: 6px 0 0 0; font-size: 0.95rem; font-weight:500;">
                            Structural chlorosis or necrotic tissue signature tracked.
                        </p>
                    </div>
                """, unsafe_allow_html=True)
                
                # Metric display card
                st.metric(label="Model Identification Confidence", value=f"{confidence:.1f}%")
                
                st.markdown("##### ⚠️ Immediate Countermeasures")
                st.write("• **Isolate:** Quarantine sample plant to block fungal spore flight paths.")
                st.write("• **Treatment:** Apply standard organic copper-based fungicide treatments.")
                st.write("• **Pruning:** Immediately clip leaves showing advanced degradation.")