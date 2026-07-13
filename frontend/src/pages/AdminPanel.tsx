import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileSpreadsheet, Database, Trash2, ShieldCheck, HelpCircle, Server, RefreshCw } from 'lucide-react';
import apiClient, { BACKEND_URL } from '../services/api';

interface AdminPanelProps {
  user: any;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ user }) => {
  const navigate = useNavigate();
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Enforce Admin Access
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/admin/users');
      setUsersList(response.data);
    } catch (e) {
      console.error("Error loading admin data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const handleDeleteUser = async (uid: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
    try {
      await apiClient.delete(`/admin/users/${uid}`);
      setFeedbackMsg("User deleted successfully!");
      fetchData();
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadExcel = () => {
    // Open the excel download endpoint in a new tab
    window.open(`${BACKEND_URL}/api/admin/reports/excel`, '_blank');
  };

  const handleSyncDataset = async () => {
    setSyncing(true);
    try {
      const response = await apiClient.post('/admin/dataset/upload');
      setFeedbackMsg(response.data.message || "Dataset synced successfully!");
      setTimeout(() => setFeedbackMsg(''), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-400 font-mono">LOADING ADMINISTRATIVE GATEWAYS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 text-left">
      <div>
        <h2 className="text-2xl font-bold font-display text-white">Administrative Management Suite</h2>
        <p className="text-xs text-gray-400 font-sans tracking-wide mt-1">
          Perform administrative updates, sync agricultural neural data, and download spreadsheets.
        </p>
      </div>

      {feedbackMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl text-center">
          {feedbackMsg}
        </div>
      )}

      {/* Controls panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Spreadsheet Export Card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex gap-3">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white font-display">Export Reports</h4>
              <p className="text-[10px] text-gray-500 font-sans mt-0.5">Download details of all leaf diagnostic predictions as an Excel spreadsheet.</p>
            </div>
          </div>
          <button
            onClick={handleDownloadExcel}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-glow-cyan"
          >
            Download excel spreadsheet
          </button>
        </div>

        {/* Dataset sync Card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex gap-3">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <Database className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white font-display">Dataset Sync</h4>
              <p className="text-[10px] text-gray-500 font-sans mt-0.5">Recompile active image indexes and train new diagnostic model weights.</p>
            </div>
          </div>
          <button
            onClick={handleSyncDataset}
            disabled={syncing}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-glow-emerald flex items-center justify-center gap-1.5"
          >
            {syncing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
            <span>{syncing ? "Syncing buffers..." : "Sync database images"}</span>
          </button>
        </div>

        {/* Server status Card */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex gap-3">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
              <Server className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white font-display">Backend Gateway Status</h4>
              <p className="text-[10px] text-gray-500 font-sans mt-0.5">Physical hardware diagnostic logs and SQLite memory status.</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs bg-slate-950/60 p-2.5 border border-white/5 rounded-xl text-gray-400 font-mono">
            <span>GATEWAY SERVER:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE (PORT 8080)
            </span>
          </div>
        </div>

      </div>

      {/* Users table */}
      <div className="glass-panel rounded-2xl border border-white/5 p-6 space-y-4">
        <div className="flex gap-2.5 items-center">
          <Users className="h-5 w-5 text-emerald-400" />
          <div>
            <h4 className="text-sm font-semibold text-white font-display">Registered Users Directory</h4>
            <p className="text-[10px] text-gray-500">View details and roles of all registered agricultural laboratory members</p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="min-w-full divide-y divide-white/5 text-left text-xs">
            <thead className="bg-slate-950/40 text-gray-400 uppercase tracking-widest text-[9px] font-semibold">
              <tr>
                <th className="px-6 py-3.5">User ID</th>
                <th className="px-6 py-3.5">Username</th>
                <th className="px-6 py-3.5">Email address</th>
                <th className="px-6 py-3.5">Phone</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">OAuth Provider</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-[#030712]/20 text-gray-300">
              {usersList.length > 0 ? (
                usersList.map((usr) => (
                  <tr key={usr.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-500">#{usr.id}</td>
                    <td className="px-6 py-4 font-semibold text-white">{usr.username}</td>
                    <td className="px-6 py-4 text-gray-400">{usr.email}</td>
                    <td className="px-6 py-4 font-mono text-gray-400">{usr.phone || "None"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded border text-[9px] font-bold ${
                        usr.role === 'admin' 
                          ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' 
                          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      }`}>
                        {usr.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-gray-400 uppercase text-[10px]">{usr.provider}</td>
                    <td className="px-6 py-4 text-right">
                      {usr.role !== 'admin' ? (
                        <button
                          onClick={() => handleDeleteUser(usr.id)}
                          className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      ) : (
                        <ShieldCheck className="h-5.5 w-5.5 text-purple-400 inline-block mr-1" />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-600 font-mono">
                    No registered user records logged.
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

export default AdminPanel;
