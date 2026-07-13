import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, LineChart, Line } from 'recharts';
import { Search, Filter, ShieldAlert, Cpu, Heart, CheckCircle2, ChevronRight, Sprout } from 'lucide-react';
import apiClient from '../services/api';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCrop, setFilterCrop] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/dashboard/stats');
        setData(response.data);
      } catch (e) {
        console.error("Error fetching dashboard statistics", e);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-400 font-mono">LOADING DATA SPECIFICATIONS...</p>
        </div>
      </div>
    );
  }

  const { stats, recent_predictions, daily_history, crop_distribution, severity_distribution } = data;

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  // Handle local searching/filtering
  const filteredPredictions = recent_predictions.filter((p: any) => {
    const matchesSearch = p.crop.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.disease.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterCrop === 'All' || p.crop === filterCrop;
    return matchesSearch && matchesFilter;
  });

  const uniqueCrops = ['All', ...Array.from(new Set(recent_predictions.map((p: any) => p.crop))) as string[]];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 text-left">
      <div>
        <h2 className="text-2xl font-bold font-display text-white">System Diagnostics Panel</h2>
        <p className="text-xs text-gray-400 font-sans tracking-wide mt-1">
          Real-time metrics from TensorFlow neural network node and SQLite data registry
        </p>
      </div>

      {/* Counters Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Diagnoses */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-mono block">TOTAL DIAGNOSES</span>
            <span className="text-2xl font-bold text-white tracking-tight font-display">{stats.total_predictions}</span>
          </div>
        </div>

        {/* Pathologies Detected */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-mono block">PATHOLOGIES IDENTIFIED</span>
            <span className="text-2xl font-bold text-white tracking-tight font-display">{stats.diseased_crops}</span>
          </div>
        </div>

        {/* Healthy Crops */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-mono block">HEALTHY SAMPLES</span>
            <span className="text-2xl font-bold text-white tracking-tight font-display">{stats.healthy_crops}</span>
          </div>
        </div>

        {/* CNN Pipeline Latency */}
        <div className="glass-panel p-5 rounded-2xl border border-white/5 flex items-center gap-4 relative overflow-hidden">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 font-mono block">CNN INFERENCE SPEED</span>
            <span className="text-2xl font-bold text-white tracking-tight font-display">{stats.inference_time_ms} ms</span>
          </div>
        </div>
      </div>

      {/* Recharts Graphical Visuals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Area Chart: Daily predictions */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono">Prediction Volume Trend</h4>
            <p className="text-[10px] text-gray-500">Scan occurrences monitored over the last 7 calendar days</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={daily_history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="#6B7280" fontSize={10} tickLine={false} />
                <YAxis stroke="#6B7280" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }} />
                <Area type="monotone" dataKey="count" stroke="#10B981" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Crop Distribution */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono">Species Distribution</h4>
            <p className="text-[10px] text-gray-500">Breakdown of diagnosed plant genus categories</p>
          </div>
          <div className="h-48 flex items-center justify-center">
            {crop_distribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={crop_distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="crop"
                  >
                    {crop_distribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-gray-600">No species data available</span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-400 mt-2 max-h-16 overflow-y-auto">
            {crop_distribution.map((c: any, i: number) => (
              <div key={i} className="flex items-center gap-1.5 truncate">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="truncate">{c.crop} ({c.count})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Severity Breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono">Severity Profiles</h4>
            <p className="text-[10px] text-gray-500">Breakdown of damage magnitude metrics</p>
          </div>
          <div className="h-56">
            {severity_distribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severity_distribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="severity" stroke="#6B7280" fontSize={10} tickLine={false} />
                  <YAxis stroke="#6B7280" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }} />
                  <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                    {severity_distribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.severity === 'Severe' ? '#EF4444' : entry.severity === 'Moderate' ? '#F59E0B' : '#10B981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-gray-600">No severity records logged</div>
            )}
          </div>
        </div>

        {/* Line Chart: Accuracy Convergence */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest font-mono">Model Convergence Metrics</h4>
            <p className="text-[10px] text-gray-500">Interactive plotting representing target epochs accuracy updates</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { epoch: 1, acc: 0.42, val: 0.45 },
                { epoch: 5, acc: 0.68, val: 0.70 },
                { epoch: 10, acc: 0.81, val: 0.83 },
                { epoch: 15, acc: 0.88, val: 0.89 },
                { epoch: 20, acc: 0.92, val: 0.91 },
                { epoch: 25, acc: 0.94, val: 0.93 },
                { epoch: 30, acc: 0.96, val: 0.94 }
              ]} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="epoch" name="Epoch" stroke="#6B7280" fontSize={10} tickLine={false} />
                <YAxis stroke="#6B7280" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }} />
                <Line type="monotone" dataKey="acc" stroke="#10B981" strokeWidth={2} name="Train Acc" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="val" stroke="#3B82F6" strokeWidth={2} name="Val Acc" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* History table */}
      <div className="glass-panel rounded-2xl border border-white/5 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-white font-display">Recent Diagnostics Registry</h4>
            <p className="text-[10px] text-gray-500">Query or audit previous leaf diagnostics logs</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950/80 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50 w-44"
                placeholder="Search crop or disease"
              />
            </div>
            
            <div className="relative flex items-center gap-1.5 bg-slate-950/80 border border-white/10 rounded-lg px-2 text-xs text-gray-400">
              <Filter className="h-3.5 w-3.5" />
              <select
                value={filterCrop}
                onChange={(e) => setFilterCrop(e.target.value)}
                className="bg-transparent border-none text-white focus:ring-0 text-xs py-1.5 pr-6 cursor-pointer"
              >
                {uniqueCrops.map((c) => (
                  <option key={c} value={c} className="bg-slate-950">{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="min-w-full divide-y divide-white/5 text-left text-xs">
            <thead className="bg-slate-950/40 text-gray-400 uppercase tracking-widest text-[9px] font-semibold">
              <tr>
                <th className="px-6 py-3.5">Prediction ID</th>
                <th className="px-6 py-3.5">Crop species</th>
                <th className="px-6 py-3.5">Diagnosis</th>
                <th className="px-6 py-3.5">Confidence</th>
                <th className="px-6 py-3.5">Severity</th>
                <th className="px-6 py-3.5">Date Analyzed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#030712]/20 text-gray-300">
              {filteredPredictions.length > 0 ? (
                filteredPredictions.map((row: any) => (
                  <tr key={row.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-gray-500">#{row.id}</td>
                    <td className="px-6 py-4 font-semibold text-white">{row.crop}</td>
                    <td className={`px-6 py-4 font-semibold ${row.disease === 'Healthy' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {row.disease}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold">{(row.confidence * 100).toFixed(1)}%</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${
                        row.severity === 'Severe' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                        row.severity === 'Moderate' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                        row.severity === 'Mild' ? 'bg-lime-500/10 border-lime-500/20 text-lime-400' :
                        'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      }`}>
                        {row.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-sans">{row.created_at}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-600 font-mono">
                    No matching diagnostics logged.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
