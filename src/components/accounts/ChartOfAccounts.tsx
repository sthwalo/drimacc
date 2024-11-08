import React from 'react';
import { useStore } from '../../store/accountingStore';

export function ChartOfAccounts() {
  const { transactions } = useStore();

  const accountTotals = transactions.reduce((acc, transaction) => {
    const { account, amount, type, currency } = transaction;
    if (!acc[account]) {
      acc[account] = { debit: 0, credit: 0, currency };
    }
    if (type === 'debit') {
      acc[account].debit += amount;
    } else {
      acc[account].credit += amount;
    }
    return acc;
  }, {} as Record<string, { debit: number; credit: number; currency: string }>);

  if (Object.keys(accountTotals).length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Chart of Accounts</h2>
        <p className="text-gray-500">No accounts to display yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Chart of Accounts</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(accountTotals).map(([account, { debit, credit, currency }]) => (
              <tr key={account}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {account}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {currency} {debit.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {currency} {credit.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {currency} {(debit - credit).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}