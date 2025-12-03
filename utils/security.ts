// Simulating Cryptographic functions

// Integrity: Generate SHA-256 hash of the payload
export const generateIntegrityHash = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// Confidentiality: Simple substitution cipher simulation for visual demonstration
// Real apps would use AES, but we want to show "scrambled" text in UI easily.
export const encryptPayload = (text: string): string => {
  return btoa(text).split('').reverse().join('');
};

export const decryptPayload = (cipher: string): string => {
  try {
    return atob(cipher.split('').reverse().join(''));
  } catch (e) {
    return '*** DECRYPTION ERROR ***';
  }
};

// Masking for UI (Confidentiality view)
export const maskData = (text: string): string => {
  return '•'.repeat(Math.min(text.length, 20)) + ' [ENCRYPTED]';
};
