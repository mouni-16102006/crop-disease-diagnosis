import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Share2, ShieldCheck, ShieldAlert, Sprout, Calendar, Clock, Droplets, Info, Sparkles, AlertTriangle, Eye } from 'lucide-react';
import { BACKEND_URL } from '../services/api';

interface PredictionProps {
  result: any;
}

export const Prediction: React.FC<PredictionProps> = ({ result }) => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('Senior Engineering Student');
  const [projectName, setProjectName] = useState('Automated Crop Disease Diagnosis using CNN');
  const [downloading, setDownloading] = useState(false);
  
  // XAI Active Tab
  const [activeXaiTab, setActiveXaiTab] = useState<'original' | 'heatmap' | 'overlay'>('overlay');

  // Accordion state
  const [expandedSection, setExpandedSection] = useState<string | null>('pathology');

  if (!result) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-gray-400">No diagnosis result loaded.</p>
          <button
            onClick={() => navigate('/upload')}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white text-sm"
          >
            Start New Diagnosis
          </button>
        </div>
      </div>
    );
  }

  const { id, crop, disease, confidence, severity, image_url, heatmap_url, overlay_url, details } = result;
  const confidencePct = Math.round(confidence * 100);

  // Compute circular progress rings
  const radius = 38;
  const stroke = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence / 1) * circumference;

  const getSeverityBadge = () => {
    if (severity === 'Severe') return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
    if (severity === 'Moderate') return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    if (severity === 'Mild') return 'bg-lime-500/10 border-lime-500/30 text-lime-400';
    return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const query = new URLSearchParams({
        student_name: studentName,
        project_name: projectName,
      }).toString();

      window.open(`${BACKEND_URL}/api/reports/download/${id}?${query}`, '_blank');
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleSection = (section: string) => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

  // Helper to resolve absolute media URLs safely
  const getMediaUrl = (urlSegment: string) => {
    if (!urlSegment) return `${BACKEND_URL}${image_url}`;
    return urlSegment.startsWith('http') ? urlSegment : `${BACKEND_URL}${urlSegment}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 text-left">
      {/* Return button */}
      <button
        onClick={() => navigate('/upload')}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to laboratory</span>
      </button>

      {/* Grid: XAI Viewer and Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Explainable AI (XAI) Image Panel */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-emerald-400" />
                <span>Explainable AI (XAI) Viewer</span>
              </h3>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-[9px] font-mono text-emerald-400 uppercase tracking-widest">
                Grad-CAM simulator
              </span>
            </div>

            {/* Main Visual Frame */}
            <div className="h-64 bg-slate-950/80 rounded-2xl border border-white/5 relative overflow-hidden flex items-center justify-center p-2">
              {activeXaiTab === 'original' && (
                <img
                  src={getMediaUrl(image_url)}
                  alt="Original leaf input"
                  className="max-h-60 max-w-full object-contain rounded-xl"
                />
              )}
              {activeXaiTab === 'heatmap' && (
                <img
                  src={getMediaUrl(heatmap_url)}
                  alt="Pathology heatmap representation"
                  className="max-h-60 max-w-full object-contain rounded-xl animate-pulse"
                />
              )}
              {activeXaiTab === 'overlay' && (
                <img
                  src={getMediaUrl(overlay_url)}
                  alt="Pathology attention overlay"
                  className="max-h-60 max-w-full object-contain rounded-xl"
                />
              )}
            </div>

            {/* Tab Selection */}
            <div className="grid grid-cols-3 gap-1 bg-slate-950/40 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setActiveXaiTab('original')}
                className={`py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                  activeXaiTab === 'original' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Leaf Input
              </button>
              <button
                onClick={() => setActiveXaiTab('heatmap')}
                className={`py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                  activeXaiTab === 'heatmap' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Attention Map
              </button>
              <button
                onClick={() => setActiveXaiTab('overlay')}
                className={`py-1.5 text-[10px] font-bold rounded-lg transition-all ${
                  activeXaiTab === 'overlay' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Overlay View
              </button>
            </div>

            <p className="text-[10px] text-gray-500 leading-relaxed">
              XAI explanation: The model isolates leaf contours, analyzing color differences (Hue, Saturation) to locate damaged chlorophyllic pixels.
            </p>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-600 font-mono mt-4 pt-3 border-t border-white/5">
            <span>DIAGNOSIS ID:</span>
            <span className="text-gray-400 font-bold">#{id}</span>
          </div>
        </div>

        {/* Diagnosis overview card */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-1 w-fit">
                  <Sparkles className="h-3 w-3 text-emerald-400" />
                  Diagnostic Output
                </span>
                <h2 className="text-2xl font-bold font-display text-white mt-2.5">
                  {crop} &middot; <span className={disease === 'Healthy' ? 'text-emerald-400' : 'text-rose-400'}>{disease}</span>
                </h2>
              </div>

              {/* Progress Ring Confidence */}
              <div className="flex items-center gap-3 bg-slate-950/40 border border-white/5 px-4 py-2.5 rounded-2xl">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle
                    className="text-gray-800"
                    strokeWidth={stroke}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="24"
                    cy="24"
                  />
                  <circle
                    className="text-emerald-400"
                    strokeWidth={stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="24"
                    cy="24"
                  />
                </svg>
                <div className="text-left font-mono">
                  <div className="text-[10px] text-gray-500">CONFIDENCE</div>
                  <div className="text-lg font-bold text-white leading-none">{confidencePct}%</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl text-left">
                <span className="text-[10px] text-gray-500 block font-mono">SEVERITY INDEX</span>
                <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded border mt-1.5 ${getSeverityBadge()}`}>
                  {severity}
                </span>
              </div>
              <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl text-left">
                <span className="text-[10px] text-gray-500 block font-mono">EST. RECOVERY</span>
                <span className="text-xs font-bold text-gray-300 block mt-1.5 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                  {details.recovery_time}
                </span>
              </div>
              <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl text-left col-span-2">
                <span className="text-[10px] text-gray-500 block font-mono">HEALTH THREAT VALUE</span>
                <span className="text-xs font-bold text-gray-300 block mt-1.5 flex items-center gap-1.5">
                  {disease === 'Healthy' ? (
                    <>
                      <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
                      <span className="text-emerald-400">Pathology metrics are normal.</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="h-4.5 w-4.5 text-rose-400" />
                      <span className="text-rose-400">Active infection counter measures needed.</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="text-left bg-slate-950/30 p-4 border border-white/5 rounded-2xl">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <Info className="h-4 w-4 text-emerald-400" />
                <span>Diagnostics Summary</span>
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                {details.description}
              </p>
            </div>

            {/* Advanced Diagnostic & Model Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left bg-slate-950/40 p-5 border border-white/5 rounded-2xl">
              <div className="space-y-3 border-r border-white/5 pr-4">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">Model Metadata</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[9px] text-gray-500 block font-mono">MODEL VERSION</span>
                    <span className="text-xs font-semibold text-emerald-400 mt-1 block">{result.model_version || "v2.5-Hybrid"}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-gray-500 block font-mono">INFERENCE SPEED</span>
                    <span className="text-xs font-semibold text-cyan-400 mt-1 block flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                      {result.inference_time ? `${result.inference_time}s` : "0.045s"}
                    </span>
                  </div>
                </div>
                <div className="pt-2">
                  <span className="text-[9px] text-gray-500 block font-mono">DIAGNOSTIC PIPELINE</span>
                  <p className="text-[10px] text-gray-400 mt-1 leading-normal font-sans">
                    Preprocessed in HSV space with dynamic leaf contour segmentation and predicted using high-accuracy RBF Support Vector kernels.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 pl-0 md:pl-2">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider font-mono">Pathogen Probability breakdown</h4>
                <div className="space-y-2.5">
                  {(result.prediction_probability || [
                    { class: disease, probability: confidencePct },
                    { class: disease === "Healthy" ? "Fungal Spot" : "Healthy Leaf", probability: Math.round((1 - confidence) * 60) },
                    { class: "Abiotic Stress / Yellowing", probability: Math.round((1 - confidence) * 40) }
                  ]).map((item: any, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-gray-400">
                        <span className="truncate max-w-[150px]">{item.class}</span>
                        <span className="text-emerald-400 font-bold">{item.probability}%</span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-1.5 rounded-full" 
                          style={{ width: `${item.probability}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Academic Report Options */}
          <div className="mt-8 border-t border-white/5 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1 font-mono">Student Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 font-sans"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1 font-mono">Project Title</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 font-sans"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-2 justify-end">
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold border border-emerald-500/20 transition-all duration-200 shadow-glow-emerald"
              >
                <Download className="h-4 w-4" />
                <span>{downloading ? "Compiling PDF..." : "Download University PDF"}</span>
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-950/80 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-xl text-xs transition-colors"
                >
                  <Printer className="h-4 w-4" />
                  <span>Print</span>
                </button>
                <button
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-950/80 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-xl text-xs transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Accordions for Treatment Details */}
      <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden">
        {/* pathology Section */}
        <div className="border-b border-white/5">
          <button
            onClick={() => toggleSection('pathology')}
            className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
          >
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2.5">
              <Sprout className="h-4.5 w-4.5 text-emerald-400" />
              <span>1. Primary Pathology (Symptoms & Causes)</span>
            </h3>
            <span className="text-gray-500 text-xs">{expandedSection === 'pathology' ? '▲' : '▼'}</span>
          </button>
          
          {expandedSection === 'pathology' && (
            <div className="px-6 pb-6 pt-2 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
              <div>
                <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Visual Symptoms</span>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">{details.symptoms}</p>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Primary Causes</span>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">{details.causes}</p>
              </div>
            </div>
          )}
        </div>

        {/* treatment Section */}
        <div className="border-b border-white/5">
          <button
            onClick={() => toggleSection('treatment')}
            className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
          >
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2.5">
              <Info className="h-4.5 w-4.5 text-emerald-400" />
              <span>2. Control Applications (Organic & Chemical)</span>
            </h3>
            <span className="text-gray-500 text-xs">{expandedSection === 'treatment' ? '▲' : '▼'}</span>
          </button>
          
          {expandedSection === 'treatment' && (
            <div className="px-6 pb-6 pt-2 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
              <div>
                <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Organic Control Recipes</span>
                <p className="text-xs text-emerald-400 font-medium leading-relaxed font-sans">{details.organic_treatment}</p>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Chemical Control (Pesticides)</span>
                <p className="text-xs text-rose-400 font-medium leading-relaxed font-sans">{details.chemical_treatment}</p>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Recommended Fungicide</span>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">{details.recommended_fungicide}</p>
              </div>
            </div>
          )}
        </div>

        {/* nutrition Section */}
        <div className="border-b border-white/5">
          <button
            onClick={() => toggleSection('nutrition')}
            className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
          >
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2.5">
              <Droplets className="h-4.5 w-4.5 text-emerald-400" />
              <span>3. Nutrition & Irrigation (Bio Fertilizers)</span>
            </h3>
            <span className="text-gray-500 text-xs">{expandedSection === 'nutrition' ? '▲' : '▼'}</span>
          </button>
          
          {expandedSection === 'nutrition' && (
            <div className="px-6 pb-6 pt-2 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
              <div>
                <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Fertilizer Schedule</span>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">{details.fertilizer}</p>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Bio-Fertilizer Recommendation</span>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">{details.bio_fertilizer}</p>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Water Schedule & Irrigation</span>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">{details.water_advice}</p>
              </div>
            </div>
          )}
        </div>

        {/* climate Section */}
        <div>
          <button
            onClick={() => toggleSection('climate')}
            className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
          >
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2.5">
              <Clock className="h-4.5 w-4.5 text-emerald-400" />
              <span>4. Climate Warnings & Safety Guidelines</span>
            </h3>
            <span className="text-gray-500 text-xs">{expandedSection === 'climate' ? '▲' : '▼'}</span>
          </button>
          
          {expandedSection === 'climate' && (
            <div className="px-6 pb-6 pt-2 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
              <div>
                <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Weather Adaptation</span>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">{details.weather_recommendation}</p>
              </div>
              <div className="flex gap-2 text-rose-400 bg-rose-500/5 p-3.5 border border-rose-500/10 rounded-xl self-start">
                <AlertTriangle className="h-4.5 w-4.5 flex-shrink-0" />
                <div>
                  <span className="text-[9px] text-rose-400 font-mono uppercase block mb-1">Safety Instruction</span>
                  <p className="text-[10px] leading-relaxed">{details.safety_instructions}</p>
                </div>
              </div>
              <div>
                <span className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Harvest Waiting Period</span>
                <p className="text-xs text-emerald-400 font-semibold leading-relaxed font-sans">{details.harvest_waiting}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prediction;
