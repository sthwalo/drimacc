import React, { useState } from 'react';
import { useTransactionStore } from '../../store/transactionStore'; // Use transaction store
import { useStore } from '../../store/accountingStore';  // Assuming accounts are stored in this store

export function Reconciliation() {
  // Retrieve transactions and accounts from respective stores
  const transactions = useTransactionStore((state) => state.transactions);
  const accounts = useStore((state) => state.accounts);
  const updateTransaction = useTransactionStore((state) => state.updateTransaction); // Update transaction from transaction store

  // Local state for tracking reconciliation notes
  const [notes, setNotes] = useState<{ [key: string]: string }>({});

  // Filter unreconciled transactions
  const unreconciledTransactions = transactions.filter((transaction) => !transaction.reconciled);

  // Handle reconciliation of a transaction
  const handleReconcile = (id: string) => {
    updateTransaction(id, { reconciled: true, reconciliationNote: notes[id] || '' });
    setNotes((prev) => ({ ...prev, [id]: '' })); // Clear the note after reconciliation
  };

  // Update notes for a transaction
  const handleNoteChange = (id: string, note: string) => {
    setNotes((prev) => ({ ...prev, [id]: note }));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Reconciliation</h2>
      
      {unreconciledTransactions.length === 0 ? (
        <p className="text-gray-500">All transactions are reconciled!</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b px-4 py-2 text-left">Date</th>
              <th className="border-b px-4 py-2 text-left">Description</th>
              <th className="border-b px-4 py-2 text-left">Account</th>
              <th className="border-b px-4 py-2 text-right">Amount</th>
              <th className="border-b px-4 py-2 text-left">Note</th>
              <th className="border-b px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {unreconciledTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="border-b px-4 py-2">{transaction.date}</td>
                <td className="border-b px-4 py-2">{transaction.description}</td>
                <td className="border-b px-4 py-2">{accounts.find(account => account.id === transaction.account)?.name || 'N/A'}</td>
                <td className="border-b px-4 py-2 text-right">{transaction.amount.toFixed(2)}</td>
                <td className="border-b px-4 py-2">
                  <input
                    type="text"
                    value={notes[transaction.id] || ''}
                    onChange={(e) => handleNoteChange(transaction.id, e.target.value)}
                    placeholder="Add note"
                    className="w-full border px-2 py-1 rounded"
                  />
                </td>
                <td className="border-b px-4 py-2 text-center">
                  <button
                    onClick={() => handleReconcile(transaction.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Reconcile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}