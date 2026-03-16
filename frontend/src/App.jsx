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
    <nav className="sticky top-0 z-50 glass-panel rounded-none border-x-0 border-t-0 border-b-[#2b2b2b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Shield className="text-cyber-blue" size={28} />
            <span className="font-bold text-xl tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-cyber-blue to-[#00a2ff]">
              ThreatLens AI
            </span>
          </div>
          <div className="flex space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#2b2b2b] text-white shadow-sm' 
                      : 'text-gray-400 hover:text-white hover:bg-[#1f1f1f]'
                  }`}
                >
                  {link.icon}
                  {link.name}
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
