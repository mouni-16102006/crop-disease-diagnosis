import React, { useState } from 'react';
import { ShieldAlert, Sprout, Wind, Droplets, Thermometer, CloudRain, Sun, Compass } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import axios from 'axios';
import { BACKEND_URL } from '../services/api';

export const RiskPredictor: React.FC = () => {
  const [formData, setFormData] = useState({
    location: 'Karur, Tamil Nadu',
    temperature: 28,
    humidity: 65,
    rainfall: 12,
    soil_moisture: 38,
    soil_type: 'Clay Loam',
    crop_age: 30,
    season: 'Summer',
    crop: 'Tomato'
  });
  
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'temperature' || name === 'humidity' || name === 'rainfall' || name === 'soil_moisture' || name === 'crop_age' 
        ? Number(value) 
        : value
    }));
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setResult(null);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/risk/predict`, formData);
      setResult(response.data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Failed to connect to risk analyzer engine.");
    } finally {
      setLoading(false);
    }
  };

  // Convert breakdown dictionary to Recharts format
  const getChartData = () => {
    if (!result) return [];
    return Object.entries(result.breakdown).map(([name, value]) => ({
      name,
      value
    }));
  };

  const getRiskBadgeColor = (level: string) => {
    if (level === 'Very High Risk') return 'bg-rose-500/10 border-rose-500/30 text-rose-400';
    if (level === 'High Risk') return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    if (level === 'Medium Risk') return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
    return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 text-left">
      <div>
        <h2 className="text-2xl font-bold font-display text-white">Pathogen Risk Forecast</h2>
        <p className="text-xs text-gray-400 font-sans tracking-wide mt-1">
          Input local atmospheric values to compute early-warning plant disease threats.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Parameters Card */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col justify-between">
          <form onSubmit={handlePredict} className="space-y-4">
            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              <Sprout className="h-4.5 w-4.5" />
              <span>Micro-Climate Specs</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Target Crop</label>
                <select
                  name="crop"
                  value={formData.crop}
                  onChange={handleChange}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Tomato">Tomato</option>
                  <option value="Potato">Potato</option>
                  <option value="Apple">Apple</option>
                  <option value="Banana">Banana</option>
                  <option value="Grape">Grape</option>
                  <option value="Corn">Corn</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Temp (°C)</label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Humidity (%)</label>
                <input
                  type="number"
                  name="humidity"
                  value={formData.humidity}
                  onChange={handleChange}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Rainfall (mm)</label>
                <input
                  type="number"
                  name="rainfall"
                  value={formData.rainfall}
                  onChange={handleChange}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Moisture (%)</label>
                <input
                  type="number"
                  name="soil_moisture"
                  value={formData.soil_moisture}
                  onChange={handleChange}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Crop Age (Days)</label>
                <input
                  type="number"
                  name="crop_age"
                  value={formData.crop_age}
                  onChange={handleChange}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Season</label>
                <select
                  name="season"
                  value={formData.season}
                  onChange={handleChange}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Summer">Summer</option>
                  <option value="Monsoon">Monsoon</option>
                  <option value="Winter">Winter</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Soil Type</label>
                <select
                  name="soil_type"
                  value={formData.soil_type}
                  onChange={handleChange}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Clay Loam">Clay Loam</option>
                  <option value="Sandy Soil">Sandy Soil</option>
                  <option value="Red soil">Red Soil</option>
                  <option value="Black Soil">Black Soil</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Farm Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold border border-emerald-500/20 transition-all shadow-glow-emerald"
            >
              {loading ? "Calculating models..." : "Calculate Pathology Risk"}
            </button>
          </form>
        </div>

        {/* Prediction Charts and Results */}
        <div className="lg:col-span-2 space-y-6">
          {errorMsg && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-xl text-center">
              {errorMsg}
            </div>
          )}

          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-300">
              {/* Stat card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="glass-panel p-4 rounded-2xl border border-white/5 text-left col-span-2">
                  <span className="text-[10px] text-gray-500 block font-mono">RISK ASSESSMENT</span>
                  <span className={`inline-block text-sm font-bold px-3 py-0.5 rounded border mt-2 ${getRiskBadgeColor(result.risk_level)}`}>
                    {result.risk_level}
                  </span>
                </div>

                <div className="glass-panel p-4 rounded-2xl border border-white/5 text-left">
                  <span className="text-[10px] text-gray-500 block font-mono">THREAT INDEX</span>
                  <span className="text-2xl font-bold text-white block mt-1">{result.score}%</span>
                </div>

                <div className="glass-panel p-4 rounded-2xl border border-white/5 text-left">
                  <span className="text-[10px] text-gray-500 block font-mono">CROP MODEL</span>
                  <span className="text-sm font-bold text-emerald-400 block mt-2.5">{result.crop}</span>
                </div>
              </div>

              {/* Charts grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bar chart */}
                <div className="glass-panel p-5 rounded-2xl border border-white/5 h-80 flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest text-left mb-2">Weight Distribution</h4>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#6B7280" fontSize={9} />
                        <YAxis stroke="#6B7280" fontSize={9} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                        <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Radar chart */}
                <div className="glass-panel p-5 rounded-2xl border border-white/5 h-80 flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest text-left mb-2">Pathogen Vector radar</h4>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={getChartData()}>
                        <PolarGrid stroke="rgba(255,255,255,0.05)" />
                        <PolarAngleAxis dataKey="name" stroke="#6B7280" fontSize={9} />
                        <PolarRadiusAxis stroke="#6B7280" fontSize={8} />
                        <Radar name="Threat" dataKey="value" stroke="#34d399" fill="#10b981" fillOpacity={0.2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Advice box */}
              <div className="glass-panel p-5 rounded-2xl border border-white/5 flex gap-4 text-left">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl self-start flex-shrink-0">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-white font-display">Pathologist Prevention Advice</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    {result.advice}. In {formData.season} seasons, soils like {formData.soil_type} can retain excess moisture. Avoid over-irrigation.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel h-[460px] rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 z-10 animate-bounce">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-semibold text-white font-display z-10">No calculation data loaded</h3>
              <p className="text-xs text-gray-500 max-w-sm mt-1 leading-relaxed z-10">
                Submit local weather metrics on the left side form to predict pathogen threat index rates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskPredictor;
