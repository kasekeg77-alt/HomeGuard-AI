export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface NetworkLog {
  id: string;
  timestamp: string;
  source: string;
  destination: string;
  protocol: 'TCP' | 'UDP' | 'HTTP' | 'MQTT' | 'COAP';
  payload: string; // The data being transferred
  encryptedPayload: string; // Simulated encrypted version
  hash: string; // Integrity check hash
  severity: Severity;
  deviceType: string;
}

export interface Device {
  id: string;
  name: string;
  ip: string;
  status: 'ONLINE' | 'OFFLINE' | 'COMPROMISED';
  type: 'CAMERA' | 'THERMOSTAT' | 'LOCK' | 'LIGHT' | 'SPEAKER';
  lastSeen: string;
}

export interface AnalysisReport {
  timestamp: string;
  threatLevel: string;
  summary: string;
  recommendations: string[];
  rawAnalysis: string;
}
