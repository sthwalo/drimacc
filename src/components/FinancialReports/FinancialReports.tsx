import React from 'react';
import { useStore } from '../../store/accountingStore';
import { useCurrencyStore } from '../../store/currencyStore';

export const FinancialReports: React.FC = () => {
  const accounts = useStore((state) => state.accounts);
  const { defaultCurrency } = useCurrencyStore();

  const calculateTotals = () => {
    return accounts.reduce(
      (acc, account) => {
        switch (account.type) {
          case 'asset':
            acc.totalAssets += account.balance;
            break;
          case 'liability':
            acc.totalLiabilities += account.balance;
            break;
          case 'revenue':
            acc.totalRevenue += account.balance;
            break;
          case 'expense':
            acc.totalExpenses += account.balance;
            break;
        }
        return acc;
      },
      { totalAssets: 0, totalLiabilities: 0, totalRevenue: 0, totalExpenses: 0 }
    );
  };

  const totals = calculateTotals();
  const netIncome = totals.totalRevenue - totals.totalExpenses;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Financial Summary</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900">Total Assets</h3>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {totals.totalAssets.toLocaleString('en-US', {
                style: 'currency',
                currency: defaultCurrency,
              })}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900">Total Liabilities</h3>
            <p className="mt-2 text-2xl font-semibold text-gray-900">
              {totals.totalLiabilities.toLocaleString('en-US', {
                style: 'currency',
                currency: defaultCurrency,
              })}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900">Total Revenue</h3>
            <p className="mt-2 text-2xl font-semibold text-green-600">
              {totals.totalRevenue.toLocaleString('en-US', {
                style: 'currency',
                currency: defaultCurrency,
              })}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900">Total Expenses</h3>
            <p className="mt-2 text-2xl font-semibold text-red-600">
              {totals.totalExpenses.toLocaleString('en-US', {
                style: 'currency',
                currency: defaultCurrency,
              })}
            </p>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900">Net Income</h3>
          <p className={`mt-2 text-2xl font-semibold ${
            netIncome >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {netIncome.toLocaleString('en-US', {
              style: 'currency',
              currency: defaultCurrency,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};