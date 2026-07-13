import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Award, User, Mail, Phone, Bookmark, Calendar, CheckCircle2, ShieldCheck, Edit3 } from 'lucide-react';
import apiClient, { BACKEND_URL } from '../services/api';
import authService from '../services/firebase';

interface EditInput {
  username: string;
  phone: string;
}

interface ProfileProps {
  user: any;
  onProfileUpdate: (updatedUser: any) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onProfileUpdate }) => {
  const [profileData, setProfileData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditInput>();

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/auth/profile');
      setProfileData(response.data.user);
      reset({
        username: response.data.user.username,
        phone: response.data.user.phone || ''
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditSubmit = async (data: EditInput) => {
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const payload = {
        username: data.username,
        phone: data.phone,
        profile_pic_url: profileData.profile_pic
      };
      await authService.updateProfile(payload);
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      
      // Update global user state in parent component
      const updatedUser = { ...user, ...payload };
      onProfileUpdate(updatedUser);
      
      fetchProfile();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update profile");
    }
  };

  if (loading || !profileData) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-400 font-mono">RETRIEVING USER LOGS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 text-left">
      
      {/* Cover Banner */}
      <div className="h-44 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border border-white/5 relative overflow-hidden flex items-end p-6">
        {/* Animated Grid on cover */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
        
        <div className="flex flex-col sm:flex-row items-center gap-4 z-10 w-full">
          {/* Avatar frame */}
          <div className="h-20 w-20 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold overflow-hidden shadow-lg flex-shrink-0">
            {profileData.profile_pic ? (
              <img src={profileData.profile_pic.startsWith('http') ? profileData.profile_pic : `${BACKEND_URL}${profileData.profile_pic}`} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              profileData.username[0].toUpperCase()
            )}
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-2xl font-bold font-display text-white">{profileData.username}</h2>
            <div className="flex flex-wrap justify-center sm:justify-start items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" />
                {profileData.email}
              </span>
              <span>&middot;</span>
              <span className="flex items-center gap-1 uppercase font-mono text-[10px]">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                {profileData.role} Profile
              </span>
            </div>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl text-center">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl text-center">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Stats and Badges */}
        <div className="space-y-6">
          
          {/* Diagnostic Counter */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <span className="text-[10px] text-gray-500 font-mono block">DIAGNOSTIC TASKS RUN</span>
            <h3 className="text-4xl font-bold text-white font-display mt-2">{profileData.prediction_count}</h3>
            <p className="text-[10px] text-gray-400 leading-relaxed mt-2 leading-relaxed">
              Diagnoses submitted through this security credentials session.
            </p>
          </div>

          {/* Achievements badge log */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <Award className="h-5 w-5" />
              <h4 className="text-sm font-semibold font-display">Academic Badges</h4>
            </div>

            <div className="space-y-3">
              {profileData.achievements && profileData.achievements.length > 0 ? (
                profileData.achievements.map((ach: any, idx: number) => (
                  <div key={idx} className="flex gap-3 bg-slate-950/40 border border-white/5 p-3 rounded-xl">
                    <span className="text-xl flex-shrink-0">{ach.badge}</span>
                    <div>
                      <h5 className="text-xs font-semibold text-white font-display">{ach.title}</h5>
                      <p className="text-[10px] text-gray-500 leading-relaxed font-sans">{ach.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-600 font-mono py-4 text-center">
                  Run your first diagnosis to unlock badge achievements
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Details / Edit / Recent updates */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Edit Profile / Details Card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white font-display">Profile Specifications</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white hover:border-emerald-500/30 transition-all duration-200"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>{isEditing ? "View Details" : "Edit Profile"}</span>
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit(handleEditSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Username</label>
                    <input
                      type="text"
                      {...register("username", { required: "Username is required" })}
                      className="w-full bg-slate-950/80 border border-white/10 focus:border-emerald-500/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all duration-200"
                    />
                    {errors.username && <span className="text-[10px] text-red-400">{errors.username.message}</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                    <input
                      type="text"
                      {...register("phone")}
                      className="w-full bg-slate-950/80 border border-white/10 focus:border-emerald-500/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all duration-200"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold border border-emerald-500/20 shadow-glow-emerald transition-colors"
                >
                  Save alterations
                </button>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950/40 p-3.5 border border-white/5 rounded-xl">
                  <span className="text-[10px] text-gray-500 block font-mono">ACCOUNT USERNAME</span>
                  <span className="font-semibold text-gray-300 mt-1 block">{profileData.username}</span>
                </div>
                <div className="bg-slate-950/40 p-3.5 border border-white/5 rounded-xl">
                  <span className="text-[10px] text-gray-500 block font-mono">PHONE NUMBER</span>
                  <span className="font-semibold text-gray-300 mt-1 block">{profileData.phone || "Not configured"}</span>
                </div>
                <div className="bg-slate-950/40 p-3.5 border border-white/5 rounded-xl">
                  <span className="text-[10px] text-gray-500 block font-mono">OAUTH PROVIDER MODE</span>
                  <span className="font-semibold text-emerald-400 uppercase mt-1 block font-mono tracking-widest">{profileData.provider}</span>
                </div>
                <div className="bg-slate-950/40 p-3.5 border border-white/5 rounded-xl">
                  <span className="text-[10px] text-gray-500 block font-mono">REGISTRY TIMESTAMP</span>
                  <span className="font-semibold text-gray-300 mt-1 block">{profileData.created_at || "N/A"}</span>
                </div>
              </div>
            )}
          </div>

          {/* Static details representation: academic specs */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 flex gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl self-start">
              <Bookmark className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-white font-display">Academic Demonstration Specifications</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                This project matches core criteria for final year Engineering demonstrations. The TensorFlow CNN model weights are loaded on server bootstrap in <code>app.py</code>. DB schema is configured in SQLite, tracking session indexes.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;
