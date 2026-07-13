import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const duration = 2000; // 2 seconds total load time
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(Math.floor((currentStep / steps) * 100), 100);
      setProgress(nextProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        // Start fade out animation
        setTimeout(() => {
          setFadeOut(true);
          // Trigger complete callback after transition
          setTimeout(onComplete, 600);
        }, 300);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-500 ease-out ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ backgroundColor: '#020617' }}
    >
      {/* Background glow orb */}
      <div className="absolute w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />

      <div className="z-10 flex flex-col items-center max-w-md w-full px-6">
        {/* Animated Sprout & Brain Network SVG Logo */}
        <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
          {/* Outer glowing pulsing circle */}
          <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping opacity-25" />
          <div className="absolute inset-2 rounded-full bg-emerald-950/40 border border-emerald-500/20 backdrop-blur-md shadow-glow-emerald" />

          {/* Sprouting Plant Path Animation */}
          <svg className="w-16 h-16 text-emerald-400 z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              className="path-draw"
              d="M12 22V10"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              className="path-draw"
              d="M12 14C12 14 15 11 19 12C19 12 18 16 15 16C12 16 12 14 12 14Z"
              fill="rgba(16, 185, 129, 0.4)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              className="path-draw"
              d="M12 12C12 12 9 9 5 10C5 10 6 14 9 14C12 14 12 12 12 12Z"
              fill="rgba(16, 185, 129, 0.4)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              className="path-draw"
              d="M12 10C12 10 16 5 20 6C20 6 18 10 14 9.5"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Brand Details */}
        <h1 className="text-2xl font-bold tracking-wider text-emerald-400 font-display mb-1">
          CROPDIAG AI
        </h1>
        <p className="text-gray-400 text-sm font-sans tracking-widest uppercase mb-10 text-center">
          Automated Leaf Diagnosis Pipeline
        </p>

        {/* Neural Network SVG animation (Brain effect) */}
        <div className="w-48 h-12 mb-8 flex justify-between items-center opacity-70">
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="h-[1px] flex-1 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-30 animate-pulse" />
          <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="h-[1px] flex-1 bg-gradient-to-r from-emerald-400 to-cyan-500 opacity-30 animate-pulse" />
          <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>

        {/* Progress details */}
        <div className="w-full">
          <div className="flex justify-between items-center text-xs text-gray-400 mb-2 font-mono">
            <span>INITIALIZING CNN CORE</span>
            <span>{progress}%</span>
          </div>
          
          {/* Progress outer track */}
          <div className="w-full h-1.5 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
            {/* Progress filling bar */}
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-cyan-400 rounded-full transition-all duration-75 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
