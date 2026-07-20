import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, LogOut, User, LayoutDashboard, Upload, Shield, Menu, X, Home, BookOpen, ShieldAlert, Compass } from 'lucide-react';
import { BACKEND_URL } from '../services/api';

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
        : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
    }`;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#030712]/75 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-white font-display font-semibold tracking-wider text-lg">
              <img src="/static/logo.svg" alt="CropDiag Logo" className="h-8 w-8 animate-pulse" />
              <span>CROPDIAG <span className="text-emerald-400 font-bold">AI</span></span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/" className={linkClass('/')}>
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link to="/upload" className={linkClass('/upload')}>
              <Upload className="h-4 w-4" />
              <span>Diagnose</span>
            </Link>
            <Link to="/risk" className={linkClass('/risk')}>
              <ShieldAlert className="h-4 w-4" />
              <span>Risk Forecast</span>
            </Link>
            <Link to="/encyclopedia" className={linkClass('/encyclopedia')}>
              <BookOpen className="h-4 w-4" />
              <span>Encyclopedia</span>
            </Link>
            <Link to="/about" className={linkClass('/about')}>
              <Compass className="h-4 w-4" />
              <span>About</span>
            </Link>
            <Link to="/dashboard" className={linkClass('/dashboard')}>
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            {user && (
              <Link to="/profile" className={linkClass('/profile')}>
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            )}
            {user && user.role === 'admin' && (
              <Link to="/admin" className={linkClass('/admin')}>
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Authentication & Profile Dropdown */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/profile" className="flex items-center gap-2 group">
                  <div className="h-8 w-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold overflow-hidden">
                    {user.profile_pic ? (
                      <img src={user.profile_pic.startsWith('http') ? user.profile_pic : `${BACKEND_URL}${user.profile_pic}`} alt="avatar" className="h-full w-full object-cover" />
                    ) : (
                      user.username[0].toUpperCase()
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    {user.username}
                  </span>
                </Link>
                <button
                  onClick={onLogout}
                  className="flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
                  title="Logout"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg border border-emerald-500/30 transition-all duration-200 shadow-glow-emerald"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/5 bg-[#030712]/95 backdrop-blur-lg px-4 py-3 space-y-1">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/') ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-300'
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link
            to="/upload"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/upload') ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-300'
            }`}
          >
            <Upload className="h-5 w-5" />
            <span>Diagnose</span>
          </Link>
          <Link
            to="/risk"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/risk') ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-300'
            }`}
          >
            <ShieldAlert className="h-5 w-5" />
            <span>Risk Forecast</span>
          </Link>
          <Link
            to="/encyclopedia"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/encyclopedia') ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-300'
            }`}
          >
            <BookOpen className="h-5 w-5" />
            <span>Encyclopedia</span>
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/about') ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-300'
            }`}
          >
            <Compass className="h-5 w-5" />
            <span>About Us</span>
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
              isActive('/dashboard') ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-300'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          {user && (
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive('/profile') ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-300'
              }`}
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>
          )}
          {user && user.role === 'admin' && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                isActive('/admin') ? 'text-emerald-400 bg-emerald-500/10' : 'text-gray-300'
              }`}
            >
              <Shield className="h-5 w-5" />
              <span>Admin Panel</span>
            </Link>
          )}
          <hr className="border-white/5 my-2" />
          {user ? (
            <div className="space-y-1">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="h-9 w-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold overflow-hidden">
                  {user.profile_pic ? (
                    <img src={user.profile_pic.startsWith('http') ? user.profile_pic : `${BACKEND_URL}${user.profile_pic}`} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    user.username[0].toUpperCase()
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{user.username}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
                className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex justify-center items-center px-4 py-2.5 text-base font-medium text-gray-300 bg-white/5 rounded-lg border border-white/5"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex justify-center items-center px-4 py-2.5 text-base font-medium text-white bg-emerald-600 rounded-lg border border-emerald-500/30"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
