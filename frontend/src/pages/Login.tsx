import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, LogIn, Chrome, Github, Linkedin, Award, Cloud, Sun } from 'lucide-react';
import { authService } from '../services/firebase';

interface LoginInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>();

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const result = await authService.loginWithEmail(data.email, data.password);
      onLoginSuccess(result.user);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to authenticate credential.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github' | 'linkedin' | 'microsoft') => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const result = await authService.loginWithOAuth(provider);
      onLoginSuccess(result.user);
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMessage(err.message || `Could not sign in with ${provider}.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4 overflow-hidden">
      {/* Landscape Animation Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-black z-0 pointer-events-none" />
      
      {/* Moving clouds */}
      <div className="absolute w-[200%] h-32 top-10 opacity-15 pointer-events-none z-0 animate-cloud-move">
        <Cloud className="absolute text-white w-20 h-20 left-[10%]" />
        <Cloud className="absolute text-white w-28 h-28 left-[45%]" />
        <Cloud className="absolute text-white w-16 h-16 left-[80%]" />
      </div>

      {/* Sprouting Sun Glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none z-0 flex flex-col items-center opacity-40">
        <Sun className="w-16 h-16 text-amber-300 animate-spin" style={{ animationDuration: '40s' }} />
        {/* Morning sun rays */}
        <div className="w-[1px] h-[500px] bg-gradient-to-b from-amber-200 to-transparent rotate-12 origin-top opacity-50" />
        <div className="w-[1px] h-[500px] bg-gradient-to-b from-amber-200 to-transparent -rotate-12 origin-top opacity-50" />
      </div>

      {/* Floating Glass Login Card */}
      <div 
        className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 shadow-glow-emerald z-10 animate-float relative overflow-hidden"
        style={{ animationDuration: '8s' }}
      >
        {/* Mirror Reflection Overlay */}
        <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-white/5 to-transparent pointer-events-none transform -skew-y-12" />

        <div className="text-center mb-8 relative">
          <h2 className="text-2xl font-bold font-display text-white mb-1.5">Welcome Back</h2>
          <p className="text-xs text-gray-400 font-sans tracking-wide">
            Securely access your crop pathology workstation
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4.5 w-4.5 text-gray-500" />
              <input
                type="email"
                {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email syntax" } })}
                className="w-full bg-slate-950/80 border border-white/10 focus:border-emerald-500/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none transition-all duration-200"
                placeholder="student@university.edu"
              />
            </div>
            {errors.email && <span className="text-[10px] text-red-400 mt-1 block">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Secret Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4.5 w-4.5 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Must exceed 5 characters" } })}
                className="w-full bg-slate-950/80 border border-white/10 focus:border-emerald-500/50 rounded-xl pl-10 pr-10 py-3 text-sm text-white focus:outline-none transition-all duration-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
              </button>
            </div>
            {errors.password && <span className="text-[10px] text-red-400 mt-1 block">{errors.password.message}</span>}
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-1.5 text-gray-400 hover:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="rounded bg-slate-950 border-white/10 text-emerald-500 focus:ring-0 cursor-pointer"
              />
              <span>Remember me</span>
            </label>
            <span className="text-emerald-400 hover:text-emerald-300 cursor-pointer transition-colors">
              Forgot Password?
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium border border-emerald-500/30 transition-all duration-200 shadow-glow-emerald hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <LogIn className="h-4.5 w-4.5" />
            <span>{isLoading ? "Signing in..." : "Access Workstation"}</span>
          </button>
        </form>

        {/* Separator */}
        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-3 text-gray-500 text-[10px] font-bold tracking-widest uppercase">OR</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => handleOAuth('google')}
            className="flex justify-center items-center py-2.5 rounded-xl bg-slate-950/60 border border-white/5 hover:border-emerald-500/20 hover:bg-slate-900 transition-all text-gray-400 hover:text-white"
            title="Google ID"
          >
            <Chrome className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleOAuth('github')}
            className="flex justify-center items-center py-2.5 rounded-xl bg-slate-950/60 border border-white/5 hover:border-emerald-500/20 hover:bg-slate-900 transition-all text-gray-400 hover:text-white"
            title="GitHub Code"
          >
            <Github className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleOAuth('linkedin')}
            className="flex justify-center items-center py-2.5 rounded-xl bg-slate-950/60 border border-white/5 hover:border-emerald-500/20 hover:bg-slate-900 transition-all text-gray-400 hover:text-white"
            title="LinkedIn network"
          >
            <Linkedin className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleOAuth('microsoft')}
            className="flex justify-center items-center py-2.5 rounded-xl bg-slate-950/60 border border-white/5 hover:border-emerald-500/20 hover:bg-slate-900 transition-all text-gray-400 hover:text-white"
            title="Microsoft Passport"
          >
            <Award className="h-5 w-5" />
          </button>
        </div>

        {/* Register redirection */}
        <div className="mt-8 text-center text-xs text-gray-500 font-sans">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
            Register new profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
