import React, { createContext, useState, useContext, useEffect } from 'react';

export type Language = 'en' | 'ta' | 'hi' | 'es';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.diagnose': 'Diagnose',
    'nav.risk': 'Risk Forecast',
    'nav.encyclopedia': 'Encyclopedia',
    'nav.about': 'About',
    'nav.dashboard': 'Dashboard',
    'nav.login': 'Login',
    'nav.register': 'Get Started',
    'nav.logout': 'Logout',
    
    // Home Page
    'home.hero_title': 'Automated Crop Disease Analysis',
    'home.hero_title_alg': 'Using CNN Algorithm',
    'home.hero_subtitle': 'A premium production-grade AI platform that detects leaf pathologies in real time, serving as an IEEE demonstration, portfolio artifact, and smart agriculture assistant.',
    'home.btn_diagnose': 'Analyze Leaf Now',
    'home.btn_dashboard': 'View Dashboard',
    'home.sec_title': 'Key Platform Modules',
    'home.sec_desc': 'Multi-layer Convolutional Neural Networks and SVM parameters for high-precision farming.',
    
    // Upload Page
    'upload.title': 'Automated Crop Leaf Diagnostics',
    'upload.subtitle': 'Select a target crop class and upload a leaf image to start the SVM & CNN classification pipeline.',
    'upload.crop_lock': 'Target Crop Category (Crop-Lock)',
    'upload.select_crop': 'Select a crop to lock classification path...',
    'upload.drop_title': 'Select Crop Leaf Image',
    'upload.drop_desc': 'Drag & drop image here, or click to choose from system files',
    'upload.btn_scan': 'Initialize Neural Scan',
    'upload.scanning': 'Processing OpenCV Mask & Run CNN Prediction...',
    
    // Risk Predictor Page
    'risk.title': 'Disease Outbreak Risk Predictor',
    'risk.subtitle': 'Estimate localized fungal/bacterial threat levels using ambient weather indexes.',
    'risk.temp': 'Local Temperature (°C)',
    'risk.humidity': 'Relative Humidity (%)',
    'risk.rainfall': 'Average Rainfall (mm)',
    'risk.btn': 'Forecast Disease Risk Profile',
  },
  ta: {
    // Navbar
    'nav.home': 'முகப்பு',
    'nav.diagnose': 'கண்டறிதல்',
    'nav.risk': 'இடர் கணிப்பு',
    'nav.encyclopedia': 'களஞ்சியம்',
    'nav.about': 'பற்றி',
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.login': 'உள்நுழை',
    'nav.register': 'தொடங்குங்கள்',
    'nav.logout': 'வெளியேறு',
    
    // Home Page
    'home.hero_title': 'தானியங்கி பயிர் நோய் பகுப்பாய்வு',
    'home.hero_title_alg': 'CNN அல்காரிதம் மூலம்',
    'home.hero_subtitle': 'பயிர் இலைகளில் உள்ள நோய்களை நிகழ்நேரத்தில் கண்டறியும் பிரீமியம் தரம் கொண்ட செயற்கை நுண்ணறிவு தளம், இது ஒரு ஸ்மார்ட் விவசாய உதவியாளராக செயல்படுகிறது.',
    'home.btn_diagnose': 'இலையை பகுப்பாய்வு செய்',
    'home.btn_dashboard': 'டாஷ்போர்டை காண்க',
    'home.sec_title': 'தளத்தின் முக்கிய பிரிவுகள்',
    'home.sec_desc': 'துல்லியமான விவசாயத்திற்காக பல அடுக்கு கன்வொலூஷனல் நியூரல் நெட்வொர்க் மற்றும் SVM அளவுருக்கள்.',
    
    // Upload Page
    'upload.title': 'தானியங்கி பயிர் இலை நோயறிதல்',
    'upload.subtitle': 'வகைப்பாட்டைத் தொடங்க ஒரு பயிரைத் தேர்ந்தெடுத்து இலை படத்தை பதிவேற்றவும்.',
    'upload.crop_lock': 'இலக்கு பயிர் வகை (பயிர்-பூட்டு)',
    'upload.select_crop': 'பயிரைத் தேர்ந்தெடுக்கவும்...',
    'upload.drop_title': 'பயிர் இலை படத்தை தேர்ந்தெடுக்கவும்',
    'upload.drop_desc': 'படத்தை இங்கே இழுத்து விடவும் அல்லது கோப்பைத் தேர்ந்தெடுக்கவும்',
    'upload.btn_scan': 'நோயறிதலைத் தொடங்கு',
    'upload.scanning': 'OpenCV மாஸ்க் & CNN கணிப்பைச் செயல்படுத்துகிறது...',
    
    // Risk Predictor Page
    'risk.title': 'பயிர் நோய் இடர் கணிப்பு',
    'risk.subtitle': 'காலநிலை குறிகாட்டிகளைப் பயன்படுத்தி பூஞ்சை/பாக்டீரியா அச்சுறுத்தல் அளவைக் கணக்கிடவும்.',
    'risk.temp': 'உள்ளூர் வெப்பநிலை (°C)',
    'risk.humidity': 'ஒப்பீட்டு ஈரப்பதம் (%)',
    'risk.rainfall': 'சராசரி மழைப்பொழிவு (mm)',
    'risk.btn': 'இடர் சுயவிவரத்தை கணி கணி',
  },
  hi: {
    // Navbar
    'nav.home': 'मुख्य पृष्ठ',
    'nav.diagnose': 'निदान',
    'nav.risk': 'जोखिम पूर्वानुमान',
    'nav.encyclopedia': 'विश्वकोश',
    'nav.about': 'हमारे बारे में',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.login': 'लॉगिन',
    'nav.register': 'शुरू करें',
    'nav.logout': 'लॉगआउट',
    
    // Home Page
    'home.hero_title': 'स्वचालित फसल रोग विश्लेषण',
    'home.hero_title_alg': 'CNN एल्गोरिथम द्वारा',
    'home.hero_subtitle': 'पत्तियों के रोगों का वास्तविक समय में पता लगाने वाला एक उन्नत एआई प्लेटफॉर्म, जो स्मार्ट कृषि सहायक के रूप में कार्य करता है।',
    'home.btn_diagnose': 'पत्ती का विश्लेषण करें',
    'home.btn_dashboard': 'डैशबोर्ड देखें',
    'home.sec_title': 'प्रमुख प्लेटफॉर्म मॉड्यूल',
    'home.sec_desc': 'उच्च-सटीक खेती के लिए मल्टी-लेयर कॉन्वोल्यूशनल न्यूरल नेटवर्क और एसवीएम पैरामीटर।',
    
    // Upload Page
    'upload.title': 'स्वचालित फसल पत्ती निदान',
    'upload.subtitle': 'वर्गीकरण शुरू करने के लिए एक फसल श्रेणी चुनें और पत्ती की छवि अपलोड करें।',
    'upload.crop_lock': 'लक्षित फसल श्रेणी (फसल-लॉक)',
    'upload.select_crop': 'वर्गीकरण पथ लॉक करने के लिए फसल चुनें...',
    'upload.drop_title': 'फसल पत्ती की छवि चुनें',
    'upload.drop_desc': 'छवि को यहाँ खींचें और छोड़ें, या फ़ाइल चुनने के लिए क्लिक करें',
    'upload.btn_scan': 'स्कैन प्रारंभ करें',
    'upload.scanning': 'OpenCV और CNN भविष्यवाणी चल रही है...',
    
    // Risk Predictor Page
    'risk.title': 'रोग प्रकोप जोखिम भविष्यवक्ता',
    'risk.subtitle': 'स्थानीय मौसम सूचकांकों का उपयोग करके कवक/जीवाणु खतरे के स्तर का अनुमान लगाएं।',
    'risk.temp': 'स्थानीय तापमान (°C)',
    'risk.humidity': 'सापेक्ष आर्द्रता (%)',
    'risk.rainfall': 'औसत वर्षा (mm)',
    'risk.btn': 'जोखिम प्रोफ़ाइल का पूर्वानुमान लगाएं',
  },
  es: {
    // Navbar
    'nav.home': 'Inicio',
    'nav.diagnose': 'Diagnosticar',
    'nav.risk': 'Pronóstico de Riesgo',
    'nav.encyclopedia': 'Enciclopedia',
    'nav.about': 'Acerca de',
    'nav.dashboard': 'Tablero',
    'nav.login': 'Iniciar Sesión',
    'nav.register': 'Empezar',
    'nav.logout': 'Cerrar Sesión',
    
    // Home Page
    'home.hero_title': 'Análisis Automatizado de Enfermedades',
    'home.hero_title_alg': 'Usando Algoritmo CNN',
    'home.hero_subtitle': 'Una plataforma de IA de grado de producción premium que detecta patologías de hojas en tiempo real, actuando como asistente agrícola inteligente.',
    'home.btn_diagnose': 'Analizar Hoja Ahora',
    'home.btn_dashboard': 'Ver Tablero',
    'home.sec_title': 'Módulos Clave de la Plataforma',
    'home.sec_desc': 'Redes Neuronales Convolucionales multicapa y parámetros SVM para agricultura de precisión.',
    
    // Upload Page
    'upload.title': 'Diagnóstico Automatizado de Hojas',
    'upload.subtitle': 'Seleccione una clase de cultivo y cargue una imagen para iniciar el diagnóstico.',
    'upload.crop_lock': 'Categoría de Cultivo (Bloqueo-Cultivo)',
    'upload.select_crop': 'Seleccione un cultivo para bloquear la clasificación...',
    'upload.drop_title': 'Seleccionar Imagen de Hoja',
    'upload.drop_desc': 'Arrastre y suelte la imagen aquí, o haga clic para elegir archivos',
    'upload.btn_scan': 'Iniciar Escaneo Neural',
    'upload.scanning': 'Procesando máscara OpenCV y predicción CNN...',
    
    // Risk Predictor Page
    'risk.title': 'Predictor de Riesgo de Brotes',
    'risk.subtitle': 'Estime los niveles de amenaza fúngica/bacteriana utilizando índices climáticos.',
    'risk.temp': 'Temperatura Local (°C)',
    'risk.humidity': 'Humedad Relativa (%)',
    'risk.rainfall': 'Precipitación Promedio (mm)',
    'risk.btn': 'Pronosticar Perfil de Riesgo',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('cropdiag_lang');
    return (saved as Language) || 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('cropdiag_lang', newLang);
    window.dispatchEvent(new CustomEvent('cropdiagLanguageChange', { detail: newLang }));
  };

  const t = (key: string): string => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
