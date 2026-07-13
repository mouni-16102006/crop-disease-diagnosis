import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Trash2, ZoomIn, Sprout, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import apiClient from '../services/api';

interface UploadProps {
  onPredictionResult: (result: any) => void;
}

export const Upload: React.FC<UploadProps> = ({ onPredictionResult }) => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setErrorMessage('');
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Unsupported file format. Please upload PNG, JPG, or JPEG.");
      return;
    }
    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("File exceeds 5MB size limit.");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setZoomLevel(1);
    setErrorMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerUpload = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setErrorMessage('');
    
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await apiClient.post('/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Store prediction results
      onPredictionResult(response.data);
      navigate('/prediction');
    } catch (error: any) {
      setErrorMessage(error.response?.data?.error || "Error compiling model classification sequence.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      {/* Aurora glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-2xl glass-panel p-8 rounded-3xl border border-white/10 shadow-glow-emerald z-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold font-display text-white mb-1.5 flex items-center justify-center gap-2">
            <Sprout className="h-6 w-6 text-emerald-400 animate-bounce" />
            <span>Pathology Diagnostic Lab</span>
          </h2>
          <p className="text-xs text-gray-400 font-sans tracking-wide">
            Upload leaf pictures for deep learning neural segmentation analysis
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Drag and Drop Zone */}
        {!previewUrl ? (
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`h-72 border-2 border-dashed rounded-2xl flex flex-col justify-center items-center p-6 text-center cursor-pointer transition-all duration-300 ${
              dragActive
                ? 'border-emerald-400 bg-emerald-500/5 shadow-glow-emerald scale-[0.99]'
                : 'border-white/10 hover:border-emerald-500/30 hover:bg-white/5'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".png,.jpg,.jpeg"
              className="hidden"
            />
            <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 mb-4">
              <UploadCloud className="h-10 w-10" />
            </div>
            <h4 className="font-semibold text-white mb-1">Drag leaf image here</h4>
            <p className="text-xs text-gray-500 max-w-sm mb-4 leading-relaxed font-sans">
              Supports PNG, JPG, or JPEG format. Max size 5MB. Make sure foliage details are clear.
            </p>
            <button
              type="button"
              className="px-4 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/20 transition-colors"
            >
              Select local file
            </button>
          </div>
        ) : (
          /* Preview & Zoom Box */
          <div className="space-y-6">
            <div className="h-72 bg-slate-950/80 rounded-2xl border border-white/10 relative overflow-hidden flex items-center justify-center p-4">
              <div 
                className="transition-transform duration-200 overflow-hidden rounded-xl border border-white/5 shadow-lg max-h-full"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <img
                  src={previewUrl}
                  alt="Crop preview"
                  className="max-h-60 max-w-full object-contain"
                />
              </div>
              
              {/* Scanline visualization */}
              {isProcessing && (
                <>
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:15px_15px] z-10" />
                  <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent top-0 animate-[scan_2s_linear_infinite] z-25" />
                </>
              )}
            </div>

            {/* Scale Adjustments */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/40 p-4 rounded-xl border border-white/5">
              <div className="flex-1 w-full flex items-center gap-3">
                <ZoomIn className="h-4 w-4 text-gray-500" />
                <span className="text-[10px] text-gray-500 font-mono">ZOOM LEVEL</span>
                <input
                  type="range"
                  min="1"
                  max="2.5"
                  step="0.1"
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                  className="flex-1 accent-emerald-500 h-1 bg-gray-800 rounded-full appearance-none outline-none"
                />
                <span className="text-[10px] text-emerald-400 font-mono font-bold w-8 text-right">
                  {zoomLevel.toFixed(1)}x
                </span>
              </div>
              
              <button
                type="button"
                onClick={removeFile}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-transparent rounded-lg transition-colors w-full sm:w-auto justify-center"
              >
                <Trash2 className="h-4 w-4" />
                <span>Remove image</span>
              </button>
            </div>

            {/* Execute Diagnostics */}
            <button
              onClick={triggerUpload}
              disabled={isProcessing}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium border border-emerald-500/30 transition-all duration-200 shadow-glow-emerald hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4.5 w-4.5 animate-spin text-emerald-300" />
                  <span>ANALYZING IMAGE FEATURES (CNN)...</span>
                </>
              ) : (
                <>
                  <Layers className="h-4.5 w-4.5 text-emerald-300" />
                  <span>EXECUTE PATHOLOGY DIAGNOSTIC</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
      <style>{`
        @keyframes scan {
          0% { top: 0%; }
          50% { top: 98%; }
          100% { top: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Upload;
