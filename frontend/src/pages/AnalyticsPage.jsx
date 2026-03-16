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

const API_BASE_URL = 'http://localhost:8000';

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
    <div className="space-y-8">
      <h2 className="text-3xl font-bold flex items-center gap-3">
        <Activity className="text-cyber-blue" size={32} /> Thread Analytics Dashboard
      </h2>
      
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyber-blue/10 rounded-bl-full"></div>
          <span className="text-gray-400 font-medium mb-1">Total Scans</span>
          <span className="text-4xl font-black text-white">{data.total_scans}</span>
        </div>
        
        <div className="glass-panel p-6 flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/10 rounded-bl-full"></div>
          <span className="text-gray-400 font-medium mb-1 flex items-center gap-2">
            <ShieldAlert size={16} /> Threats Detected
          </span>
          <span className="text-4xl font-black text-cyber-red">
            {data.detections.phishing + data.detections.url + data.detections.prompt}
          </span>
        </div>

        <div className="glass-panel p-6 flex flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-bl-full"></div>
          <span className="text-gray-400 font-medium mb-1 flex items-center gap-2">
            <Target size={16} /> Avg Risk Score
          </span>
          <span className={`text-4xl font-black ${data.average_risk_score > 60 ? 'text-cyber-red' : 'text-yellow-500'}`}>
            {data.average_risk_score}
          </span>
        </div>
        
        <div className="glass-panel p-6 flex flex-col justify-center items-center">
            <span className="text-gray-400 font-medium mb-1 flex items-center gap-2">
            <Info size={16} /> Status
            </span>
            <span className="text-2xl font-bold text-cyber-green mt-2">ACTIVE</span>
            <span className="text-xs text-gray-500 mt-1">Engine Online</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-6">
          <h3 className="text-xl font-bold mb-6 text-gray-200">Threat Distribution</h3>
          <div className="h-64 relative">
             <Doughnut data={doughnutData} options={{...chartOptions, scales:{}, maintainAspectRatio: false}} />
          </div>
        </div>
        
        <div className="glass-panel p-6">
          <h3 className="text-xl font-bold mb-6 text-gray-200">Processing Volume (7 Days)</h3>
          <div className="h-64">
              <Bar data={threatTrendsData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
