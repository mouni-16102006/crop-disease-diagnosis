import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, History, Settings, User, Shield, BarChart3, Users } from 'lucide-react';

interface SidebarProps {
  user: any;
}

export const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'text-emerald-400 bg-emerald-500/10 border-l-4 border-l-emerald-500 shadow-sm'
        : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-4 border-l-transparent'
    }`;

  return (
    <aside className="w-64 hidden lg:flex flex-col border-r border-white/5 bg-[#030712]/50 h-[calc(100vh-64px)] sticky top-16 p-4 space-y-2">
      <div className="px-4 py-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Workspace
        </p>
      </div>

      <Link to="/dashboard" className={linkClass('/dashboard')}>
        <LayoutDashboard className="h-4.5 w-4.5" />
        <span>General Stats</span>
      </Link>

      <Link to="/profile" className={linkClass('/profile')}>
        <User className="h-4.5 w-4.5" />
        <span>Profile & Badges</span>
      </Link>

      <Link to="/upload" className={linkClass('/upload')}>
        <History className="h-4.5 w-4.5" />
        <span>Run Diagnosis</span>
      </Link>

      {user && user.role === 'admin' && (
        <>
          <div className="px-4 py-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
              Admin Suite
            </p>
          </div>

          <Link to="/admin" className={linkClass('/admin')}>
            <Shield className="h-4.5 w-4.5" />
            <span>Admin Console</span>
          </Link>
        </>
      )}

      {/* Model Specs Quick Info Box */}
      <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-emerald-950/20 to-cyan-950/20 border border-emerald-500/10 text-xs">
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
          <BarChart3 className="h-4 w-4" />
          <span>CNN Pipeline V1.0</span>
        </div>
        <p className="text-gray-400 mb-2 leading-relaxed">
          TF model optimized for 10 crops. 94.2% test accuracy.
        </p>
        <div className="flex items-center justify-between text-gray-500">
          <span>Classes:</span>
          <span className="font-mono text-[10px]">20 Classes</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
