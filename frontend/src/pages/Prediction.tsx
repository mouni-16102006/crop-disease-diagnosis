import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Share2, ShieldCheck, ShieldAlert, Sprout, Calendar, Clock, Droplets, Info } from 'lucide-react';
import { BACKEND_URL } from '../services/api';

interface PredictionProps {
  result: any;
}

export const Prediction: React.FC<PredictionProps> = ({ result }) => {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('Senior Engineering Student');
  const [projectName, setProjectName] = useState('Automated Crop Disease Diagnosis using CNN');
  const [downloading, setDownloading] = useState(false);

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

  const { id, crop, disease, confidence, severity, image_url, details } = result;
  const confidencePct = Math.round(confidence * 100);

  // Compute ring circumference
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
      // Direct call to reports download API with student credentials
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back trigger */}
      <button
        onClick={() => navigate('/upload')}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Return to laboratory</span>
      </button>

      {/* Grid: Image and quick overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Leaf image preview */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
          <img
            src={`${BACKEND_URL}${image_url}`}
            alt="Uploaded leaf"
            className="w-full max-h-80 object-cover rounded-2xl border border-white/5 shadow-md mb-4"
          />
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono">
            <span>DIAGNOSIS ID:</span>
            <span className="text-gray-300 font-bold">#{id}</span>
          </div>
        </div>

        {/* Diagnosis overview card */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none" />
          
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                  Diagnostic Result
                </span>
                <h2 className="text-3xl font-bold font-display text-white mt-2.5">
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
                  <div className="text-xs text-gray-500">CONFIDENCE</div>
                  <div className="text-lg font-bold text-white leading-none">{confidencePct}%</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl text-left">
                <span className="text-[10px] text-gray-500 block font-mono">DAMAGE SEVERITY</span>
                <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded border mt-1.5 ${getSeverityBadge()}`}>
                  {severity}
                </span>
              </div>
              <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl text-left">
                <span className="text-[10px] text-gray-500 block font-mono">RECOVERY WINDOW</span>
                <span className="text-xs font-bold text-gray-300 block mt-1.5 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                  {details.recovery_time}
                </span>
              </div>
              <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl text-left col-span-2">
                <span className="text-[10px] text-gray-500 block font-mono">STATUS ASSESSMENT</span>
                <span className="text-xs font-bold text-gray-300 block mt-1.5 flex items-center gap-1.5">
                  {disease === 'Healthy' ? (
                    <>
                      <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
                      <span className="text-emerald-400">Crop Health Standard Optimal</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="h-4.5 w-4.5 text-rose-400" />
                      <span className="text-rose-400">Pathology Treatment Required</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="text-left bg-slate-950/30 p-4 border border-white/5 rounded-2xl">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                <Info className="h-4 w-4 text-emerald-400" />
                <span>Diagnosis Summary</span>
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                {details.description}
              </p>
            </div>
          </div>

          {/* Academic Report Options */}
          <div className="mt-8 border-t border-white/5 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Student Name (for report)</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500/50 font-sans"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Project Title</label>
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

      {/* Disease pathology detailed advice grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
        
        {/* Symptoms & Causes */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest mb-1.5">Symptoms Indicators</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">{details.symptoms}</p>
          </div>
          <hr className="border-white/5" />
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest mb-1.5">Primary Causes</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">{details.causes}</p>
          </div>
        </div>

        {/* Treatment Actions */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest mb-1.5">Organic Treatment</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">{details.organic_treatment}</p>
          </div>
          <hr className="border-white/5" />
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest mb-1.5">Chemical Treatment</h3>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">{details.chemical_treatment}</p>
          </div>
        </div>

        {/* Farming Advice */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="flex gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20 flex-shrink-0 self-start">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white font-display mb-0.5">Fertilizer & Pesticide Advice</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                <b>Fertilizer:</b> {details.fertilizer}<br/>
                <b>Pesticide:</b> {details.pesticide}
              </p>
            </div>
          </div>
          <hr className="border-white/5" />
          <div className="flex gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20 flex-shrink-0 self-start">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white font-display mb-0.5">Irrigation & Climate Details</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                <b>Irrigation:</b> {details.water_advice}<br/>
                <b>Climate Ideal:</b> {details.climate_advice}
              </p>
            </div>
          </div>
          <hr className="border-white/5" />
          <div className="flex gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20 flex-shrink-0 self-start">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white font-display mb-0.5">Prevention & Control</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                {details.prevention}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Prediction;
