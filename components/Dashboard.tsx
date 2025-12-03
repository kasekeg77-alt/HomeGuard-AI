import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Wifi, Shield, AlertTriangle, Server } from 'lucide-react';
import { getDevices } from '../services/mockData';
import { useTraffic } from '../contexts/TrafficContext';
import { Severity } from '../types';

const data = [
  { name: '00:00', packets: 400, threats: 2 },
  { name: '04:00', packets: 300, threats: 1 },
  { name: '08:00', packets: 200, threats: 5 },
  { name: '12:00', packets: 278, threats: 8 },
  { name: '16:00', packets: 189, threats: 12 },
  { name: '20:00', packets: 239, threats: 6 },
  { name: '23:59', packets: 349, threats: 3 },
];

const Dashboard: React.FC = () => {
  const devices = getDevices();
  const { logs } = useTraffic();
  
  // Calculate real-time stats from the last 100 logs
  const activeThreats = logs.filter(l => l.severity === Severity.CRITICAL).length;
  const trafficVolume = logs.length > 0 ? (logs.length * 2.1).toFixed(1) : '0.0'; // Mock bandwidth calc

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Security Dashboard</h1>
          <p className="text-sm md:text-base text-slate-400">System Overview and Availability Status</p>
        </div>
        <div className="text-left sm:text-right bg-slate-900/50 p-2 rounded-lg sm:bg-transparent sm:p-0">
           <div className="text-xs md:text-sm text-slate-400">System Uptime</div>
           <div className="text-lg md:text-xl font-mono text-emerald-400">14d 03h 12m</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 md:p-5 rounded-xl backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Shield size={40} className="text-blue-500" /></div>
          <div className="text-slate-400 text-xs md:text-sm font-medium">IDS Status</div>
          <div className="text-xl md:text-2xl font-bold text-white mt-1">Active</div>
          <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Protecting
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 md:p-5 rounded-xl backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Wifi size={40} className="text-purple-500" /></div>
          <div className="text-slate-400 text-xs md:text-sm font-medium">Connected Devices</div>
          <div className="text-xl md:text-2xl font-bold text-white mt-1">{devices.length}</div>
          <div className="text-xs text-slate-500 mt-2">3 Wireless, 2 Wired</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 md:p-5 rounded-xl backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={40} className="text-amber-500" /></div>
          <div className="text-slate-400 text-xs md:text-sm font-medium">Recent Traffic</div>
          <div className="text-xl md:text-2xl font-bold text-white mt-1">{trafficVolume} KB/s</div>
          <div className="text-xs text-amber-400 mt-2">Live Monitor Active</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 md:p-5 rounded-xl backdrop-blur-sm relative overflow-hidden group">
          <div className={`absolute inset-0 transition-colors ${activeThreats > 0 ? 'bg-red-500/10' : 'bg-transparent'}`}></div>
          <div className="absolute top-0 right-0 p-4 opacity-10"><AlertTriangle size={40} className="text-red-500" /></div>
          <div className="text-slate-400 text-xs md:text-sm font-medium">Detected Threats</div>
          <div className={`text-xl md:text-2xl font-bold mt-1 transition-all ${activeThreats > 0 ? 'text-red-500 scale-110 origin-left' : 'text-slate-100'}`}>
            {activeThreats}
          </div>
          <div className="text-xs text-red-400 mt-2">In last 100 packets</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-xl shadow-lg">
          <h3 className="text-base md:text-lg font-semibold text-white mb-4 md:mb-6">Network Traffic Analysis</h3>
          <div className="h-[200px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPackets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc', fontSize: '12px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="packets" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorPackets)" />
                <Area type="monotone" dataKey="threats" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorThreats)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Status List (Availability) */}
        <div className="bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-xl shadow-lg flex flex-col max-h-[400px] lg:max-h-auto">
          <h3 className="text-base md:text-lg font-semibold text-white mb-4 flex items-center justify-between">
            <span>Device Availability</span>
            <Server size={16} className="text-slate-500" />
          </h3>
          <div className="flex-1 overflow-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
            {devices.map(device => (
              <div key={device.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-950/50 border border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${device.status === 'ONLINE' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`}></div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-200 truncate">{device.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{device.ip}</div>
                  </div>
                </div>
                <div className={`text-[10px] md:text-xs px-2 py-1 rounded font-medium shrink-0 ${
                   device.status === 'ONLINE' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-400'
                }`}>
                  {device.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;