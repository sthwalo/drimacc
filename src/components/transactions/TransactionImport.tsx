import React, { useState } from 'react';
import { useStore } from '../../store/accountingStore';
import { processDocument } from '../../utils/documentProcessor';

export function TransactionImport() {
  const { addTransactions, clearTransactions } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setError(null);
      clearTransactions();

      const transactions = await processDocument(file);
      addTransactions(transactions);
      
      // Update last saved timestamp
      const now = new Date();
      setLastSaved(now);
      localStorage.setItem('lastSaved', now.toISOString());

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process document');
    } finally {
      setIsProcessing(false);
    }
  };

  // Load last saved timestamp on component mount
  React.useEffect(() => {
    const savedTimestamp = localStorage.getItem('lastSaved');
    if (savedTimestamp) {
      setLastSaved(new Date(savedTimestamp));
    }
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Import Bank Statement</h2>
      <div className="space-y-4">
        <input
          type="file"
          accept=".png,.jpg,.jpeg,.pdf,.txt,.csv"
          onChange={handleFileUpload}
          disabled={isProcessing}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-primary-50 file:text-primary-700
            hover:file:bg-primary-100
            disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <p className="text-sm text-gray-600">
          Supported formats: PNG, JPG, PDF, TXT, CSV
        </p>
        {isProcessing && (
          <div className="text-sm text-primary-600">
            Processing document... Please wait.
          </div>
        )}
        {error && (
          <div className="text-sm text-red-600">
            {error}
          </div>
        )}
        {lastSaved && (
          <div className="text-sm text-gray-600">
            Last saved: {lastSaved.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}