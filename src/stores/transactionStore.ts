import { create } from 'zustand';
import { Transaction } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created' | 'modified'>) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [
        ...state.transactions,
        {
          ...transaction,
          id: uuidv4(),
          created: new Date(),
          modified: new Date(),
        },
      ],
    })),
  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map((transaction) =>
        transaction.id === id
          ? { ...transaction, ...updates, modified: new Date() }
          : transaction
      ),
    })),
}));