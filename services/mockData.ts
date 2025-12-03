import { NetworkLog, Severity, Device } from '../types';
import { generateIntegrityHash, encryptPayload } from '../utils/security';

const DEVICES: Device[] = [
  { id: 'dev_01', name: 'Front Door Camera', ip: '192.168.1.101', status: 'ONLINE', type: 'CAMERA', lastSeen: 'Now' },
  { id: 'dev_02', name: 'Living Room Thermostat', ip: '192.168.1.102', status: 'ONLINE', type: 'THERMOSTAT', lastSeen: 'Now' },
  { id: 'dev_03', name: 'Smart Lock Main', ip: '192.168.1.103', status: 'ONLINE', type: 'LOCK', lastSeen: 'Now' },
  { id: 'dev_04', name: 'Kitchen Lights', ip: '192.168.1.104', status: 'ONLINE', type: 'LIGHT', lastSeen: 'Now' },
  { id: 'dev_05', name: 'Smart Speaker', ip: '192.168.1.105', status: 'OFFLINE', type: 'SPEAKER', lastSeen: '5m ago' },
];

const BENIGN_PAYLOADS = [
  "temp=22.5C", "status=locked", "brightness=80%", "stream_packet_seq=1234", "ping", "ack", "heartbeat"
];

const MALICIOUS_PAYLOADS = [
  "admin:admin", "DROP TABLE users;", "/etc/passwd", "overflow_buffer_A*9999", "exec('/bin/sh')", "download_malware.sh"
];

const PROTOCOLS = ['TCP', 'UDP', 'HTTP', 'MQTT', 'COAP'] as const;

export const getDevices = () => DEVICES;

export const generateRandomLog = async (): Promise<NetworkLog> => {
  const isAttack = Math.random() > 0.9; // 10% chance of attack traffic
  const device = DEVICES[Math.floor(Math.random() * DEVICES.length)];
  
  const payloadRaw = isAttack 
    ? MALICIOUS_PAYLOADS[Math.floor(Math.random() * MALICIOUS_PAYLOADS.length)]
    : BENIGN_PAYLOADS[Math.floor(Math.random() * BENIGN_PAYLOADS.length)];

  // Random salt to make hash unique even for same payload
  const uniquePayload = `${payloadRaw} [ts:${Date.now()}]`;
  const integrityHash = await generateIntegrityHash(uniquePayload);
  const encrypted = encryptPayload(uniquePayload);

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    source: isAttack ? `192.168.1.${Math.floor(Math.random() * 200) + 50}` : device.ip,
    destination: '192.168.1.1 (Gateway)',
    protocol: PROTOCOLS[Math.floor(Math.random() * PROTOCOLS.length)],
    payload: uniquePayload,
    encryptedPayload: encrypted,
    hash: integrityHash,
    severity: isAttack ? Severity.CRITICAL : Severity.LOW,
    deviceType: device.type
  };
};
