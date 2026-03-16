import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Link as LinkIcon, Terminal, AlertTriangle, ShieldCheck, AlertCircle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

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
      <svg className="transform -rotate-90 w-32 h-32">
        <circle
          cx="64"
          cy="64"
          r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-[#2b2b2b]"
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
          className={`transition-all duration-1000 ease-out ${getRiskColor(score)}`}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold ${getRiskColor(score)}`}>{score}</span>
        <span className="text-xs text-gray-400">Risk Score</span>
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
      const res = await axios.post(`${API_BASE_URL}${endpoint}`, payload);
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
      <div className="glass-panel p-6 flex flex-col h-full">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          Threat Scanner
        </h2>
        
        <div className="flex bg-[#1f1f1f] rounded-lg p-1 mb-6">
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${activeTab === 'email' ? 'bg-[#2b2b2b] text-white shadow' : 'text-gray-400 hover:text-white'}`}
            onClick={() => { setActiveTab('email'); setInputVal(''); setResult(null); }}
          >
            <Mail size={16} /> Email / Message
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${activeTab === 'url' ? 'bg-[#2b2b2b] text-white shadow' : 'text-gray-400 hover:text-white'}`}
            onClick={() => { setActiveTab('url'); setInputVal(''); setResult(null); }}
          >
            <LinkIcon size={16} /> URL Link
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all ${activeTab === 'prompt' ? 'bg-[#2b2b2b] text-white shadow' : 'text-gray-400 hover:text-white'}`}
            onClick={() => { setActiveTab('prompt'); setInputVal(''); setResult(null); }}
          >
            <Terminal size={16} /> AI Prompt
          </button>
        </div>

        <div className="flex-grow flex flex-col">
          {activeTab === 'email' && (
            <textarea
              className="w-full h-48 bg-[#141414] border border-[#2b2b2b] focus:border-cyber-blue rounded-lg p-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyber-blue transition-all"
              placeholder="Paste suspicious email or message here..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
          )}
          {activeTab === 'url' && (
             <input
               type="text"
               className="w-full bg-[#141414] border border-[#2b2b2b] focus:border-cyber-blue rounded-lg p-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyber-blue transition-all"
               placeholder="Enter a URL to analyze (e.g., http://paypal-secure-login-verification.com)..."
               value={inputVal}
               onChange={(e) => setInputVal(e.target.value)}
             />
          )}
          {activeTab === 'prompt' && (
             <textarea
               className="w-full h-48 bg-[#141414] border border-[#2b2b2b] focus:border-cyber-blue rounded-lg p-4 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyber-blue transition-all"
               placeholder="Paste AI prompt to check for prompt injection..."
               value={inputVal}
               onChange={(e) => setInputVal(e.target.value)}
             />
          )}

          <button
            onClick={handleScan}
            disabled={loading || !inputVal.trim()}
            className={`mt-6 w-full py-3 rounded-lg font-bold text-white transition-all ${
              loading || !inputVal.trim() 
                ? 'bg-[#2b2b2b] cursor-not-allowed opacity-50' 
                : 'bg-gradient-to-r from-cyber-blue/80 to-[#00a2ff]/80 hover:from-cyber-blue hover:to-[#00a2ff] shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)]'
            }`}
          >
            {loading ? 'Analyzing...' : `Analyze ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
          </button>
        </div>
      </div>

      {/* Results Panel */}
      <div className="glass-panel p-6 flex flex-col h-full min-h-[500px]">
        <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>
        
        {!result && !loading && (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-500">
            <ShieldCheck size={64} className="mb-4 opacity-20" />
            <p>Submit content for AI analysis</p>
          </div>
        )}

        {loading && (
          <div className="flex-grow flex flex-col items-center justify-center text-cyber-blue">
            <div className="w-12 h-12 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="animate-pulse">Processing with ThreatLens AI Engine...</p>
          </div>
        )}

        {result && !loading && (
          <div className="flex-grow flex flex-col animate-[fadeIn_0.5s_ease-out]">
            {/* Top Stats */}
            <div className="flex items-center justify-between bg-[#1f1f1f] p-4 rounded-lg mb-6 border border-[#2b2b2b]">
              <div className="flex items-center gap-4">
                {getRiskIcon(result.risk_level)}
                <div>
                  <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    {result.threat_type}
                  </h3>
                  <p className="text-sm text-gray-400">Confidence: {result.confidence_level}</p>
                </div>
              </div>
              <RiskGauge score={result.risk_score} />
            </div>

            {/* Explainable AI Section */}
            <div className="mb-6">
              <h4 className="text-lg font-bold mb-3 border-b border-[#2b2b2b] pb-2 text-cyber-blue">Why this is flagged</h4>
              {result.explanation.length > 0 ? (
                <ul className="space-y-2">
                  {result.explanation.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-300">
                      <AlertTriangle size={16} className="text-yellow-500 mt-1 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 italic">No specific suspicious indicators found.</p>
              )}
            </div>

            <div className="mb-6">
              <h4 className="text-sm font-bold text-gray-400 mb-2">Original Content Snippet</h4>
              <div className="bg-[#141414] p-3 rounded border border-[#2b2b2b] text-sm text-gray-300 font-mono overflow-auto max-h-32">
                {highlightText(inputVal, result.explanation)}
              </div>
            </div>

            {/* Recommended Action */}
            <div className="mt-auto">
              <h4 className="text-lg font-bold mb-3 border-b border-[#2b2b2b] pb-2 text-cyber-green">What You Should Do Next</h4>
              <ul className="grid grid-cols-1 gap-2">
                {result.recommended_actions.map((action, idx) => (
                  <li key={idx} className="bg-[#1f1f1f] border border-[#2b2b2b] p-3 rounded-md flex items-center gap-3 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-cyber-green"></div>
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
