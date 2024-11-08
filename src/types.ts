export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'debit' | 'credit';
  account: string;
  currency: string;
  balance?: number;
  bankCharges?: number;
  reference?: string;
}

export interface AccountingStore {
  transactions: Transaction[];
  selectedCurrency: string;
  addTransaction: (transaction: Transaction) => void;
  addTransactions: (transactions: Transaction[]) => void;
  setSelectedCurrency: (currency: string) => void;
  clearTransactions: () => void;
}