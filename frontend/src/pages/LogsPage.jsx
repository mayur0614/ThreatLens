import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Database, AlertTriangle, ShieldCheck } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(null);

  const fetchLogs = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/analytics`);
      setLogs(res.data.recent_history || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleFeedback = async (scanId, label) => {
    setSubmitting(scanId);
    try {
      await axios.post(`${API_BASE_URL}/feedback`, { scan_id: scanId, label });
      alert('Intelligence feedback recorded!');
      fetchLogs();
    } catch (err) {
      console.error(err);
      alert('Error recording feedback.');
    } finally {
      setSubmitting(null);
    }
  };

  const getRiskMarkup = (score) => {
    if (score < 40) return <span className="bg-cyber-green/20 text-cyber-green px-2 py-1 rounded text-xs font-bold border border-cyber-green/50">Safe ({score})</span>;
    if (score < 70) return <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-xs font-bold border border-yellow-500/50">Suspicious ({score})</span>;
    return <span className="bg-cyber-red/20 text-cyber-red px-2 py-1 rounded text-xs font-bold border border-cyber-red/50">Dangerous ({score})</span>;
  };

  if (loading) return <div className="p-8 text-center text-cyber-blue">Loading Logs...</div>;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
          <div className="p-3 bg-cyber-blue/10 rounded-xl text-cyber-blue">
            <Database size={28} />
          </div>
          Incident Logs
        </h2>
        <span className="bg-dark-800 text-gray-300 px-4 py-2 rounded-lg border border-white/5 text-sm font-medium shadow-inner flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyber-blue animate-pulse"></div>
          Showing last 20 events
        </span>
      </div>

      <div className="glass-panel overflow-hidden border border-white/5 shadow-glass">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-900/80 border-b border-white/5">
                <th className="p-5 text-xs tracking-widest text-gray-500 uppercase font-bold">Timestamp</th>
                <th className="p-5 text-xs tracking-widest text-gray-500 uppercase font-bold">Type</th>
                <th className="p-5 text-xs tracking-widest text-gray-500 uppercase font-bold">Snippet</th>
                <th className="p-5 text-xs tracking-widest text-gray-500 uppercase font-bold">Indicators</th>
                <th className="p-5 text-xs tracking-widest text-gray-500 uppercase font-bold">Risk Score</th>
                <th className="p-5 text-xs tracking-widest text-gray-500 uppercase font-bold text-center">Intelligence Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <ShieldCheck size={48} className="opacity-20" />
                      <span>No scans recorded yet.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-5 text-sm text-gray-400 whitespace-nowrap font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-5 text-sm font-bold text-gray-200">
                      {log.threat_type}
                    </td>
                    <td className="p-5 text-sm text-gray-400 max-w-xs truncate group-hover:text-gray-300 transition-colors" title={log.input_text}>
                      {log.input_text.substring(0, 50)}...
                    </td>
                    <td className="p-5 text-sm text-gray-400">
                      <div className="flex gap-2 flex-wrap">
                        {log.explanation && log.explanation.length > 0 ? (
                          log.explanation.slice(0, 2).map((ind, i) => (
                            <span key={i} className="bg-dark-900 border border-white/10 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded" title={ind}>{ind.split(' ')[0]}...</span>
                          ))
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </div>
                    </td>
                    <td className="p-5 whitespace-nowrap">
                      {getRiskMarkup(log.risk_score)}
                    </td>
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleFeedback(log.id, 1)}
                          disabled={submitting === log.id}
                          className="p-2 bg-cyber-red/10 text-cyber-red rounded-lg border border-cyber-red/20 hover:bg-cyber-red/20 transition-all group-hover:shadow-[0_0_10px_rgba(255,0,84,0.2)]"
                          title="Confirm as Threat"
                        >
                          <AlertTriangle size={16} />
                        </button>
                        <button 
                          onClick={() => handleFeedback(log.id, 0)}
                          disabled={submitting === log.id}
                          className="p-2 bg-cyber-green/10 text-cyber-green rounded-lg border border-cyber-green/20 hover:bg-cyber-green/20 transition-all group-hover:shadow-[0_0_10px_rgba(0,255,65,0.2)]"
                          title="Mark as Safe"
                        >
                          <ShieldCheck size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
