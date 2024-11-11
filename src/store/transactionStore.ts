import { create } from 'zustand';
import { Transaction } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Define the shape of the store's state and actions for managing transactions
interface TransactionState {
  transactions: Transaction[];                            // Array of all transactions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created' | 'modified'>) => void; // Action to add a transaction
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;                 // Action to update a transaction by ID
}

// Zustand store to manage transaction data
export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [], // Initialize with an empty array of transactions

  // Adds a new transaction to the store
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [
        ...state.transactions,
        {
          ...transaction,
          id: uuidv4(),               // Generate a unique ID for each new transaction
          created: new Date(),        // Set creation timestamp
          modified: new Date(),       // Set initial modified timestamp
          reconciled: false,          // Initialize with reconciled status as false
        },
      ],
    })),

  // Updates an existing transaction in the store by its ID
  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map((transaction) =>
        transaction.id === id
          ? { ...transaction, ...updates, modified: new Date() } // Merge updates and update modified timestamp if ID matches
          : transaction                                           // Otherwise, keep the transaction unchanged
      ),
    })),
}));