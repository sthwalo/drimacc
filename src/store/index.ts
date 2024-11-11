import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { persist } from 'zustand/middleware';
import { Transaction, Account } from '../types';  // Ensure types are correctly imported

// Define the shape of the store's state and actions
interface AccountingState {
  transactions: Transaction[];                             // List of all transactions
  accounts: Account[];                                     // List of all accounts
  selectedCurrency: string;                                // Currently selected currency
  exchangeRates: Record<string, number>;                   // Map of exchange rates for currencies
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void; // Add a new transaction without an ID
  setSelectedCurrency: (currency: string) => void;         // Set the selected currency
  updateAccount: (id: string, updates: Partial<Account>) => void; // Update account details by ID
  updateExchangeRate: (currency: string, rate: number) => void;   // Update a specific currency's exchange rate
  convertCurrency: (amount: number, fromCurrency: string, toCurrency: string) => number; // Convert between currencies
}

// Zustand store configuration with persistence
export const useStore = create<AccountingState>()(
  persist(
    (set, get) => ({
      transactions: [],  // Initialize an empty transactions list
      accounts: [        // Default accounts setup
        { id: '1000', name: 'Cash', type: 'asset', balance: 0, currency: 'ZAR' },
        { id: '4000', name: 'Revenue', type: 'revenue', balance: 0, currency: 'ZAR' },
        { id: '5000', name: 'Expenses', type: 'expense', balance: 0, currency: 'ZAR' }
      ],
      selectedCurrency: 'ZAR',  // Default selected currency
      exchangeRates: {          // Initial exchange rates (example values)
        ZAR: 1,
        USD: 0.065,
        EUR: 0.055,
        GBP: 0.048,
        JPY: 7.1
      },

      // Adds a transaction with a unique ID
      addTransaction: (transaction) => 
        set((state) => ({ 
          transactions: [...state.transactions, { ...transaction, id: uuidv4() }]
        })),

      // Sets the selected currency for the app
      setSelectedCurrency: (currency) => set({ selectedCurrency: currency }),

      // Updates an account's details by ID
      updateAccount: (id, updates) =>
        set((state) => ({
          accounts: state.accounts.map((account) =>
            account.id === id ? { ...account, ...updates } : account
          ),
        })),

      // Updates the exchange rate for a specific currency
      updateExchangeRate: (currency, rate) =>
        set((state) => ({
          exchangeRates: { ...state.exchangeRates, [currency]: rate }
        })),

      // Converts an amount from one currency to another using exchange rates
      convertCurrency: (amount, fromCurrency, toCurrency) => {
        const rates = get().exchangeRates;
        if (fromCurrency === toCurrency) return amount; // No conversion needed if currencies match
        const rateFrom = rates[fromCurrency] || 1;      // Fallback to 1 if currency is missing
        const rateTo = rates[toCurrency] || 1;
        return (amount / rateFrom) * rateTo;            // Perform currency conversion
      }
    }),
    { name: 'accounting-storage' }  // Key for persisted store in localStorage
  )
);