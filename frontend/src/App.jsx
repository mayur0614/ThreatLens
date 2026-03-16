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
          <div className="flex items-center gap-3 group cursor-pointer relative">
            <div className="absolute -inset-2 bg-cyber-blue/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-2 bg-dark-800 rounded-xl border border-white/10 shadow-glow-blue group-hover:scale-110 transition-transform duration-300">
              <Shield className="text-cyber-blue" size={24} />
            </div>
            <span className="font-black text-2xl tracking-tighter uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-cyber-light to-cyber-blue drop-shadow-[0_0_15px_rgba(0,180,216,0.8)] group-hover:drop-shadow-[0_0_25px_rgba(0,180,216,1)] transition-all">
              THREATLENS
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
      <div className="min-h-screen bg-dark-900 text-gray-100 flex flex-col font-sans relative overflow-hidden">
        {/* Futuristic animated background elements */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyber-blue/10 rounded-full blur-[120px] mix-blend-screen animate-float"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyber-purple/10 rounded-full blur-[120px] mix-blend-screen animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-[40%] left-[60%] w-[20%] h-[20%] bg-cyber-green/5 rounded-full blur-[100px] mix-blend-screen animate-pulse-glow"></div>
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 relative">
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDM5LjVoNDBWNDBoLTQweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIvPjxwYXRoIGQ9Ik0zOS41IDB2NDBoMC41VjB6IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDIpIi8+PC9zdmc+')] pointer-events-none opacity-50 z-[-1]"></div>
            
            <Routes>
              <Route path="/" element={<ScannerPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/logs" element={<LogsPage />} />
            </Routes>
          </main>
          <footer className="py-8 text-center text-sm text-gray-500 border-t border-white/5 bg-dark-900/50 backdrop-blur-md relative z-10 mt-auto">
            <div className="w-full h-px absolute top-0 left-0 bg-gradient-to-r from-transparent via-cyber-blue/50 to-transparent"></div>
            <p className="flex items-center justify-center gap-2">
              <span className="text-cyber-green animate-pulse-glow">●</span> System Online | © 2026 ThreatLens Security Analytics
            </p>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
