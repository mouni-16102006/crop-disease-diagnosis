import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import MouseGlow from './components/MouseGlow';
import ParticleBg from './components/ParticleBg';
import FloatingLeaves from './components/FloatingLeaves';
import LoadingScreen from './components/LoadingScreen';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Prediction from './pages/Prediction';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

import authService from './services/firebase';

export const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [appLoading, setAppLoading] = useState(true);
  const [sessionChecking, setSessionChecking] = useState(true);

  // Check active session on startup
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          } else {
            localStorage.removeItem('auth_token');
          }
        } catch (e) {
          console.error(e);
        }
      }
      setSessionChecking(false);
    };
    checkSession();
  }, []);

  const handleLoginSuccess = (loggedInUser: any) => {
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
  };

  const handleProfileUpdate = (updatedUser: any) => {
    setUser((prev: any) => ({ ...prev, ...updatedUser }));
  };

  const handlePredictionResult = (result: any) => {
    setPredictionResult(result);
  };

  // Return loading screen during progress
  if (appLoading) {
    return <LoadingScreen onComplete={() => setAppLoading(false)} />;
  }

  return (
    <Router>
      <div className="relative min-h-screen flex flex-col bg-[#030712] overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-300">
        
        {/* Visual FX Layers */}
        <ParticleBg />
        <MouseGlow />
        <FloatingLeaves />

        {/* Global Navigation bar */}
        <Navbar user={user} onLogout={handleLogout} />

        {/* Router configuration layouts */}
        <div className="flex-1 flex w-full">
          
          <Routes>
            {/* Public Layout */}
            <Route path="/" element={<Home />} />
            
            {/* Authentication page routes */}
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/dashboard" /> : <Register />} 
            />

            {/* Diagnostic Upload process */}
            <Route 
              path="/upload" 
              element={<Upload onPredictionResult={handlePredictionResult} />} 
            />
            
            {/* Diagnosis results card */}
            <Route 
              path="/prediction" 
              element={<Prediction result={predictionResult} />} 
            />

            {/* Authenticated Dashboard view layout (with Sidebar) */}
            <Route 
              path="/dashboard" 
              element={
                <div className="flex w-full">
                  <Sidebar user={user} />
                  <main className="flex-1 min-w-0">
                    <Dashboard />
                  </main>
                </div>
              } 
            />

            <Route 
              path="/profile" 
              element={
                user ? (
                  <div className="flex w-full">
                    <Sidebar user={user} />
                    <main className="flex-1 min-w-0">
                      <Profile user={user} onProfileUpdate={handleProfileUpdate} />
                    </main>
                  </div>
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />

            <Route 
              path="/admin" 
              element={
                user && user.role === 'admin' ? (
                  <div className="flex w-full">
                    <Sidebar user={user} />
                    <main className="flex-1 min-w-0">
                      <AdminPanel user={user} />
                    </main>
                  </div>
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />

            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
