import React from 'react';
import { useStore } from '../store/accountingStore';
import { bankTransactions, transformBankTransaction } from '../utils/transactionImport';

export function TransactionImport() {
  const { addTransactions } = useStore();

  const handleImport = () => {
    const transformedTransactions = bankTransactions.map(transformBankTransaction);
    addTransactions(transformedTransactions);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      <h2 className="text-xl font-semibold mb-4">Import Bank Transactions</h2>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Import sample bank statement transactions to populate the system.
        </p>
        <button
          onClick={handleImport}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Import Sample Transactions
        </button>
      </div>
    </div>
  );
}