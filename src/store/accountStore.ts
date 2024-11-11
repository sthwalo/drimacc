import { create } from 'zustand';
import { Account } from '../types';

// Define the structure of the account state and actions
interface AccountState {
  accounts: Account[];                                       // List of accounts
  addAccount: (account: Omit<Account, 'id' | 'created' | 'modified'>) => void; // Action to add a new account
  updateAccount: (id: string, updates: Partial<Account>) => void;              // Action to update an account by ID
}

// Zustand store for managing account information
export const useAccountStore = create<AccountState>((set) => ({
  // Initialize the accounts array with default accounts
  accounts: [
    {
      id: '1000',
      code: '1000',
      name: 'Cash',
      type: 'asset',
      balance: 0,
      currency: 'ZAR',          // Default currency set to 'ZAR'
      created: new Date(),       // Date of creation
      modified: new Date(),      // Date of last modification
    },
    {
      id: '4000',
      code: '4000',
      name: 'Revenue',
      type: 'revenue',
      balance: 0,
      currency: 'ZAR',          // Default currency set to 'ZAR'
      created: new Date(),
      modified: new Date(),
    },
    {
      id: '5000',
      code: '5000',
      name: 'Expenses',
      type: 'expense',
      balance: 0,
      currency: 'ZAR',          // Default currency set to 'ZAR'
      created: new Date(),
      modified: new Date(),
    },
  ],

  // Adds a new account to the accounts array
  addAccount: (account) =>
    set((state) => ({
      accounts: [
        ...state.accounts,
        {
          ...account,
          id: Math.random().toString(36).substr(2, 9),  // Generate a unique ID for the new account
          created: new Date(),                           // Set creation date
          modified: new Date(),                          // Set modification date
        },
      ],
    })),

  // Updates an account in the accounts array by matching its ID
  updateAccount: (id, updates) =>
    set((state) => ({
      accounts: state.accounts.map((account) =>
        account.id === id
          ? { ...account, ...updates, modified: new Date() } // Apply updates and set modification date if IDs match
          : account                                           // Otherwise, return the account unchanged
      ),
    })),
}));