import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Phone, Lock, Eye, EyeOff, Clipboard, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { authService } from '../services/firebase';

interface RegisterInput {
  username: string;
  email: string;
  phone: string;
  password: string;
  terms: boolean;
}

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0); // 0 to 3 scale
  const [profilePicUrl, setProfilePicUrl] = useState('https://api.dicebear.com/7.x/adventurer/svg?seed=crop');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterInput>();

  const passwordVal = watch("password", "");

  // Update password strength indicator
  React.useEffect(() => {
    if (!passwordVal) {
      setPasswordStrength(0);
      return;
    }
    let strength = 0;
    if (passwordVal.length >= 6) strength += 1;
    if (/[0-9]/.test(passwordVal)) strength += 1;
    if (/[A-Z]/.test(passwordVal) || /[^A-Za-z0-9]/.test(passwordVal)) strength += 1;
    setPasswordStrength(strength);
  }, [passwordVal]);

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const payload = {
        username: data.username,
        email: data.email,
        phone: data.phone,
        password: data.password,
        profile_pic_url: profilePicUrl
      };
      await authService.registerWithEmail(payload);
      setIsSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to register profile");
    } finally {
      setIsLoading(false);
    }
  };

  const cycleAvatar = () => {
    const seeds = ['leaf', 'farm', 'sprout', 'tree', 'field', 'wheat', 'growth', 'pathogen'];
    const randomSeed = seeds[Math.floor(Math.random() * seeds.length)] + Math.floor(Math.random() * 100);
    setProfilePicUrl(`https://api.dicebear.com/7.x/adventurer/svg?seed=${randomSeed}`);
  };

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return { label: "Empty", color: "bg-gray-800" };
    if (passwordStrength === 1) return { label: "Weak", color: "bg-red-500" };
    if (passwordStrength === 2) return { label: "Medium", color: "bg-amber-500" };
    return { label: "Strong", color: "bg-emerald-500" };
  };

  if (isSuccess) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 text-center space-y-4 animate-[bounce_1s_infinite]">
          <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto" />
          <h2 className="text-2xl font-bold font-display text-white">Registration Complete!</h2>
          <p className="text-sm text-gray-400 font-sans leading-relaxed">
            Your profile has been created successfully. Redirecting you to the login screen...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      {/* Glow Orbs */}
      <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[30%] left-[10%] w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Register Glass Panel Card */}
      <div className="w-full max-w-lg glass-panel p-8 rounded-3xl border border-white/10 shadow-glow-emerald z-10 animate-float" style={{ animationDuration: '10s' }}>
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold font-display text-white mb-1">Create Account</h2>
          <p className="text-xs text-gray-400 font-sans">
            Join the automated leaf pathology diagnostic workspace
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Profile Picture Selector */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 overflow-hidden relative group">
              <img src={profilePicUrl} alt="avatar" className="h-full w-full object-cover" />
            </div>
            <button
              type="button"
              onClick={cycleAvatar}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] text-gray-400 hover:text-white hover:border-emerald-500/30 transition-colors"
            >
              <ImageIcon className="h-3 w-3" />
              <span>Generate Crop Avatar</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-4.5 w-4.5 text-gray-500" />
                <input
                  type="text"
                  {...register("username", { required: "Username is required", minLength: { value: 3, message: "Must exceed 2 characters" } })}
                  className="w-full bg-slate-950/80 border border-white/10 focus:border-emerald-500/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none transition-all duration-200"
                  placeholder="farmDoc99"
                />
              </div>
              {errors.username && <span className="text-[10px] text-red-400 mt-1 block">{errors.username.message}</span>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 h-4.5 w-4.5 text-gray-500" />
                <input
                  type="text"
                  {...register("phone", { required: "Phone number is required" })}
                  className="w-full bg-slate-950/80 border border-white/10 focus:border-emerald-500/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none transition-all duration-200"
                  placeholder="+15550199"
                />
              </div>
              {errors.phone && <span className="text-[10px] text-red-400 mt-1 block">{errors.phone.message}</span>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4.5 w-4.5 text-gray-500" />
              <input
                type="email"
                {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email structure" } })}
                className="w-full bg-slate-950/80 border border-white/10 focus:border-emerald-500/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none transition-all duration-200"
                placeholder="student@university.edu"
              />
            </div>
            {errors.email && <span className="text-[10px] text-red-400 mt-1 block">{errors.email.message}</span>}
          </div>

          {/* Password */}
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

            {/* Password Strength Meter bar */}
            <div className="mt-2.5 space-y-1">
              <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                <span>PASSWORD STRENGTH</span>
                <span className="font-bold text-emerald-400 uppercase">{getStrengthLabel().label}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 h-1.5 rounded-full overflow-hidden bg-gray-900 border border-white/5">
                <div className={`h-full rounded-l-full transition-all duration-300 ${passwordStrength >= 1 ? getStrengthLabel().color : ''}`} />
                <div className={`h-full transition-all duration-300 ${passwordStrength >= 2 ? getStrengthLabel().color : ''}`} />
                <div className={`h-full rounded-r-full transition-all duration-300 ${passwordStrength >= 3 ? getStrengthLabel().color : ''}`} />
              </div>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 text-xs text-gray-400 hover:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                {...register("terms", { required: "You must accept the terms" })}
                className="mt-0.5 rounded bg-slate-950 border-white/10 text-emerald-500 focus:ring-0 cursor-pointer"
              />
              <span className="leading-relaxed">
                I agree to the terms of service and certify that this diagnostic interface is used for educational analysis.
              </span>
            </label>
            {errors.terms && <span className="text-[10px] text-red-400 mt-1 block">{errors.terms.message}</span>}
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-medium border border-emerald-500/30 transition-all duration-200 shadow-glow-emerald hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            <Clipboard className="h-4.5 w-4.5" />
            <span>{isLoading ? "Provisioning Profile..." : "Register Profile"}</span>
          </button>
        </form>

        {/* Redirect */}
        <div className="mt-6 text-center text-xs text-gray-500 font-sans">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
