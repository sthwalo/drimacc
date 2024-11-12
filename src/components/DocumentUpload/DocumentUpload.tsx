import React, { useState, useRef } from 'react';
import { useStore } from '../../store/accountingStore';
import { v4 as uuidv4 } from 'uuid';

export function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { addTransaction, selectedCurrency, logAuditEntry } = useStore();

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      logAuditEntry('FILE_SELECTED', `Selected file: ${e.target.files[0].name}`);
    }
  };

  // Handle pasted bank statement data
  const handlePaste = async (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    try {
      parsePastedText(pastedText);
      if (textAreaRef.current) textAreaRef.current.value = '';
    } catch (error) {
      console.error('Error processing pasted data:', error);
      logAuditEntry('ERROR', 'Error processing pasted data');
      alert('Error processing pasted data. Please check the format.');
    }
  };

  // Parse pasted text and add transactions
  const parsePastedText = (text: string) => {
    const lines = text.split('\n').filter(line => line.trim());
    lines.forEach(line => {
      const { date, description, amount, type } = extractTransactionDetails(line);
      if (description && amount) {
        const transaction = createTransaction(date, description, parseFloat(amount), type);
        addTransaction(transaction);
        logAuditEntry('PASTE_TRANSACTION', `Added transaction from paste: ${description}`);
      }
    });
  };

  // Extract transaction details from a line of text
  const extractTransactionDetails = (line: string) => {
        // Example regular expressions; adjust according to actual expected formats
        const dateRegex = /\d{2}-\d{2}-\d{4}/; // Adjust this regex based on the date format in your data
        const amountRegex = /\d+,\d+\.\d+|\d+\.\d+/; // Regex to match amounts, possibly including commas and decimals
      
        const dateMatch = line.match(dateRegex);
        const amountMatch = line.match(amountRegex);
      
        const date = dateMatch ? dateMatch[0] : '';
        const description = (dateMatch && amountMatch) ? line.slice(line.indexOf(dateMatch[0]) + dateMatch[0].length, line.indexOf(amountMatch[0])).trim() : '';
        const amount = amountMatch ? amountMatch[0].replace(',', '').replace('Cr', '') : '';
        const type = line.includes('Cr') ? 'credit' as "credit" | "debit" : 'debit' as "credit" | "debit";
      

    return { date, description, amount, type };
  };

  // Create a transaction object
  const createTransaction = (date: string, description: string, amount: number, type: "debit" | "credit") => ({
    id: uuidv4(),
    date: `2024-03-${date.slice(0, 2)}`,
    description,
    amount,
    currency: selectedCurrency,
    type,
    account: type === 'credit' ? 'Income' : 'Expenses',
    balance: 0,
    reconciled: false,
    created: new Date(),
    modified: new Date()
  });

  // Process selected document
  const processDocument = async () => {
    if (!file) return;

    setProcessing(true);
    try {
      const mockTransaction = createTransaction(
        new Date().toISOString().split('T')[0],
        `Processed from ${file.name}`,
        Math.random() * 1000,
        Math.random() > 0.5 ? 'debit' : 'credit'
      );
      addTransaction(mockTransaction);
      logAuditEntry('PROCESS_DOCUMENT', `Processed document: ${file.name}`);
      setFile(null);
    } catch (error) {
      console.error('Error processing document:', error);
      logAuditEntry('ERROR', `Error processing document: ${file.name}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Document Upload</h2>
      <div className="space-y-4">
        {/* Batch Processing Mode Checkbox */}
        <div className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            id="batchMode"
            checked={batchMode}
            onChange={(e) => setBatchMode(e.target.checked)}
            className="rounded text-primary-600"
          />
          <label htmlFor="batchMode" className="text-sm text-gray-700">
            Batch Processing Mode
          </label>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Upload Document
          </label>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx"
            multiple={batchMode}
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-primary-50 file:text-primary-700
              hover:file:bg-primary-100"
          />
        </div>

        {/* Text Area for Pasting Bank Statement Data */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Paste Bank Statement Data
          </label>
          <textarea
            ref={textAreaRef}
            onPaste={handlePaste}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
              focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
              h-32 font-mono"
            placeholder="Paste your bank statement data here..."
          />
        </div>

        {/* Process Document Button */}
        {file && (
          <button
            onClick={processDocument}
            disabled={processing}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${processing 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-primary-600 hover:bg-primary-700'}`}
          >
            {processing ? 'Processing...' : `Process ${batchMode ? 'Documents' : 'Document'}`}
          </button>
        )}
      </div>
    </div>
  );
}