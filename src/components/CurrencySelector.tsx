import React from 'react';
import { useStore } from '../store/accountingStore';

export function CurrencySelector() {
  const { selectedCurrency, setSelectedCurrency } = useStore();

  const currencies = [
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' }
  ];

  return (
    <div className="mb-4">
      <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
        Select Currency
      </label>
      <select
        id="currency"
        value={selectedCurrency}
        onChange={(e) => setSelectedCurrency(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.code} - {currency.name}
          </option>
        ))}
      </select>
    </div>
  );
}