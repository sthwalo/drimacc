export interface BaseTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
  type: 'debit' | 'credit';
  account: string;
  bankCharges?: number;
  reference?: string;
}

export interface Transaction extends BaseTransaction {}

export interface Account {
  id: string;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  balance: number;
  created: Date;
  modified: Date;
}

export interface BalanceSheet {
  assets: Record<string, number>;
  liabilities: Record<string, number>;
  equity: Record<string, number>;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
}

export interface IncomeStatement {
  revenue: Record<string, number>;
  expenses: Record<string, number>;
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
}

export interface CashFlow {
  operating: Record<string, number>;
  investing: Record<string, number>;
  financing: Record<string, number>;
  netOperating: number;
  netInvesting: number;
  netFinancing: number;
  netChange: number;
}