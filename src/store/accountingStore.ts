import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, AccountingStore } from '../types';

export const useStore = create<AccountingStore>()(
  persist(
    (set) => ({
      transactions: [],
      selectedCurrency: 'ZAR',
      
      addTransaction: (transaction: Transaction) =>
        set((state) => ({
          transactions: [...state.transactions, transaction],
        })),
        
      addTransactions: (newTransactions: Transaction[]) =>
        set((state) => ({
          transactions: [...state.transactions, ...newTransactions],
        })),
        
      setSelectedCurrency: (currency: string) =>
        set(() => ({
          selectedCurrency: currency,
        })),

      clearTransactions: () =>
        set(() => ({
          transactions: [],
        })),
    }),
    {
      name: 'accounting-storage',
      version: 1,
      partialize: (state) => ({
        transactions: state.transactions,
        selectedCurrency: state.selectedCurrency,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('State hydrated:', state);
      },
    }
  )
);