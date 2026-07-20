import React from 'react';
import { Mail, Github, Linkedin, ShieldCheck, Sprout, Cpu, LineChart, Code2, Database } from 'lucide-react';

export const About: React.FC = () => {
  const author = {
    name: "Mounisha P",
    email: "mounishapalaniappan8@gmail.com",
    role: "AI & Data Science Student",
    title: "Developer & Machine Learning Enthusiast",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    portfolio: "https://portfolio.com",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  };

  const techStack = [
    { name: "Python / Flask", desc: "API services gateway hosting neural classification weights and OpenCV masks.", icon: <Code2 className="h-5 w-5 text-emerald-400" /> },
    { name: "scikit-learn SVM", desc: "Support Vector Machine classifier used as CPU-compatible fallback mode.", icon: <Cpu className="h-5 w-5 text-emerald-400" /> },
    { name: "SQLite DB", desc: "Local serverless database storing normalized session, prediction, and report logs.", icon: <Database className="h-5 w-5 text-emerald-400" /> },
    { name: "React & Tailwind", desc: "Responsive client framework styled with glowing bioluminescent emerald overlays.", icon: <LineChart className="h-5 w-5 text-emerald-400" /> }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10 text-left">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold font-display text-white">Project Information & Specifications</h2>
        <p className="text-xs text-gray-400 font-sans tracking-wide mt-1">
          Detailed documentation on crop pathology neural models, XAI contours, and development credits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Project details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Objective & Problem Statement */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <Sprout className="h-4.5 w-4.5" />
              <span>Project Abstract & Scope</span>
            </h3>
            
            <div>
              <h4 className="text-xs font-bold text-white font-display">Problem Statement</h4>
              <p className="text-xs text-gray-400 leading-relaxed mt-1 leading-relaxed">
                Plant diseases cause massive crop losses for small-scale farmers worldwide. Traditional identification depends on visual symptoms analyzed by sparse agricultural experts. This leads to high response delays, incorrect diagnoses, and crop failure.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white font-display">Deep Learning Solution</h4>
              <p className="text-xs text-gray-400 leading-relaxed mt-1 leading-relaxed">
                CropDiag AI couples computer vision (OpenCV color contours) with neural classifiers to provide instant, offline plant disease diagnostics. The system calculates leaf spot ratios and outputs treatment maps immediately, providing an affordable crop care assistant.
              </p>
            </div>
          </div>

          {/* CNN & Explainable AI Specifications */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <Cpu className="h-4.5 w-4.5" />
              <span>CNN & Explainable AI (XAI) Model Architecture</span>
            </h3>
            
            <p className="text-xs text-gray-400 leading-relaxed leading-relaxed">
              The neural network classifications are processed in two distinct stages:
            </p>

            <div className="space-y-3">
              <div className="bg-slate-950/40 p-4 border border-white/5 rounded-xl text-left">
                <span className="text-[10px] text-emerald-400 font-mono block">1. COMPUTER VISION PREPROCESSING (OPENCV HSV)</span>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                  Isolates true green leaves from soil backgrounds using HSV limits (Hue: 35-85). Non-green brown/yellow spot pixels are calculated. Leaf spot counts exceeding 1.2% bypass the healthy classification, preventing false positives.
                </p>
              </div>

              <div className="bg-slate-950/40 p-4 border border-white/5 rounded-xl text-left">
                <span className="text-[10px] text-emerald-400 font-mono block">2. MODEL INFERENCE & SALIENCY MAPS</span>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                  Calculates classes using the Scikit-Learn Support Vector Machine (SVM) fallback model. Generates Grad-CAM visual saliency heatmaps using OpenCV by highlighting yellow/brown spot coordinates, blending them onto the leaf to visualize exactly what regions the model focused on.
                </p>
              </div>
            </div>
          </div>

          {/* Technology block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {techStack.map((tech, idx) => (
              <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/5 flex gap-3 text-left">
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex-shrink-0 self-start">
                  {tech.icon}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white font-display">{tech.name}</h4>
                  <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Author Card */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 bg-[#0c0f1d]/50 relative overflow-hidden flex flex-col items-center text-center space-y-5 animate-in fade-in slide-in-from-right-6 duration-300">
            {/* Aurora blur */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Logo vector */}
            <img src="/static/logo.svg" alt="CropDiag Logo" className="h-16 w-16 animate-pulse" />

            {/* Avatar frame */}
            <div className="h-24 w-24 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold overflow-hidden shadow-lg shadow-emerald-500/10">
              <span className="text-3xl font-display font-bold">M</span>
            </div>

            {/* Author metadata */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-display">{author.name}</h3>
              <span className="text-xs text-emerald-400 font-mono font-medium block">{author.role}</span>
              <p className="text-[11px] text-gray-500 max-w-xs">{author.title}</p>
            </div>

            <div className="w-full border-t border-white/5 pt-4 space-y-3.5 text-xs text-left">
              <div className="flex items-center gap-2 text-gray-400 bg-slate-950/60 p-2.5 border border-white/5 rounded-xl">
                <Mail className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span className="truncate">{author.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 bg-slate-950/60 p-2.5 border border-white/5 rounded-xl">
                <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>Anna University Registry</span>
              </div>
            </div>

            {/* Social links */}
            <div className="w-full grid grid-cols-3 gap-2.5 pt-2">
              <a
                href={author.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center p-2.5 rounded-xl border border-white/5 bg-slate-900 hover:border-emerald-500/30 text-gray-400 hover:text-white transition-colors"
                title="GitHub Profile"
              >
                <Github className="h-4.5 w-4.5" />
              </a>
              <a
                href={author.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center p-2.5 rounded-xl border border-white/5 bg-slate-900 hover:border-emerald-500/30 text-gray-400 hover:text-white transition-colors"
                title="LinkedIn Profile"
              >
                <Linkedin className="h-4.5 w-4.5" />
              </a>
              <a
                href={author.portfolio}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center p-2.5 rounded-xl border border-white/5 bg-slate-900 hover:border-emerald-500/30 text-emerald-400 hover:text-emerald-300 transition-colors font-mono font-bold text-xs"
                title="Portfolio Website"
              >
                CV
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
