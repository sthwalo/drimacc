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
  logAuditEntry: (eventType: string, message: string) => void; // Add this line
}

// Create a Zustand store for accounting functionality
export const useStore = create<AccountingStore>((set) => ({
  transactions: [],
  accounts: [
    { id: '1000', code: '1000', name: 'Cash', type: 'asset', balance: 0, currency: 'ZAR', created: new Date(), modified: new Date() },
    { id: '4000', code: '4000', name: 'Revenue', type: 'revenue', balance: 0, currency: 'ZAR', created: new Date(), modified: new Date() },
    { id: '5000', code: '5000', name: 'Expenses', type: 'expense', balance: 0, currency: 'ZAR', created: new Date(), modified: new Date() },
  ],
  selectedCurrency: 'ZAR',

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [...state.transactions, transaction]
    })),

  addAccount: (account) =>
    set((state) => ({
      accounts: [...state.accounts, account]
    })),

  updateTransaction: (id, transaction) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...transaction } : t
      )
    })),
    updateAccount: (id, account) =>
      set((state) => ({
        accounts: state.accounts.map((a) =>
          a.id === id ? { ...a, ...account } : a
        )
      })), // Added missing closing parenthesis here
  
    setCurrency: (currency) =>
      set(() => ({
        selectedCurrency: currency
      })),
  
    logAuditEntry: (eventType: string, message: string) => {
      console.log(`[${eventType}]: ${message}`);
      // Implement additional logging functionality as needed
    }
  }));