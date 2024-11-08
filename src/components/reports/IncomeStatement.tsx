import React from 'react';
import { Transaction } from '../../types';
import { calculateIncomeStatement } from '../../utils/financialCalculations';

interface Props {
  transactions: Transaction[];
}

export function IncomeStatement({ transactions }: Props) {
  const incomeStatement = calculateIncomeStatement(transactions);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Income Statement</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium mb-2">Revenue</h3>
          {Object.entries(incomeStatement.revenue).map(([name, amount]) => (
            <div key={name} className="flex justify-between text-sm">
              <span>{name}</span>
              <span>ZAR {amount.toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-1 pt-1 border-t font-medium">
            <div className="flex justify-between">
              <span>Total Revenue</span>
              <span>ZAR {incomeStatement.totals.revenue.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Expenses</h3>
          {Object.entries(incomeStatement.expenses).map(([name, amount]) => (
            <div key={name} className="flex justify-between text-sm">
              <span>{name}</span>
              <span>ZAR {amount.toFixed(2)}</span>
            </div>
          ))}
          <div className="mt-1 pt-1 border-t font-medium">
            <div className="flex justify-between">
              <span>Total Expenses</span>
              <span>ZAR {incomeStatement.totals.expenses.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-2 border-t-2">
          <div className="flex justify-between font-semibold">
            <span>Net Income</span>
            <span>ZAR {incomeStatement.totals.netIncome.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}