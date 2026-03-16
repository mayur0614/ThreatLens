import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Activity, ShieldAlert, Target, Info } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/analytics`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-cyber-blue">Loading Analytics Data...</div>;
  }

  if (!data) {
    return <div className="p-8 text-center text-red-500">Failed to load analytics data.</div>;
  }

  const doughnutData = {
    labels: ['Phishing Emails', 'Malicious URLs', 'Prompt Injections'],
    datasets: [
      {
        data: [data.detections.phishing, data.detections.url, data.detections.prompt],
        backgroundColor: [
          'rgba(0, 240, 255, 0.8)',
          'rgba(255, 0, 60, 0.8)',
          'rgba(255, 204, 0, 0.8)',
        ],
        borderColor: ['#000', '#000', '#000'],
        borderWidth: 2,
      },
    ],
  };

  const threatTrendsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Threats Detected',
        data: [12, 19, 3, 5, 2, 3, data.detections.phishing + data.detections.url + data.detections.prompt], // Mock historical data merged with current
        backgroundColor: 'rgba(0, 255, 65, 0.5)',
        borderColor: 'rgba(0, 255, 65, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#e5e7eb' }
      }
    },
    scales: {
      x: { ticks: { color: '#9ca3af' }, grid: { color: '#2b2b2b' } },
      y: { ticks: { color: '#9ca3af' }, grid: { color: '#2b2b2b' } },
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <h2 className="text-3xl font-black tracking-tight flex items-center gap-4">
          <div className="p-3 bg-cyber-purple/10 rounded-xl text-cyber-purple">
            <Activity size={28} />
          </div>
          Threat Analytics Dashboard
        </h2>
      </div>
      
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 flex flex-col justify-center items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-blue/10 rounded-bl-full group-hover:scale-110 transition-transform duration-500"></div>
          <span className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 relative z-10">Total Scans</span>
          <span className="text-5xl font-black text-white drop-shadow-md relative z-10">{data.total_scans}</span>
        </div>
        
        <div className="glass-panel p-6 flex flex-col justify-center items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-red/10 rounded-bl-full group-hover:scale-110 transition-transform duration-500"></div>
          <span className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 flex items-center gap-2 relative z-10">
            <ShieldAlert size={14} className="text-cyber-red" /> Threats Detected
          </span>
          <span className="text-5xl font-black text-cyber-red drop-shadow-[0_0_10px_rgba(255,0,84,0.3)] relative z-10">
            {data.detections.phishing + data.detections.url + data.detections.prompt}
          </span>
        </div>

        <div className="glass-panel p-6 flex flex-col justify-center items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-bl-full group-hover:scale-110 transition-transform duration-500"></div>
          <span className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 flex items-center gap-2 relative z-10">
            <Target size={14} className="text-yellow-500" /> Avg Risk Score
          </span>
          <span className={`text-5xl font-black relative z-10 ${data.average_risk_score > 60 ? 'text-cyber-red drop-shadow-[0_0_10px_rgba(255,0,84,0.3)]' : 'text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]'}`}>
            {data.average_risk_score}
          </span>
        </div>
        
        <div className="glass-panel p-6 flex flex-col justify-center items-center border border-cyber-green/20 bg-cyber-green/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-cyber-green/10 blur-xl"></div>
            <span className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 flex items-center gap-2 relative z-10">
              <Info size={14} /> Status
            </span>
            <span className="text-3xl font-black text-cyber-green mt-1 drop-shadow-md relative z-10">ACTIVE</span>
            <span className="text-xs tracking-wide text-cyber-green/70 mt-2 font-mono flex items-center gap-2 relative z-10">
              <div className="w-1.5 h-1.5 bg-cyber-green rounded-full animate-pulse-glow"></div>
              Engine Online
            </span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8">
          <h3 className="text-lg font-bold tracking-wide mb-8 text-gray-200 border-b border-white/5 pb-4">Threat Distribution</h3>
          <div className="h-64 relative">
             <Doughnut data={doughnutData} options={{...chartOptions, scales:{}, maintainAspectRatio: false}} />
          </div>
        </div>
        
        <div className="glass-panel p-8">
          <h3 className="text-lg font-bold tracking-wide mb-8 text-gray-200 border-b border-white/5 pb-4">Processing Volume (7 Days)</h3>
          <div className="h-64">
              <Bar data={threatTrendsData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
