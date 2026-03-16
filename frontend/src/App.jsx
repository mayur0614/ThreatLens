import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, Activity, FileText, Info } from 'lucide-react';

import ScannerPage from './pages/ScannerPage';
import AnalyticsPage from './pages/AnalyticsPage';
import LogsPage from './pages/LogsPage';

function Navbar() {
  const location = useLocation();
  
  const navLinks = [
    { name: 'Scanner', path: '/', icon: <Shield size={18} /> },
    { name: 'Analytics', path: '/analytics', icon: <Activity size={18} /> },
    { name: 'Incident Logs', path: '/logs', icon: <FileText size={18} /> },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-cyber-blue blur-md opacity-30 group-hover:opacity-60 transition-opacity"></div>
              <Shield className="text-cyber-blue relative z-10" size={28} />
            </div>
            <span className="font-bold text-xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cyber-blue to-cyber-purple drop-shadow-sm group-hover:drop-shadow-[0_0_10px_rgba(0,180,216,0.5)] transition-all">
              ThreatLens AI
            </span>
          </div>
          <div className="flex space-x-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                    isActive 
                      ? 'text-white shadow-glass bg-white/5 border border-white/10' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/20 to-transparent opacity-50"></div>
                  )}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-cyber-blue to-cyber-purple"></div>
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {link.icon}
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<ScannerPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/logs" element={<LogsPage />} />
          </Routes>
        </main>
        <footer className="py-6 text-center text-sm text-gray-500 border-t border-[#1f1f1f]">
          <p>© 2026 ThreatLens AI. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
