import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Mic, MicOff, Volume2, VolumeX, Sparkles, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from '../services/api';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string; // ISO string
}

// Mouni Animated Leaf Avatar SVG Component
export const MouniAvatar: React.FC<{ size?: number; animated?: boolean }> = ({ size = 48, animated = true }) => {
  return (
    <div 
      className="relative flex items-center justify-center select-none" 
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full ${animated ? 'animate-[mouni-float_3s_ease-in-out_infinite]' : ''}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="leafGrad" x1="50" y1="15" x2="50" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#81C784" />
            <stop offset="100%" stopColor="#2E7D32" />
          </linearGradient>
        </defs>

        {/* Leaf Body */}
        <path
          d="M50 15 C80 15, 85 50, 75 75 C60 90, 40 90, 25 75 C15 50, 20 15, 50 15 Z"
          fill="url(#leafGrad)"
          stroke="#a7f3d0"
          strokeWidth="3.5"
        />
        {/* Leaf Stem */}
        <path
          d="M50 15 Q50 55 50 82"
          stroke="#a7f3d0"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.9"
        />
        {/* Leaf Side Veins */}
        <path d="M50 35 Q65 30 72 25" stroke="#a7f3d0" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <path d="M50 45 Q35 42 28 38" stroke="#a7f3d0" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <path d="M50 55 Q65 52 70 48" stroke="#a7f3d0" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        <path d="M50 65 Q35 62 30 58" stroke="#a7f3d0" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

        {/* Eyes */}
        <circle cx="38" cy="46" r="8" fill="white" />
        <ellipse cx="38" cy="46" rx="4" ry="4" fill="#1e293b" className="origin-[38px_46px] animate-[mouni-blink_4s_infinite]" />
        <circle cx="36" cy="44" r="1.5" fill="white" />

        <circle cx="62" cy="46" r="8" fill="white" />
        <ellipse cx="62" cy="46" rx="4" ry="4" fill="#1e293b" className="origin-[62px_46px] animate-[mouni-blink_4s_infinite]" />
        <circle cx="60" cy="44" r="1.5" fill="white" />

        {/* Mouth */}
        <path
          d="M44 58 Q50 64 56 58"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Cute Cheeks */}
        <circle cx="28" cy="52" r="4.5" fill="#f43f5e" opacity="0.75" />
        <circle cx="72" cy="52" r="4.5" fill="#f43f5e" opacity="0.75" />
      </svg>
    </div>
  );
};

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [lang, setLang] = useState<'en' | 'ta' | 'hi' | 'es'>('en');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const greetings = {
    en: '🌿 Hello! I am Mouni, your AI Crop Assistant.\nI can help you identify crop diseases, explain symptoms, provide prevention methods, recommend treatments, and answer agriculture-related questions.',
    ta: '🌿 வணக்கம்! நான் மௌனி, உங்கள் பயிர்நோய் AI விவசாய உதவியாளர்.\nபயிர் நோய்கள், பூச்சி கட்டுப்பாடு, உரங்கள், மண் வளம் அல்லது இயற்கை விவசாயம் பற்றி என்னிடம் கேளுங்கள்!',
    hi: '🌿 नमस्ते! मैं मौनी हूँ, आपकी फसल सहायक।\nमैं फसल के रोगों, कीट नियंत्रण, उर्वरकों, मिट्टी के स्वास्थ्य या जैविक खेती के बारे में जानकारी दे सकती हूँ!',
    es: '🌿 ¡Hola! Soy Mouni, tu asistente de cultivos AI.\n¡Pregúntame cualquier cosa sobre enfermedades de cultivos, control de plagas, fertilizantes o agricultura orgánica!'
  };

  // Load chat history from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem('mouni_chat_history');
    if (storedHistory) {
      try {
        setMessages(JSON.parse(storedHistory));
      } catch (e) {
        initializeGreeting();
      }
    } else {
      initializeGreeting();
    }
  }, [lang]);

  const initializeGreeting = () => {
    setMessages([
      {
        sender: 'bot',
        text: greetings[lang],
        timestamp: new Date().toISOString()
      }
    ]);
  };

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('mouni_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.lang = lang === 'en' ? 'en-US' : lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'es-ES';
      rec.interimResults = false;
      
      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
      };
      
      recognitionRef.current = rec;
    }
  }, [lang]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleToggleVoice = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome/Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const speakText = (text: string) => {
    if (!speechEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[🌿*#]/g, ''));
    utterance.lang = lang === 'en' ? 'en-US' : lang === 'ta' ? 'ta-IN' : lang === 'hi' ? 'hi-IN' : 'es-ES';
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;
    
    const userMsg: Message = { sender: 'user', text, timestamp: new Date().toISOString() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setLoading(true);

    try {
      // Send chat history and current query to API
      const response = await axios.post(`${BACKEND_URL}/api/chatbot`, {
        message: text,
        lang: lang,
        history: updatedMessages
      });
      const botAnswer = response.data.answer;
      
      const botMsg: Message = { sender: 'bot', text: botAnswer, timestamp: new Date().toISOString() };
      setMessages(prev => [...prev, botMsg]);
      speakText(botAnswer);
    } catch (e) {
      console.error(e);
      const errResponse = lang === 'ta' 
        ? "மன்னிக்கவும், என்னால் சேவையகத்தை இணைக்க முடியவில்லை. தயவுசெய்து உங்கள் இணைய இணைப்பைச் சரிபார்க்கவும்! 🌿"
        : "Sorry, I am facing connectivity issues. Please verify your internet connection! 🌿";
      
      setMessages(prev => [...prev, { sender: 'bot', text: errResponse, timestamp: new Date().toISOString() }]);
      speakText(errResponse);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm(lang === 'ta' ? "அரட்டையை அழிக்கவா?" : "Clear all chat history?")) {
      localStorage.removeItem('mouni_chat_history');
      initializeGreeting();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const suggestionChips = {
    en: ["Early Blight treatment?", "Tomato diseases?", "NPK ratio?", "Organic insect control?", "CNN Algorithm details?"],
    ta: ["ஆரம்பகால கருகல் சிகிச்சை?", "தக்காளி நோய்கள்?", "NPK விகிதம்?", "இயற்கை பூச்சி கட்டுப்பாடு?", "விளக்கக்காட்சி விவரங்கள்?"],
    hi: ["अगेती झुलसा उपचार?", "टमाटर के रोग?", "एनपीके अनुपात?", "जैविक कीट नियंत्रण?", "विस्तृत विवरण?"],
    es: ["¿Tratamiento de tizón?", "¿Enfermedades de tomate?", "¿Relación NPK?", "¿Control de plagas orgánico?", "¿Detalles del algoritmo?"]
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans text-slate-200">
      {/* CSS Keyframe style block for cute Mouni animations */}
      <style>{`
        @keyframes mouni-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(2.5deg); }
        }
        @keyframes mouni-blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }
      `}</style>

      {/* Floating Mouni Assistant Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-800 border-2 border-emerald-500/50 shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative group animate-[mouni-float_4s_ease-in-out_infinite]"
          title="Chat with Mouni"
        >
          <MouniAvatar size={56} animated={false} />
          <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border border-slate-900 animate-ping" />
          <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border border-slate-900" />
          
          {/* Hover popup tooltip */}
          <div className="absolute right-20 bg-slate-900 border border-emerald-500/30 text-emerald-300 text-xs px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl">
            Hi, I'm Mouni! 🌿
          </div>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div 
          className={`rounded-3xl border border-emerald-500/20 bg-slate-950/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 ${
            isMaximized 
              ? 'w-[90vw] max-w-[650px] h-[80vh] max-h-[750px]' 
              : 'w-[90vw] sm:w-[420px] h-[580px]'
          }`}
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-emerald-900/80 border-b border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center p-0.5">
                <MouniAvatar size={40} animated={true} />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-emerald-400 tracking-wide flex items-center gap-1.5">
                  Mouni AI Assistant
                  <Sparkles className="h-3 w-3 text-emerald-300 animate-pulse" />
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-300 font-mono tracking-wider">Online Helper</span>
                </div>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as any)}
                className="bg-emerald-900/50 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-500/30 rounded-lg px-1.5 py-0.5 text-[10px] focus:outline-none focus:border-emerald-400 cursor-pointer transition-colors"
              >
                <option value="en">EN 🇬🇧</option>
                <option value="ta">TA 🇮🇳</option>
                <option value="hi">HI 🇮🇳</option>
                <option value="es">ES 🇪🇸</option>
              </select>

              {/* Speech Speaker Toggle */}
              <button
                onClick={() => setSpeechEnabled(!speechEnabled)}
                className={`p-1.5 rounded-lg border transition-all ${
                  speechEnabled
                    ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30'
                    : 'text-slate-500 bg-slate-900/50 border-transparent hover:text-slate-300'
                }`}
                title={speechEnabled ? "Mute Mouni voice response" : "Unmute Mouni voice response"}
              >
                {speechEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              </button>

              {/* Clear Chat History */}
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-lg border border-transparent hover:border-slate-800 text-slate-400 hover:text-rose-400 transition-all bg-slate-900/30"
                title="Clear Chat History"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>

              {/* Maximize / Minimize Size Toggle */}
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-1.5 rounded-lg border border-transparent hover:border-slate-800 text-slate-400 hover:text-emerald-400 transition-all bg-slate-900/30"
                title={isMaximized ? "Minimize window" : "Maximize window"}
              >
                {isMaximized ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg border border-transparent hover:border-slate-800 text-slate-400 hover:text-white transition-all bg-slate-900/30"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-950/40 scrollbar-thin scrollbar-thumb-emerald-800/30 scrollbar-track-transparent">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {msg.sender === 'bot' && (
                    <div className="flex-shrink-0 mt-0.5">
                      <MouniAvatar size={28} animated={false} />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-xs text-left leading-relaxed whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-emerald-700 text-white font-medium rounded-tr-none shadow-md shadow-emerald-900/20'
                          : 'bg-slate-900/80 border border-emerald-500/10 text-slate-200 rounded-tl-none shadow-md'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className={`text-[9px] text-slate-500 mt-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="flex-shrink-0 mt-0.5">
                    <MouniAvatar size={28} animated={true} />
                  </div>
                  <div className="bg-slate-900/80 border border-emerald-500/10 text-slate-400 rounded-2xl rounded-tl-none px-4 py-3 text-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-5 py-2.5 overflow-x-auto flex gap-2 scrollbar-none border-t border-emerald-500/10 bg-slate-950/60 select-none">
            {suggestionChips[lang].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="flex-shrink-0 px-3 py-1 rounded-full border border-emerald-500/10 bg-emerald-950/20 hover:border-emerald-500/40 text-emerald-300 hover:text-emerald-200 text-[10px] font-medium transition-all"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Panel */}
          <div className="p-4 bg-slate-950 border-t border-emerald-500/10 flex items-center gap-2">
            <button
              onClick={handleToggleVoice}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-rose-600 border-rose-500/30 text-white animate-pulse'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-emerald-400'
              }`}
              title={isListening ? "Listening... Click to stop" : "Start speech dictation"}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening voice..." : lang === 'ta' ? "விவசாயக் கேள்வியைக் கேட்கவும்..." : "Type agricultural inquiry..."}
              disabled={isListening}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 placeholder-slate-600 disabled:opacity-50"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-900 text-white disabled:text-slate-600 border border-emerald-600/20 disabled:border-transparent rounded-xl transition-all shadow-glow-emerald cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
