import { EncryptionResult, DecryptionResult } from '../types/crypto';

self.onmessage = async (e: MessageEvent) => {
  const { type, data, password, salt, iv } = e.data;

  try {
    if (type === 'encrypt') {
      const result = await encryptData(data, password);
      self.postMessage({ type: 'complete', result });
    } else if (type === 'decrypt') {
      const result = await decryptData(data, password, salt, iv);
      self.postMessage({ type: 'complete', result });
    }
  } catch (error) {
    self.postMessage({ type: 'error', error: error.message });
  }
};