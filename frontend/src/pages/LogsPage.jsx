import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Database, AlertTriangle, ShieldCheck } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchLogs();
  }, []);

  const getRiskMarkup = (score) => {
    if (score < 40) return <span className="bg-cyber-green/20 text-cyber-green px-2 py-1 rounded text-xs font-bold border border-cyber-green/50">Safe ({score})</span>;
    if (score < 70) return <span className="bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded text-xs font-bold border border-yellow-500/50">Suspicious ({score})</span>;
    return <span className="bg-cyber-red/20 text-cyber-red px-2 py-1 rounded text-xs font-bold border border-cyber-red/50">Dangerous ({score})</span>;
  };

  if (loading) return <div className="p-8 text-center text-cyber-blue">Loading Logs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#2b2b2b] pb-4">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Database className="text-cyber-blue" size={32} /> Incident Logs
        </h2>
        <span className="bg-[#1f1f1f] text-gray-300 px-3 py-1 rounded border border-[#2b2b2b] text-sm">
          Showing last 20 events
        </span>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1f1f1f] border-b border-[#2b2b2b]">
                <th className="p-4 text-xs tracking-wider text-gray-400 uppercase font-semibold">Timestamp</th>
                <th className="p-4 text-xs tracking-wider text-gray-400 uppercase font-semibold">Type</th>
                <th className="p-4 text-xs tracking-wider text-gray-400 uppercase font-semibold">Snippet</th>
                <th className="p-4 text-xs tracking-wider text-gray-400 uppercase font-semibold">Indicators</th>
                <th className="p-4 text-xs tracking-wider text-gray-400 uppercase font-semibold">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2b2b2b]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No scans recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#141414] transition-colors">
                    <td className="p-4 text-sm text-gray-300 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 text-sm font-medium text-white">
                      {log.threat_type}
                    </td>
                    <td className="p-4 text-sm text-gray-400 max-w-xs truncate" title={log.input_text}>
                      {log.input_text.substring(0, 50)}...
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      <div className="flex gap-1 flex-wrap">
                        {log.explanation && log.explanation.length > 0 ? (
                          log.explanation.slice(0, 2).map((ind, i) => (
                            <span key={i} className="bg-[#2b2b2b] text-xs px-2 py-0.5 rounded" title={ind}>{ind.split(' ')[0]}...</span>
                          ))
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {getRiskMarkup(log.risk_score)}
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
