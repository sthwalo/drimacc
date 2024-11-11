import { create } from 'zustand';
import { Transaction, Account } from '../types';

// Define the structure of the accounting store's state and actions
interface AccountingStore {
  transactions: Transaction[];                               // List of all transactions
  accounts: Account[];                                       // List of all accounts
  selectedCurrency: string;                                  // Currently selected currency
  addTransaction: (transaction: Transaction) => void;        // Action to add a new transaction
  addAccount: (account: Account) => void;                    // Action to add a new account
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void; // Action to update a transaction by ID
  updateAccount: (id: string, account: Partial<Account>) => void; // Action to update an account by ID
  setCurrency: (currency: string) => void;                   // Action to set the selected currency
}

// Create a Zustand store for accounting functionality
export const useStore = create<AccountingStore>((set) => ({
  transactions: [],         // Initialize an empty list of transactions
  accounts: [],             // Initialize an empty list of accounts
  selectedCurrency: 'ZAR',  // Default selected currency

  // Adds a new transaction to the transactions array
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [...state.transactions, transaction]  // Append new transaction to existing transactions
    })),

  // Adds a new account to the accounts array
  addAccount: (account) =>
    set((state) => ({
      accounts: [...state.accounts, account]  // Append new account to existing accounts
    })),

  // Updates a specific transaction by matching its ID
  updateTransaction: (id, transaction) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...transaction } : t  // Merge updates if IDs match, otherwise keep original transaction
      )
    })),

  // Updates a specific account by matching its ID
  updateAccount: (id, account) =>
    set((state) => ({
      accounts: state.accounts.map((a) =>
        a.id === id ? { ...a, ...account } : a  // Merge updates if IDs match, otherwise keep original account
      )
    })),

  // Sets the selected currency for the store
  setCurrency: (currency) =>
    set(() => ({
      selectedCurrency: currency  // Update the selected currency
    }))
}));