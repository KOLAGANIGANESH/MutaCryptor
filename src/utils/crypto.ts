import { EncryptionResult, DecryptionResult } from '../types/crypto';

// Generate a random salt for key derivation
export const generateSalt = (): Uint8Array => {
  return crypto.getRandomValues(new Uint8Array(16));
};

// Generate a random IV for encryption
export const generateIV = (): Uint8Array => {
  return crypto.getRandomValues(new Uint8Array(12));
};

// Derive an encryption key from a password
export const deriveKey = async (
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
};

// Encrypt data using AES-GCM
export const encryptData = async (
  data: ArrayBuffer,
  password: string
): Promise<EncryptionResult> => {
  const salt = generateSalt();
  const iv = generateIV();
  const key = await deriveKey(password, salt);

  const encryptedData = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    data
  );

  return {
    encryptedData,
    iv,
    salt,
  };
};

// Decrypt data using AES-GCM
export const decryptData = async (
  encryptedData: ArrayBuffer,
  password: string,
  salt: Uint8Array,
  iv: Uint8Array
): Promise<DecryptionResult> => {
  const key = await deriveKey(password, salt);

  const decryptedData = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv,
    },
    key,
    encryptedData
  );

  return { decryptedData };
};