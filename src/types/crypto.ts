export interface EncryptionResult {
  encryptedData: ArrayBuffer;
  iv: Uint8Array;
  salt: Uint8Array;
}

export interface DecryptionResult {
  decryptedData: ArrayBuffer;
}

export interface ProgressUpdate {
  type: 'encrypt' | 'decrypt';
  progress: number;
  total: number;
}