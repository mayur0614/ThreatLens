import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Link as LinkIcon, Terminal, AlertTriangle, ShieldCheck, AlertCircle, Activity, Shield, Cpu } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

function RiskGauge({ score }) {
  const getRiskColor = (s) => {
    if (s < 40) return 'text-cyber-green';
    if (s < 70) return 'text-yellow-500';
    return 'text-cyber-red';
  };

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <div className={`absolute inset-0 rounded-full blur-xl opacity-20 transition-colors duration-1000 ${
        score < 40 ? 'bg-cyber-green' : score < 70 ? 'bg-yellow-500' : 'bg-cyber-red'
      }`}></div>
      <svg className="transform -rotate-90 w-32 h-32 relative z-10">
        <circle
          cx="64"
          cy="64"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-dark-700"
        />
        <circle
          cx="64"
          cy="64"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`transition-all duration-1000 ease-out drop-shadow-[0_0_8px_currentColor] ${getRiskColor(score)}`}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center z-20">
        <span className={`text-3xl font-bold tracking-tighter drop-shadow-md ${getRiskColor(score)}`}>{score}</span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Risk Score</span>
      </div>
    </div>
  );
}

export default function ScannerPage() {
  const [activeTab, setActiveTab] = useState('email');
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = async () => {
    if (!inputVal.trim()) return;
    setLoading(true);
    setResult(null);

    let endpoint = '';
    let payload = {};

    switch (activeTab) {
      case 'email':
        endpoint = '/scan_email';
        payload = { text: inputVal };
        break;
      case 'url':
        endpoint = '/scan_url';
        payload = { url: inputVal };
        break;
      case 'prompt':
        endpoint = '/scan_prompt';
        payload = { prompt: inputVal };
        break;
    }

    try {
      // Run API call and a minimum display time for the loader in parallel
      const [res] = await Promise.all([
        axios.post(`${API_BASE_URL}${endpoint}`, payload),
        new Promise(resolve => setTimeout(resolve, 1800)) // Always show loader for at least 1.8s
      ]);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskIcon = (level) => {
    if (level === 'Safe') return <ShieldCheck className="text-cyber-green w-8 h-8" />;
    if (level === 'Suspicious') return <AlertTriangle className="text-yellow-500 w-8 h-8" />;
    return <AlertCircle className="text-cyber-red w-8 h-8 animate-pulse-glow" />;
  };

  const highlightText = (text, indicators) => {
    if (!indicators || indicators.length === 0) return text;
    // Highlight some mock key phrases for demonstration based on the indicators
    // In a real app, the backend might return exact substrings
    let highlightedText = text;
    const keywords = ['urgent', 'verify', 'paypal', 'login', 'ignore previous instructions', 'developer mode'];
    
    keywords.forEach(kw => {
      const regex = new RegExp(`(${kw})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<span class="bg-cyber-red/20 text-cyber-red px-1 rounded font-bold">$1</span>');
    });

    return <div dangerouslySetInnerHTML={{ __html: highlightedText }} />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Scanner Input Section */}
      <div className="glass-panel p-8 flex flex-col h-full ring-1 ring-white/5 hover:ring-cyber-blue/30 transition-all duration-500">
        <h2 className="text-3xl font-black mb-8 flex items-center gap-3 drop-shadow-[0_0_10px_rgba(0,180,216,0.3)]">
          <div className="p-2 bg-cyber-blue/10 rounded-lg text-cyber-blue relative group-hover:shadow-[0_0_20px_rgba(0,180,216,0.5)] transition-shadow">
            <ShieldCheck size={28} />
          </div>
          Threat Scanner
        </h2>
        
        <div className="flex bg-dark-900/50 p-1 mb-8 rounded-xl border border-white/5 backdrop-blur-md relative overflow-hidden">
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-300 relative z-10 ${activeTab === 'email' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            onClick={() => { setActiveTab('email'); setInputVal(''); setResult(null); }}
          >
            {activeTab === 'email' && <div className="absolute inset-0 bg-dark-700 rounded-lg shadow-lg border border-white/10 -z-10 animate-fade-in"></div>}
            <Mail size={18} className={activeTab === 'email' ? 'text-cyber-blue' : ''} /> 
            <span className="font-medium">Email / Message</span>
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-300 relative z-10 ${activeTab === 'url' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            onClick={() => { setActiveTab('url'); setInputVal(''); setResult(null); }}
          >
            {activeTab === 'url' && <div className="absolute inset-0 bg-dark-700 rounded-lg shadow-lg border border-white/10 -z-10 animate-fade-in"></div>}
            <LinkIcon size={18} className={activeTab === 'url' ? 'text-cyber-purple' : ''} /> 
            <span className="font-medium">URL Link</span>
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-300 relative z-10 ${activeTab === 'prompt' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
            onClick={() => { setActiveTab('prompt'); setInputVal(''); setResult(null); }}
          >
            {activeTab === 'prompt' && <div className="absolute inset-0 bg-dark-700 rounded-lg shadow-lg border border-white/10 -z-10 animate-fade-in"></div>}
            <Terminal size={18} className={activeTab === 'prompt' ? 'text-cyber-green' : ''} /> 
            <span className="font-medium">AI Prompt</span>
          </button>
        </div>

        <div className="flex-grow flex flex-col relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          {activeTab === 'email' && (
            <div className="relative w-full h-48 group">
               <textarea
                 className="absolute inset-0 w-full h-full bg-dark-800/80 backdrop-blur-sm border border-white/5 focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue rounded-xl p-5 text-gray-100 placeholder-gray-500 focus:outline-none transition-all resize-none shadow-inner text-base font-mono z-10"
                 placeholder="Paste suspicious email or message here..."
                 value={inputVal}
                 onChange={(e) => setInputVal(e.target.value)}
               />
               <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden z-20">
                 <div className="w-full h-1 bg-cyber-blue/20 blur-sm animate-scanline hidden group-focus-within:block"></div>
               </div>
            </div>
          )}
          {activeTab === 'url' && (
            <div className="relative w-full group">
               <input
                 type="text"
                 className="relative w-full bg-dark-800/80 backdrop-blur-sm border border-white/5 focus:border-cyber-purple focus:ring-1 focus:ring-cyber-purple rounded-xl p-5 text-gray-100 placeholder-gray-500 focus:outline-none transition-all shadow-inner text-base font-mono z-10"
                 placeholder="Enter a URL to analyze (e.g., http://paypal-secure-login-verification.com)..."
                 value={inputVal}
                 onChange={(e) => setInputVal(e.target.value)}
               />
               <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden z-20">
                 <div className="w-full h-1 bg-cyber-purple/20 blur-sm animate-scanline hidden group-focus-within:block"></div>
               </div>
            </div>
          )}
          {activeTab === 'prompt' && (
            <div className="relative w-full h-48 group">
               <textarea
                 className="absolute inset-0 w-full h-full bg-dark-800/80 backdrop-blur-sm border border-white/5 focus:border-cyber-green focus:ring-1 focus:ring-cyber-green rounded-xl p-5 text-gray-100 placeholder-gray-500 focus:outline-none transition-all resize-none shadow-inner text-base font-mono z-10"
                 placeholder="Paste AI prompt to check for prompt injection..."
                 value={inputVal}
                 onChange={(e) => setInputVal(e.target.value)}
               />
               <div className="absolute inset-0 pointer-events-none rounded-xl overflow-hidden z-20">
                 <div className="w-full h-1 bg-cyber-green/20 blur-sm animate-scanline hidden group-focus-within:block"></div>
               </div>
            </div>
          )}

          <button
            onClick={handleScan}
            disabled={loading || !inputVal.trim()}
            className={`mt-8 w-full py-4 rounded-xl font-bold tracking-wide text-white transition-all duration-300 relative overflow-hidden group ${
              loading || !inputVal.trim() 
                ? 'bg-dark-700 text-gray-500 cursor-not-allowed border border-white/5 opacity-70' 
                : 'bg-gradient-to-r from-cyber-blue to-cyber-purple shadow-glow-blue hover:shadow-glow-purple hover:scale-[1.02] transform'
            }`}
          >
            {(!loading && inputVal.trim()) && (
              <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300 ease-in-out"></div>
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : `Analyze ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
            </span>
          </button>
        </div>
      </div>

      {/* Results Panel */}
      <div className="glass-panel p-8 flex flex-col h-full min-h-[600px] ring-1 ring-white/5 relative overflow-hidden">
        {/* Cyber grid background layer for the panel */}
        <div className="absolute inset-0 bg-cyber-grid pointer-events-none opacity-20 mix-blend-overlay z-0"></div>

        <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 relative z-10">
          <div className="p-2 bg-white/5 rounded-lg text-gray-300 backdrop-blur-sm border border-white/5">
            <Activity size={24} />
          </div>
          Analysis Results
        </h2>
        
        {!result && !loading && (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-600 animate-fade-in relative z-10">
            <div className="relative mb-6 group cursor-default">
              <div className="absolute inset-0 bg-cyber-blue/20 blur-2xl rounded-full scale-110 group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
              <ShieldCheck size={80} className="relative z-10 opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-float" />
            </div>
            <p className="text-lg tracking-widest uppercase text-gray-500 font-bold opacity-70">Awaiting threat payload</p>
          </div>
        )}

        {loading && (
          <div className="flex-grow flex flex-col items-center justify-center animate-fade-in relative z-10">
            {/* Outer pulsing ring */}
            <div className="relative w-36 h-36 mb-8">
              <div className="absolute inset-0 border-2 border-cyber-blue/10 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
              <div className="absolute inset-0 border border-cyber-blue/20 rounded-full animate-ping" style={{ animationDuration: '2.7s', animationDelay: '0.5s' }}></div>

              {/* Spinning rings */}
              <div className="absolute inset-4 border-[3px] border-transparent border-t-cyber-blue rounded-full animate-spin" style={{ animationDuration: '0.9s' }}></div>
              <div className="absolute inset-8 border-[3px] border-transparent border-b-cyber-purple rounded-full animate-spin" style={{ animationDuration: '1.3s', animationDirection: 'reverse' }}></div>

              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyber-blue/30 blur-xl rounded-full"></div>
                  <Cpu className="relative w-10 h-10 text-cyber-blue animate-pulse drop-shadow-[0_0_10px_rgba(0,180,216,0.8)]" />
                </div>
              </div>
            </div>

            {/* Animated status text */}
            <p className="text-lg font-black tracking-widest uppercase text-cyber-blue mb-2 drop-shadow-[0_0_10px_rgba(0,180,216,0.5)]">Scanning...</p>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 font-bold mb-8">ThreatLens ML Engine</p>

            {/* Animated step indicators */}
            <div className="flex flex-col gap-3 w-64">
              {[
                'Vectorizing input text',
                'Running TF-IDF + Logistic Regression',
                'Computing threat probability',
                'Generating XAI explanation',
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-xs text-gray-500" style={{ animation: `fadeIn 0.5s ease-out ${i * 0.35}s both` }}>
                  <div className="w-2 h-2 rounded-full bg-cyber-blue/50 animate-pulse flex-shrink-0" style={{ animationDelay: `${i * 0.25}s` }}></div>
                  <div className="flex-1 h-px bg-gradient-to-r from-cyber-blue/50 to-transparent"></div>
                  <span className="tracking-wider">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="flex-grow flex flex-col animate-fade-in-up relative z-10">
            {/* Top Stats */}
            <div className="flex items-center justify-between bg-dark-900/40 p-6 rounded-2xl mb-8 border border-white/5 shadow-inner backdrop-blur-md relative overflow-hidden group">
              <div className="absolute inset-0 bg-cyber-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-cyber-blue to-cyber-purple"></div>
              <div className="flex items-center gap-5 ml-4 relative z-10">
                <div className="p-3 bg-dark-800 rounded-xl shadow-glass border border-white/5">
                  {getRiskIcon(result.risk_level)}
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    {result.threat_type}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyber-blue animate-pulse"></div>
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Confidence: <span className="text-gray-200">{result.confidence_level}</span></p>
                  </div>
                </div>
              </div>
              <RiskGauge score={result.risk_score} />
            </div>

            {/* Explainable AI Section */}
            <div className="mb-6 bg-dark-900/30 rounded-2xl p-6 border border-white/5">
              <h4 className="text-sm uppercase tracking-widest font-bold mb-4 flex items-center gap-2 text-cyber-blue">
                <AlertCircle size={16} /> Why this is flagged
              </h4>
              {result.explanation.length > 0 ? (
                <ul className="space-y-3">
                  {result.explanation.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-300 bg-dark-800/50 p-3 rounded-lg border border-white/5 hover:border-cyber-blue/30 transition-colors">
                      <AlertTriangle size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic text-sm p-4 bg-dark-800/30 rounded-lg">No specific suspicious indicators found.</p>
              )}
            </div>

            <div className="mb-8 bg-dark-900/30 rounded-2xl p-6 border border-white/5">
              <h4 className="text-sm uppercase tracking-widest font-bold mb-4 text-gray-500">Original Content Snippet</h4>
              <div className="bg-dark-900 p-4 rounded-xl border border-white/5 text-sm text-gray-400 font-mono overflow-auto max-h-40 leading-relaxed custom-scrollbar shadow-inner selection:bg-cyber-red/30">
                {highlightText(inputVal, result.explanation)}
              </div>
            </div>

            {/* Recommended Action */}
            <div className="mt-auto bg-cyber-green/5 rounded-2xl p-6 border border-cyber-green/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-green/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <h4 className="text-sm uppercase tracking-widest font-bold mb-4 text-cyber-green flex items-center gap-2">
                <ShieldCheck size={16} /> What You Should Do Next
              </h4>
              <ul className="grid grid-cols-1 gap-3 relative z-10">
                {result.recommended_actions.map((action, idx) => (
                  <li key={idx} className="bg-dark-900/80 backdrop-blur border border-cyber-green/20 p-4 rounded-xl flex items-center gap-4 hover:bg-cyber-green/10 hover:border-cyber-green/40 transition-all duration-300">
                    <div className="w-8 h-8 rounded-full bg-cyber-green/20 flex items-center justify-center flex-shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyber-green shadow-glow-green"></div>
                    </div>
                    <span className="text-gray-200 text-sm font-medium">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
