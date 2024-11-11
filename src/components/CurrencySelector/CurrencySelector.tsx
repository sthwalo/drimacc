import React from 'react';
import { useCurrencyStore } from '../../store/currencyStore';  // Import the currency store
import { currencies } from '../../utils/currency';

export function CurrencySelector() {
  // Access defaultCurrency and setDefaultCurrency from the currency store
  const { defaultCurrency, setDefaultCurrency } = useCurrencyStore();

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Currency
      </label>
      <select
        value={defaultCurrency}  // Bind to default currency in store
        onChange={(e) => setDefaultCurrency(e.target.value)}  // Update currency in store
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
          focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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