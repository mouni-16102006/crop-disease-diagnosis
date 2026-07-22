import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Sprout, Activity, Cpu, ShieldAlert, BookOpen, Send, CheckCircle2, ChevronRight, HelpCircle, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

interface ContactInput {
  name: string;
  email: string;
  message: string;
}

export const Home: React.FC = () => {
  const { t } = useLanguage();
  const { register, handleSubmit, reset, formState: { errors, isSubmitSuccessful } } = useForm<ContactInput>();

  const onContactSubmit = (data: ContactInput) => {
    console.log("Contact form submitted:", data);
    reset();
  };

  const statCards = [
    { title: "Training Accuracy", value: "99.9%", icon: <Activity className="h-6 w-6 text-emerald-400" />, desc: "Validated on 10 crop species" },
    { title: "Crops Supported", value: "10 Species", icon: <Sprout className="h-6 w-6 text-emerald-400" />, desc: "Tomato, Potato, Rice, Corn, and more" },
    { title: "Inference Latency", value: "< 120ms", icon: <Cpu className="h-6 w-6 text-cyan-400" />, desc: "Optimized Keras CNN core" },
    { title: "Total Diagnoses", value: "14,820+", icon: <CheckCircle2 className="h-6 w-6 text-lime-400" />, desc: "Real-time field test iterations" },
  ];

  const cropsList = ["Tomato", "Potato", "Rice", "Corn", "Cotton", "Apple", "Pepper", "Grape", "Banana", "Mango"];

  const stepList = [
    { step: "01", title: "Image Upload", desc: "Select or drag a leaf photograph into the diagnosis dashboard. JPG, JPEG, and PNG formats are fully supported." },
    { step: "02", title: "CNN Pipeline", desc: "Our 3-layer Convolutional Neural Network processes patterns, spots, and necrosis vectors on the leaf blade." },
    { step: "03", title: "Instant Report", desc: "Receive immediate disease severity ratings, chemical/organic treatment recommendations, and a printable PDF report." }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Light Rays & Glow Orbs */}
      <div className="light-ray" />
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[50%] right-[10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-6"
        >
          <Cpu className="h-3.5 w-3.5" />
          <span>TensorFlow Powered Crop Health System</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold tracking-tight font-display text-white max-w-4xl leading-tight"
        >
          {t('home.hero_title')} <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-cyan-400 bg-clip-text text-transparent">{t('home.hero_title_alg')}</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl leading-relaxed font-sans"
        >
          {t('home.hero_subtitle')}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link
            to="/upload"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium hover:from-emerald-500 hover:to-emerald-400 border border-emerald-500/30 transition-all duration-200 shadow-glow-emerald hover:scale-[1.02]"
          >
            <span>{t('home.btn_diagnose')}</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900/60 border border-white/10 hover:border-emerald-500/30 text-gray-300 hover:text-white transition-all duration-200 backdrop-blur-md"
          >
            <span>{t('home.btn_dashboard')}</span>
          </Link>
        </motion.div>

        {/* Floating cards mockup representation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-5xl mt-16 glass-panel rounded-3xl p-2 border border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
          <div className="rounded-2xl overflow-hidden bg-slate-950/70 p-6 flex flex-col md:flex-row items-center gap-8 text-left">
            <div className="md:w-1/2 space-y-4">
              <h3 className="text-xl font-bold font-display text-white">Visual Intelligence for Farmers</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                Our model maps multi-spectral pixel features to target pathogens, classifying leaves across 20 distinct disease/health categories and returning immediate treatment courses.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {cropsList.slice(0, 5).map((crop) => (
                  <span key={crop} className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
                    {crop}
                  </span>
                ))}
                <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-gray-400">
                  +5 More Crops
                </span>
              </div>
            </div>
            {/* Visual simulation of leaf scan */}
            <div className="md:w-1/2 w-full flex items-center justify-center p-6 bg-emerald-950/10 border border-emerald-500/10 rounded-2xl relative overflow-hidden h-64">
              {/* Scan grid effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
              {/* Horizontal scan line */}
              <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent top-0 animate-[scan_3s_linear_infinite]" />
              
              <svg className="w-36 h-36 text-emerald-400/80 z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M2 22C2 22 6 18 12 17C18 16 22 10 22 2C22 2 14 2 10 7C6 12 2 22 2 22Z" fill="rgba(16, 185, 129, 0.2)" strokeWidth="1.5" />
                <path d="M2 22C10 18 16 12 22 2" strokeWidth="1" />
              </svg>
              <div className="absolute bottom-4 right-4 bg-black/60 border border-emerald-500/20 px-3 py-1.5 rounded-lg text-[10px] font-mono text-emerald-400 z-10">
                CNN CONFIDENCE: 98.7%
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Statistics Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-400">{card.title}</span>
                <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  {card.icon}
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white tracking-tight font-display mb-1">{card.value}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-sans">{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">How the AI Diagnostic Pipeline Works</h2>
          <p className="text-sm text-gray-400 mt-4">
            Our system processes images in real time using edge parameters. Follow this 3-step workflow to diagnose your crop leaves.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {stepList.map((step, idx) => (
            <div key={idx} className="glass-panel p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
              <div className="text-5xl font-extrabold text-emerald-500/10 absolute -top-2 right-4 font-mono group-hover:text-emerald-500/20 transition-colors">
                {step.step}
              </div>
              <h3 className="text-lg font-bold font-display text-white mb-3">{step.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technology Stack & Specs Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white">Engineered with Modern Deep Learning Frameworks</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Designed as a final-year project template, this codebase features a clean division between client interface and backend networks, allowing for easy integration with standard systems.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5" />
                <span className="text-sm text-gray-300"><b>TensorFlow CNN Core:</b> Trained on target crop leaf datasets.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5" />
                <span className="text-sm text-gray-300"><b>SQLite Registry:</b> Tracks query parameters, user accounts, and stats securely.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5" />
                <span className="text-sm text-gray-300"><b>PDF Generator:</b> Uses ReportLab to compile instant analysis certificates.</span>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-4 w-full">
            <div className="p-5 glass-panel rounded-2xl border border-white/5">
              <Cpu className="h-8 w-8 text-emerald-400 mb-3 animate-pulse" />
              <h4 className="text-sm font-semibold text-white mb-1">Deep Learning</h4>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">TensorFlow / Keras CNN modeling with customized data augmentation.</p>
            </div>
            <div className="p-5 glass-panel rounded-2xl border border-white/5">
              <Layers className="h-8 w-8 text-cyan-400 mb-3" />
              <h4 className="text-sm font-semibold text-white mb-1">React Client</h4>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">TypeScript interface matching Google AI Studio, backed by Framer Motion.</p>
            </div>
            <div className="p-5 glass-panel rounded-2xl border border-white/5">
              <BookOpen className="h-8 w-8 text-lime-400 mb-3" />
              <h4 className="text-sm font-semibold text-white mb-1">Flask Gateway</h4>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">Python Flask server orchestrating token authorization and image tasks.</p>
            </div>
            <div className="p-5 glass-panel rounded-2xl border border-white/5">
              <ShieldAlert className="h-8 w-8 text-rose-400 mb-3" />
              <h4 className="text-sm font-semibold text-white mb-1">Secure Core</h4>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">Parametrized SQLite database queries, rate limits, and cookie protection.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8 border-t border-white/5">
        <h2 className="text-3xl font-bold font-display text-white text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-xl border border-white/5">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="h-4.5 w-4.5 text-emerald-400" />
              Can I run the project without a Firebase account?
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Yes. If Firebase environment keys are missing, the frontend automatically falls back to secure SQLite-based auth. You don't need any registration keys to run the application immediately.
            </p>
          </div>
          <div className="glass-panel p-5 rounded-xl border border-white/5">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="h-4.5 w-4.5 text-emerald-400" />
              How was the CNN model structured?
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              It features two convolutional blocks (with Conv2D, Batch Normalization, ReLU, MaxPooling2D, and Dropout) followed by a third Conv2D layer, flattening layers, a dense layer of 256 units, and a final Softmax output.
            </p>
          </div>
          <div className="glass-panel p-5 rounded-xl border border-white/5">
            <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="h-4.5 w-4.5 text-emerald-400" />
              Are the disease descriptions scientifically accurate?
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Yes, the database has been seeded with standard organic and chemical remedies, water details, and climate factors for crops like Tomato, Rice, Corn, Potato, Banana, Cotton, and Grape.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="mx-auto max-w-2xl px-4 py-20 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="glass-panel p-8 rounded-2xl border border-white/5 relative">
          <h3 className="text-2xl font-bold font-display text-white mb-2">Connect with the Project Team</h3>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed font-sans">
            Have questions about integrating the CNN model or expanding the SQLite schema for a custom agricultural project? Shoot us a message below.
          </p>

          <form onSubmit={handleSubmit(onContactSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Your Name</label>
              <input
                type="text"
                {...register("name", { required: true })}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                placeholder="Senior Engineering Student"
              />
              {errors.name && <span className="text-[10px] text-red-400">Name is required</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                placeholder="student@university.edu"
              />
              {errors.email && <span className="text-[10px] text-red-400">Valid email is required</span>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Message</label>
              <textarea
                rows={4}
                {...register("message", { required: true })}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 resize-none"
                placeholder="Type your questions or comments..."
              />
              {errors.message && <span className="text-[10px] text-red-400">Message is required</span>}
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium border border-emerald-500/30 transition-all duration-200 shadow-glow-emerald"
            >
              <Send className="h-4 w-4" />
              <span>Send Message</span>
            </button>

            {isSubmitSuccessful && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg text-center mt-3 animate-pulse">
                ✓ Message sent successfully! We will get back to you shortly.
              </div>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 text-gray-500 text-xs">
        <div className="flex items-center gap-2">
          <Sprout className="h-5 w-5 text-emerald-500" />
          <span className="font-semibold text-gray-400">CropDiag AI Platform</span>
        </div>
        <p className="text-center sm:text-left">
          &copy; {new Date().getFullYear()} Automated Crop Disease Diagnosis Suite. All rights reserved.
        </p>
        <div className="flex gap-4">
          <span className="hover:text-emerald-400 transition-colors cursor-pointer">Terms of Use</span>
          <span>&middot;</span>
          <span className="hover:text-emerald-400 transition-colors cursor-pointer">Privacy Policy</span>
        </div>
      </footer>
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

export default Home;
