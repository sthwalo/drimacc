// Currency data with symbols for easy reference and display
export const currencies = [
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' }
] as const;

// Formats an amount based on the selected currency code
export const formatCurrency = (amount: number, currency: string): string => {
  // Find the currency info based on the provided code
  const currencyInfo = currencies.find(c => c.code === currency);
  if (!currencyInfo) return `${amount.toFixed(2)}`;  // Return plain formatted amount if currency is not found

  // Use Intl.NumberFormat for locale-aware formatting
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: currencyInfo.code,
    minimumFractionDigits: 2
  }).format(amount);
};

// Parses a currency-formatted string and returns a numeric amount
export const parseCurrencyAmount = (amount: string): number => {
  // Remove any non-numeric characters except "." and "-"
  return parseFloat(amount.replace(/[^0-9.-]+/g, ''));
};