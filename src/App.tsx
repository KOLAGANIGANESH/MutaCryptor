import React, { useState } from 'react';
import { Shield, Download, Lock } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { ProgressBar } from './components/ProgressBar';
import { useCrypto } from './hooks/useCrypto';

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [encryptedFile, setEncryptedFile] = useState<Blob | null>(null);
  const { encryptFile, decryptFile, isProcessing, progress } = useCrypto();

  const handleEncrypt = async () => {
    if (!selectedFile || !password) return;

    try {
      const result = await encryptFile(selectedFile, password);
      const blob = new Blob([result.encryptedData], { type: 'application/octet-stream' });
      setEncryptedFile(blob);
    } catch (error) {
      console.error('Encryption failed:', error);
    }
  };

  const handleDownload = () => {
    if (!encryptedFile) return;

    const url = URL.createObjectURL(encryptedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = `encrypted-${selectedFile?.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Secure File Encryption
          </h1>
          <p className="text-lg text-gray-600">
            Encrypt your files with military-grade encryption using AES-GCM
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <FileUpload onFileSelect={setSelectedFile} />
          
          {selectedFile && (
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-2">Selected file:</p>
              <div className="flex items-center gap-2 text-gray-700">
                <Lock className="w-4 h-4" />
                <span>{selectedFile.name}</span>
              </div>
            </div>
          )}

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Encryption Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter a strong password"
            />
          </div>

          {isProcessing && (
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-2">Processing...</p>
              <ProgressBar progress={progress} />
            </div>
          )}

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleEncrypt}
              disabled={!selectedFile || !password || isProcessing}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Encrypt File
            </button>

            {encryptedFile && (
              <button
                onClick={handleDownload}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Encrypted File
              </button>
            )}
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Your files are encrypted locally in your browser.</p>
          <p>No data is ever sent to our servers.</p>
        </div>
      </div>
    </div>
  );
}

export default App;