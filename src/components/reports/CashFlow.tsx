import React from 'react';
import { Transaction } from '../../types';
import { calculateCashFlow } from '../../utils/financialCalculations';

interface Props {
  transactions: Transaction[];
}

export function CashFlow({ transactions }: Props) {
  const cashFlow = calculateCashFlow(transactions);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Cash Flow Statement</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Operating Activities</h3>
          {Object.entries(cashFlow.operating).map(([name, amount]) => (
            <div key={name} className="flex justify-between text-sm">
              <span>{name}</span>
              <span>ZAR {amount.toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-1 pt-1 border-t font-medium">
            <div className="flex justify-between">
              <span>Net Operating Cash Flow</span>
              <span>ZAR {cashFlow.totals.operating.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Investing Activities</h3>
          {Object.entries(cashFlow.investing).map(([name, amount]) => (
            <div key={name} className="flex justify-between text-sm">
              <span>{name}</span>
              <span>ZAR {amount.toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-1 pt-1 border-t font-medium">
            <div className="flex justify-between">
              <span>Net Investing Cash Flow</span>
              <span>ZAR {cashFlow.totals.investing.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Financing Activities</h3>
          {Object.entries(cashFlow.financing).map(([name, amount]) => (
            <div key={name} className="flex justify-between text-sm">
              <span>{name}</span>
              <span>ZAR {amount.toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-1 pt-1 border-t font-medium">
            <div className="flex justify-between">
              <span>Net Financing Cash Flow</span>
              <span>ZAR {cashFlow.totals.financing.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-2 border-t-2">
          <div className="flex justify-between font-semibold">
            <span>Net Change in Cash</span>
            <span>ZAR {cashFlow.totals.netChange.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}