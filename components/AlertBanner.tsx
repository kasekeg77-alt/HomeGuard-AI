import React from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { useTraffic } from '../contexts/TrafficContext';

const AlertBanner: React.FC = () => {
  const { recentAlert, clearAlert } = useTraffic();

  if (!recentAlert) return null;

  return (
    <div className="fixed top-4 left-0 right-0 md:left-auto md:right-4 z-50 px-4 md:px-0 flex justify-center md:justify-end pointer-events-none">
      <div className="w-full max-w-sm md:w-96 animate-in slide-in-from-top-2 md:slide-in-from-right-full duration-300 pointer-events-auto">
        <div className="bg-red-950/90 border border-red-500 text-red-100 rounded-lg shadow-2xl backdrop-blur-md overflow-hidden relative">
          {/* Animated background pulse */}
          <div className="absolute inset-0 bg-red-500/10 animate-pulse pointer-events-none" />
          
          <div className="p-4 flex items-start gap-4 relative z-10">
            <div className="bg-red-500/20 p-2 rounded-full shrink-0">
              <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-red-400 text-sm uppercase tracking-wider flex items-center justify-between">
                Intrusion Detected
                <span className="text-[10px] opacity-70 ml-2 whitespace-nowrap">
                  {new Date(recentAlert.timestamp).toLocaleTimeString()}
                </span>
              </h3>
              <p className="text-xs text-red-200 mt-1 font-mono break-all line-clamp-2">
                Payload: {recentAlert.payload}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                 <span className="text-[10px] bg-red-900 border border-red-700 px-2 py-0.5 rounded text-red-300 whitespace-nowrap">
                   SRC: {recentAlert.source}
                 </span>
                 <span className="text-[10px] bg-red-900 border border-red-700 px-2 py-0.5 rounded text-red-300 whitespace-nowrap">
                   {recentAlert.protocol}
                 </span>
              </div>
            </div>

            <button 
              onClick={clearAlert}
              className="text-red-400 hover:text-white transition-colors p-1 -mt-1 -mr-1"
            >
              <X size={16} />
            </button>
          </div>
          
          {/* Progress bar for auto-dismiss */}
          <div className="h-1 w-full bg-red-900">
             <div className="h-full bg-red-500 animate-[width_6s_linear_forwards]" style={{width: '100%'}} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;