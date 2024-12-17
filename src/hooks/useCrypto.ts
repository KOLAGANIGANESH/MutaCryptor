import { useState, useCallback } from 'react';
import { EncryptionResult, DecryptionResult } from '../types/crypto';

export const useCrypto = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const encryptFile = useCallback(async (file: File, password: string): Promise<EncryptionResult> => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const worker = new Worker(new URL('../workers/crypto.worker.ts', import.meta.url));
      const arrayBuffer = await file.arrayBuffer();

      return new Promise((resolve, reject) => {
        worker.onmessage = (e) => {
          if (e.data.type === 'progress') {
            setProgress(e.data.progress);
          } else if (e.data.type === 'complete') {
            setIsProcessing(false);
            worker.terminate();
            resolve(e.data.result);
          } else if (e.data.type === 'error') {
            setIsProcessing(false);
            worker.terminate();
            reject(new Error(e.data.error));
          }
        };

        worker.postMessage({
          type: 'encrypt',
          data: arrayBuffer,
          password,
        });
      });
    } catch (error) {
      setIsProcessing(false);
      throw error;
    }
  }, []);

  const decryptFile = useCallback(async (
    encryptedData: ArrayBuffer,
    password: string,
    salt: Uint8Array,
    iv: Uint8Array
  ): Promise<DecryptionResult> => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const worker = new Worker(new URL('../workers/crypto.worker.ts', import.meta.url));

      return new Promise((resolve, reject) => {
        worker.onmessage = (e) => {
          if (e.data.type === 'progress') {
            setProgress(e.data.progress);
          } else if (e.data.type === 'complete') {
            setIsProcessing(false);
            worker.terminate();
            resolve(e.data.result);
          } else if (e.data.type === 'error') {
            setIsProcessing(false);
            worker.terminate();
            reject(new Error(e.data.error));
          }
        };

        worker.postMessage({
          type: 'decrypt',
          data: encryptedData,
          password,
          salt,
          iv,
        });
      });
    } catch (error) {
      setIsProcessing(false);
      throw error;
    }
  }, []);

  return {
    encryptFile,
    decryptFile,
    isProcessing,
    progress,
  };
};