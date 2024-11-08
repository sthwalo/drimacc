import React from 'react';
import { Transaction } from '../../types';
import { calculateBalanceSheet } from '../../utils/financialCalculations';

interface Props {
  transactions: Transaction[];
}

export function BalanceSheet({ transactions }: Props) {
  const balanceSheet = calculateBalanceSheet(transactions);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Balance Sheet</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Assets</h3>
          {Object.entries(balanceSheet.assets).map(([name, amount]) => (
            <div key={name} className="flex justify-between text-sm">
              <span>{name}</span>
              <span>ZAR {amount.toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-1 pt-1 border-t font-medium">
            <div className="flex justify-between">
              <span>Total Assets</span>
              <span>ZAR {balanceSheet.totals.assets.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Liabilities</h3>
          {Object.entries(balanceSheet.liabilities).map(([name, amount]) => (
            <div key={name} className="flex justify-between text-sm">
              <span>{name}</span>
              <span>ZAR {amount.toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-1 pt-1 border-t font-medium">
            <div className="flex justify-between">
              <span>Total Liabilities</span>
              <span>ZAR {balanceSheet.totals.liabilities.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Equity</h3>
          {Object.entries(balanceSheet.equity).map(([name, amount]) => (
            <div key={name} className="flex justify-between text-sm">
              <span>{name}</span>
              <span>ZAR {amount.toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-1 pt-1 border-t font-medium">
            <div className="flex justify-between">
              <span>Total Equity</span>
              <span>ZAR {balanceSheet.totals.equity.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-2 border-t-2">
          <div className="flex justify-between font-semibold">
            <span>Total Liabilities and Equity</span>
            <span>ZAR {(balanceSheet.totals.liabilities + balanceSheet.totals.equity).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}