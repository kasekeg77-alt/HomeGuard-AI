import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Lock, Unlock, ShieldAlert, CheckCircle, RefreshCw, Search, AlertTriangle, ArrowDown } from 'lucide-react';
import { NetworkLog, Severity } from '../types';
import { generateIntegrityHash, maskData } from '../utils/security';
import { useTraffic } from '../contexts/TrafficContext';

const LiveMonitor: React.FC = () => {
  const { logs, isRunning, setIsRunning } = useTraffic();
  const [isEncryptedView, setIsEncryptedView] = useState(true);
  const [selectedLog, setSelectedLog] = useState<NetworkLog | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'verifying' | 'valid' | 'invalid'>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inspectorRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom if near bottom
  useEffect(() => {
    if (scrollRef.current && isRunning && !selectedLog) {
       const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
       if (scrollHeight - scrollTop - clientHeight < 100) {
         scrollRef.current.scrollTop = scrollHeight;
       }
    }
  }, [logs, isRunning, selectedLog]);

  // Scroll to inspector on mobile when log selected
  useEffect(() => {
    if (selectedLog && window.innerWidth < 768 && inspectorRef.current) {
      inspectorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedLog]);

  // Handle Hash Verification (Integrity Check)
  const verifyIntegrity = async (log: NetworkLog) => {
    setVerifyStatus('verifying');
    // Simulate slight delay for calculation
    setTimeout(async () => {
      const recalculatedHash = await generateIntegrityHash(log.payload);
      if (recalculatedHash === log.hash) {
        setVerifyStatus('valid');
      } else {
        setVerifyStatus('invalid');
      }
    }, 800);
  };

  const clearSelection = () => {
    setSelectedLog(null);
    setVerifyStatus('idle');
  };

  return (
    <div className="h-[calc(100vh-6rem)] md:h-full flex flex-col gap-4 md:gap-6 pb-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Live Network Traffic</h1>
          <p className="text-sm md:text-base text-slate-400">Real-time packet inspection.</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsEncryptedView(!isEncryptedView)}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium text-xs md:text-sm transition-colors border ${
              isEncryptedView 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-red-500/10 text-red-400 border-red-500/30'
            }`}
          >
            {isEncryptedView ? <Lock size={14} /> : <Unlock size={14} />}
            <span className="whitespace-nowrap">{isEncryptedView ? 'Confidentiality: ON' : 'Confidentiality: OFF'}</span>
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-md font-medium text-xs md:text-sm transition-colors border ${
              isRunning 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20' 
                : 'bg-green-600 text-white border-green-600 hover:bg-green-500'
            }`}
          >
            {isRunning ? <><Pause size={14} /> <span className="whitespace-nowrap">Pause Stream</span></> : <><Play size={14} /> <span className="whitespace-nowrap">Resume Stream</span></>}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 min-h-0 overflow-hidden">
        {/* Log List */}
        <div className={`flex-1 bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col backdrop-blur-sm transition-all duration-300 ${selectedLog ? 'h-1/2 md:h-full' : 'h-full'}`}>
          <div className="bg-slate-900 border-b border-slate-800 p-3 flex justify-between items-center shrink-0">
             <span className="font-semibold text-slate-300 text-sm md:text-base">Packet Stream</span>
             <span className="text-[10px] md:text-xs text-slate-500 font-mono">buf: {logs.length}</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-700" ref={scrollRef}>
            {logs.length === 0 && (
              <div className="text-center py-20 text-slate-500 text-sm">Waiting for traffic...</div>
            )}
            {logs.map((log) => (
              <div
                key={log.id}
                onClick={() => { setSelectedLog(log); setVerifyStatus('idle'); }}
                className={`p-2 md:p-3 rounded-lg cursor-pointer border transition-all duration-200 text-xs md:text-sm font-mono group relative overflow-hidden ${
                  selectedLog?.id === log.id
                    ? 'bg-blue-600/20 border-blue-500/50 ring-1 ring-blue-500/30'
                    : log.severity === Severity.CRITICAL
                        ? 'bg-red-500/10 border-red-500/40 hover:bg-red-500/20 shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]'
                        : 'bg-slate-800/30 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
                }`}
              >
                {log.severity === Severity.CRITICAL && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                )}
                <div className="flex justify-between items-start mb-1 pl-2">
                  <span className="text-slate-400 text-[10px] md:text-xs">{log.timestamp.split('T')[1].split('.')[0]}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1 ${
                    log.severity === Severity.CRITICAL ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 
                    log.severity === Severity.HIGH ? 'bg-orange-500/20 text-orange-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {log.severity === Severity.CRITICAL && <AlertTriangle size={8} className="animate-pulse" />}
                    {log.severity}
                  </span>
                </div>
                <div className="flex gap-2 md:gap-4 pl-2 text-slate-300 items-center">
                  <span className="w-8 md:w-12 text-[10px] md:text-xs opacity-70">{log.protocol}</span>
                  <span className="flex-1 truncate text-xs md:text-sm">
                     {isEncryptedView ? maskData(log.payload) : log.payload}
                  </span>
                  <span className="hidden md:block text-slate-500 w-24 truncate text-right text-xs">{log.deviceType}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail/Inspector Panel */}
        <div 
          ref={inspectorRef}
          className={`md:w-96 bg-slate-900 border border-slate-800 rounded-xl flex flex-col gap-4 shadow-xl transition-all duration-300 ${
            selectedLog ? 'p-4 md:p-6 opacity-100 flex-1 md:flex-none' : 'h-0 md:h-auto p-0 md:p-6 overflow-hidden md:opacity-100'
          }`}
        >
          {selectedLog ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300 h-full flex flex-col">
              <h2 className="text-base md:text-lg font-semibold flex items-center gap-2 shrink-0">
                <Search size={18} className="text-blue-400"/> Packet Inspector
              </h2>

              <div className="space-y-1 shrink-0">
                <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Source IP</label>
                <div className="font-mono text-xs md:text-sm bg-slate-950 p-2 rounded border border-slate-800">{selectedLog.source}</div>
              </div>
              
              <div className="space-y-1 shrink-0">
                <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Payload (Data)</label>
                <div className="font-mono text-xs md:text-sm bg-slate-950 p-2 rounded border border-slate-800 break-all max-h-24 overflow-y-auto">
                  {isEncryptedView ? (
                    <span className="text-emerald-500 italic flex items-center gap-2">
                      <Lock size={12}/> {maskData(selectedLog.payload)}
                    </span>
                  ) : (
                     <span className={selectedLog.severity === Severity.CRITICAL ? 'text-red-400' : 'text-slate-300'}>
                       {selectedLog.payload}
                     </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  * Toggle 'Confidentiality' to reveal raw data.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-slate-800 shrink-0">
                <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider flex justify-between">
                  <span>Data Integrity Check</span>
                  <span className="text-slate-600">SHA-256</span>
                </label>
                <div className="font-mono text-[10px] bg-slate-950 p-2 rounded border border-slate-800 break-all text-slate-400">
                  {selectedLog.hash}
                </div>
                
                <div className="flex items-center gap-3 mt-2">
                  <button 
                    onClick={() => verifyIntegrity(selectedLog)}
                    disabled={verifyStatus === 'verifying'}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-white text-xs py-2 px-3 rounded flex items-center justify-center gap-2 transition-all"
                  >
                    {verifyStatus === 'verifying' ? <RefreshCw className="animate-spin" size={14} /> : <ShieldAlert size={14} />}
                    Verify Hash
                  </button>
                  
                  {verifyStatus === 'valid' && (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold animate-in zoom-in duration-200 whitespace-nowrap">
                      <CheckCircle size={14} /> Verified
                    </div>
                  )}
                   {verifyStatus === 'invalid' && (
                    <div className="flex items-center gap-1 text-red-400 text-xs font-bold animate-in zoom-in duration-200 whitespace-nowrap">
                      <ShieldAlert size={14} /> Tampered!
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-auto shrink-0">
                 <button onClick={clearSelection} className="text-xs text-slate-500 hover:text-white underline decoration-slate-600 underline-offset-4 flex items-center gap-1">
                   <ArrowDown size={12} className="rotate-180" /> Close Inspector
                 </button>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 flex-col items-center justify-center text-slate-600 text-center p-4 border-2 border-dashed border-slate-800 rounded-lg h-full">
              <Search size={32} className="mb-2 opacity-20" />
              <p className="text-sm">Select a packet from the stream to inspect.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveMonitor;