import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { NetworkLog, Severity } from '../types';
import { generateRandomLog } from '../services/mockData';
import { playAlertSound } from '../utils/sound';

interface TrafficContextType {
  logs: NetworkLog[];
  recentAlert: NetworkLog | null;
  isRunning: boolean;
  setIsRunning: (run: boolean) => void;
  clearAlert: () => void;
}

const TrafficContext = createContext<TrafficContextType | undefined>(undefined);

export const TrafficProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<NetworkLog[]>([]);
  const [isRunning, setIsRunning] = useState(true);
  const [recentAlert, setRecentAlert] = useState<NetworkLog | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isRunning) {
      interval = setInterval(async () => {
        const newLog = await generateRandomLog();
        setLogs(prev => [newLog, ...prev].slice(0, 100)); // Keep buffer of 100
        
        // Trigger Global Alert for Critical threats
        if (newLog.severity === Severity.CRITICAL) {
          setRecentAlert(newLog);
          playAlertSound();
          
          // Auto-dismiss notification after 6 seconds
          setTimeout(() => {
            setRecentAlert(prev => (prev?.id === newLog.id ? null : prev));
          }, 6000);
        }
      }, 2000); 
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const clearAlert = () => setRecentAlert(null);

  return (
    <TrafficContext.Provider value={{ logs, recentAlert, isRunning, setIsRunning, clearAlert }}>
      {children}
    </TrafficContext.Provider>
  );
};

export const useTraffic = () => {
  const context = useContext(TrafficContext);
  if (context === undefined) {
    throw new Error('useTraffic must be used within a TrafficProvider');
  }
  return context;
};