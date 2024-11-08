import React from 'react';
import { Transaction } from '../../types';
import { calculateTrialBalance } from '../../utils/financialCalculations';

interface Props {
  transactions: Transaction[];
}

export function TrialBalance({ transactions }: Props) {
  const trialBalance = calculateTrialBalance(transactions);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Trial Balance</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Debit</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(trialBalance.accounts).map(([account, balance]) => (
              <tr key={account}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {account}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {balance.debit > 0 ? `ZAR ${balance.debit.toFixed(2)}` : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                  {balance.credit > 0 ? `ZAR ${balance.credit.toFixed(2)}` : '-'}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Totals</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                ZAR {trialBalance.totals.debit.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                ZAR {trialBalance.totals.credit.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}