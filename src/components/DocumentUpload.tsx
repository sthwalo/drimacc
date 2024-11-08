import React, { useState } from 'react';
import { useStore } from '../store/accountingStore';
import { v4 as uuidv4 } from 'uuid';

export function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const { addTransaction, selectedCurrency } = useStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const processDocument = async () => {
    if (!file) return;

    setProcessing(true);
    try {
      // Simulating document processing with OCR and AI analysis
      // In a real implementation, this would use Tesseract.js and TensorFlow.js
      const mockTransaction = {
        id: uuidv4(),
        date: new Date().toISOString().split('T')[0],
        description: `Processed from ${file.name}`,
        amount: Math.random() * 1000,
        currency: selectedCurrency,
        type: Math.random() > 0.5 ? 'debit' : 'credit',
        account: 'Accounts Receivable',
      };

      addTransaction(mockTransaction);
      setFile(null);
    } catch (error) {
      console.error('Error processing document:', error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Document Upload</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Document
          </label>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary-50 file:text-primary-700
              hover:file:bg-primary-100"
          />
        </div>
        <button
          onClick={processDocument}
          disabled={!file || processing}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${!file || processing 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-primary-600 hover:bg-primary-700'}`}
        >
          {processing ? 'Processing...' : 'Process Document'}
        </button>
      </div>
    </div>
  );
}