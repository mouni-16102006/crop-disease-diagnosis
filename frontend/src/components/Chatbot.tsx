import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Mic, MicOff, Volume2, VolumeX, Sparkles, Sprout } from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from '../services/api';

interface Message {
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Hello! I am your CropDiag AI Agriculture Assistant. Ask me anything about crop diseases, pest controls, fertilizers, soil health, or organic farming methods!',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.lang = 'en-US';
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
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

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
    window.speechSynthesis.cancel(); // stop previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;
    
    setMessages(prev => [...prev, { sender: 'user', text, timestamp: new Date() }]);
    setInputText('');
    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/chatbot`, { message: text });
      const botAnswer = response.data.answer;
      
      setMessages(prev => [...prev, { sender: 'bot', text: botAnswer, timestamp: new Date() }]);
      speakText(botAnswer);
    } catch (e) {
      console.error(e);
      const errResponse = "Sorry, I am facing connectivity issues, but remember that clean crop rotation and NPK balancing are key parameters for plant health!";
      setMessages(prev => [...prev, { sender: 'bot', text: errResponse, timestamp: new Date() }]);
      speakText(errResponse);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const suggestionChips = [
    "Early Blight treatment?",
    "Organic insect control?",
    "What is NPK ratio?",
    "Drip irrigation guide",
    "Farming tips for July"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 border border-emerald-500/30 text-white shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all duration-300 relative group animate-pulse"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-rose-500 border border-slate-900" />
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] rounded-3xl border border-white/10 bg-[#0c0f1d]/90 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Sprout className="h-4.5 w-4.5" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-white tracking-wide flex items-center gap-1.5">
                  CropDiag Assistant
                  <Sparkles className="h-3 w-3 text-emerald-400" />
                </h4>
                <span className="text-[10px] text-emerald-400 font-mono">Expert Offline Guide</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSpeechEnabled(!speechEnabled)}
                className={`p-1.5 rounded-lg border transition-all ${
                  speechEnabled
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-gray-500 bg-white/5 border-transparent'
                }`}
                title={speechEnabled ? "Mute voice assistant" : "Enable voice assistant"}
              >
                {speechEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg border border-transparent hover:border-white/10 text-gray-400 hover:text-white transition-all"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs text-left leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                      : 'bg-slate-900 border border-white/5 text-gray-300 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-900 border border-white/5 text-gray-400 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-5 py-2 overflow-x-auto flex gap-1.5 scrollbar-none border-t border-white/5 bg-slate-950/40">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                className="flex-shrink-0 px-3 py-1 rounded-full border border-white/5 bg-slate-900 hover:border-emerald-500/30 text-gray-400 hover:text-emerald-400 text-[10px] font-medium transition-all"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Panel */}
          <div className="p-4 bg-slate-950/80 border-t border-white/5 flex items-center gap-2">
            <button
              onClick={handleToggleVoice}
              className={`p-2.5 rounded-xl border transition-all ${
                isListening
                  ? 'bg-rose-600 border-rose-500/30 text-white animate-pulse'
                  : 'bg-slate-900 border-white/5 text-gray-400 hover:text-emerald-400'
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
              placeholder={isListening ? "Listening voice..." : "Type agricultural inquiry..."}
              disabled={isListening}
              className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 placeholder-gray-500 disabled:opacity-50"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-900 text-white disabled:text-gray-600 border border-emerald-500/20 disabled:border-transparent rounded-xl transition-all shadow-glow-emerald"
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
