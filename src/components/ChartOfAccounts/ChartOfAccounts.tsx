import React from 'react';
import { useStore } from '../../store';

// Component to display the Chart of Accounts
export function ChartOfAccounts() {
  // Fetch transactions from the store
  const { transactions } = useStore();

  // Check if there are any transactions; if none, show a message
  if (!transactions || transactions.length === 0) {
    return <p>No transactions available.</p>;
  }

  // Calculate account balances by iterating over all transactions
  const accountBalances = transactions.reduce((acc, transaction) => {
    // Initialize account entry if it doesn't exist in the accumulator
    if (!acc[transaction.account]) {
      acc[transaction.account] = { debit: 0, credit: 0 };
    }

    // Update debit or credit based on transaction type
    if (transaction.type === 'debit') {
      acc[transaction.account].debit += transaction.amount;
    } else {
      acc[transaction.account].credit += transaction.amount;
    }

    return acc; // Return the updated accumulator
  }, {} as Record<string, { debit: number; credit: number }>);

  // Function to format numbers as currency
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-xl font-semibold mb-4">Chart of Accounts</h2>
      <div className="overflow-x-auto">
        {/* Table to display account balances */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Debit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Map over accountBalances to render each account's debit, credit, and balance */}
            {Object.entries(accountBalances).map(([account, { debit, credit }]) => (
              <tr key={account}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{account}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(debit)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(credit)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(debit - credit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}