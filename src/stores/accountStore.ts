import { create } from 'zustand';
import { Account } from '../types';

interface AccountState {
  accounts: Account[];
  addAccount: (account: Omit<Account, 'id' | 'created' | 'modified'>) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
}

export const useAccountStore = create<AccountState>((set) => ({
  accounts: [
    {
      id: '1000',
      code: '1000',
      name: 'Cash',
      type: 'asset',
      balance: 0,
      currency: 'USD',
      created: new Date(),
      modified: new Date(),
    },
    {
      id: '4000',
      code: '4000',
      name: 'Revenue',
      type: 'revenue',
      balance: 0,
      currency: 'USD',
      created: new Date(),
      modified: new Date(),
    },
    {
      id: '5000',
      code: '5000',
      name: 'Expenses',
      type: 'expense',
      balance: 0,
      currency: 'USD',
      created: new Date(),
      modified: new Date(),
    },
  ],
  addAccount: (account) =>
    set((state) => ({
      accounts: [
        ...state.accounts,
        {
          ...account,
          id: Math.random().toString(36).substr(2, 9),
          created: new Date(),
          modified: new Date(),
        },
      ],
    })),
  updateAccount: (id, updates) =>
    set((state) => ({
      accounts: state.accounts.map((account) =>
        account.id === id
          ? { ...account, ...updates, modified: new Date() }
          : account
      ),
    })),
}));