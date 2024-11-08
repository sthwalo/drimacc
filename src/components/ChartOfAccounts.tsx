import React from 'react';
import { useStore } from '../store/accountingStore';

export function ChartOfAccounts() {
  const { transactions } = useStore();

  const accountTotals = transactions.reduce((acc, transaction) => {
    const { account, amount, type, currency, bankCharges } = transaction;
    if (!acc[account]) {
      acc[account] = { debit: 0, credit: 0, bankCharges: 0, currency };
    }
    if (type === 'debit') {
      acc[account].debit += amount;
    } else {
      acc[account].credit += amount;
    }
    if (bankCharges) {
      acc[account].bankCharges += bankCharges;
    }
    return acc;
  }, {} as Record<string, { debit: number; credit: number; bankCharges: number; currency: string }>);

  if (Object.keys(accountTotals).length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Chart of Accounts</h2>
        <p className="text-gray-500">No accounts to display yet.</p>
      </div>
    );
  }

  const totalBankCharges = Object.values(accountTotals).reduce(
    (sum, { bankCharges }) => sum + bankCharges,
    0
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Chart of Accounts</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Charges</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Net Balance</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(accountTotals).map(([account, { debit, credit, bankCharges, currency }]) => (
              <tr key={account}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {account}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {currency} {debit.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {currency} {credit.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {currency} {bankCharges.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {currency} {(debit - credit - bankCharges).toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Total Bank Charges
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">-</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">-</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                ZAR {totalBankCharges.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}