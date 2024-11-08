import { Transaction } from '../types';

interface AccountBalance {
  debit: number;
  credit: number;
}

interface FinancialReport {
  accounts: Record<string, AccountBalance>;
  totals: {
    debit: number;
    credit: number;
  };
}

export function calculateTrialBalance(transactions: Transaction[]): FinancialReport {
  const accounts: Record<string, AccountBalance> = {};
  
  transactions.forEach(transaction => {
    if (!accounts[transaction.account]) {
      accounts[transaction.account] = { debit: 0, credit: 0 };
    }
    
    if (transaction.type === 'debit') {
      accounts[transaction.account].debit += transaction.amount;
    } else {
      accounts[transaction.account].credit += transaction.amount;
    }

    // Handle bank charges if present
    if (transaction.bankCharges) {
      if (!accounts['Bank Charges']) {
        accounts['Bank Charges'] = { debit: 0, credit: 0 };
      }
      accounts['Bank Charges'].debit += transaction.bankCharges;
    }
  });

  const totals = Object.values(accounts).reduce(
    (acc, balance) => ({
      debit: acc.debit + balance.debit,
      credit: acc.credit + balance.credit,
    }),
    { debit: 0, credit: 0 }
  );

  return { accounts, totals };
}

export interface BalanceSheetData {
  assets: Record<string, number>;
  liabilities: Record<string, number>;
  equity: Record<string, number>;
  totals: {
    assets: number;
    liabilities: number;
    equity: number;
  };
}

export function calculateBalanceSheet(transactions: Transaction[]): BalanceSheetData {
  const balanceSheet: BalanceSheetData = {
    assets: {},
    liabilities: {},
    equity: {},
    totals: { assets: 0, liabilities: 0, equity: 0 }
  };

  transactions.forEach(transaction => {
    const amount = transaction.amount + (transaction.bankCharges || 0);
    
    if (transaction.account.toLowerCase().includes('cash') || 
        transaction.account.toLowerCase().includes('bank')) {
      balanceSheet.assets[transaction.account] = 
        (balanceSheet.assets[transaction.account] || 0) + 
        (transaction.type === 'debit' ? amount : -amount);
    } else if (transaction.account.toLowerCase().includes('payable')) {
      balanceSheet.liabilities[transaction.account] = 
        (balanceSheet.liabilities[transaction.account] || 0) + 
        (transaction.type === 'credit' ? amount : -amount);
    } else {
      balanceSheet.equity[transaction.account] = 
        (balanceSheet.equity[transaction.account] || 0) + 
        (transaction.type === 'credit' ? amount : -amount);
    }
  });

  balanceSheet.totals.assets = Object.values(balanceSheet.assets).reduce((a, b) => a + b, 0);
  balanceSheet.totals.liabilities = Object.values(balanceSheet.liabilities).reduce((a, b) => a + b, 0);
  balanceSheet.totals.equity = Object.values(balanceSheet.equity).reduce((a, b) => a + b, 0);

  return balanceSheet;
}

export interface IncomeStatementData {
  revenue: Record<string, number>;
  expenses: Record<string, number>;
  totals: {
    revenue: number;
    expenses: number;
    netIncome: number;
  };
}

export function calculateIncomeStatement(transactions: Transaction[]): IncomeStatementData {
  const incomeStatement: IncomeStatementData = {
    revenue: {},
    expenses: {},
    totals: { revenue: 0, expenses: 0, netIncome: 0 }
  };

  transactions.forEach(transaction => {
    const amount = transaction.amount;
    
    if (transaction.type === 'credit' && !transaction.account.toLowerCase().includes('payable')) {
      incomeStatement.revenue[transaction.account] = 
        (incomeStatement.revenue[transaction.account] || 0) + amount;
    } else if (transaction.type === 'debit' || transaction.bankCharges) {
      incomeStatement.expenses[transaction.account] = 
        (incomeStatement.expenses[transaction.account] || 0) + 
        amount + (transaction.bankCharges || 0);
    }
  });

  incomeStatement.totals.revenue = Object.values(incomeStatement.revenue).reduce((a, b) => a + b, 0);
  incomeStatement.totals.expenses = Object.values(incomeStatement.expenses).reduce((a, b) => a + b, 0);
  incomeStatement.totals.netIncome = incomeStatement.totals.revenue - incomeStatement.totals.expenses;

  return incomeStatement;
}

export interface CashFlowData {
  operating: Record<string, number>;
  investing: Record<string, number>;
  financing: Record<string, number>;
  totals: {
    operating: number;
    investing: number;
    financing: number;
    netChange: number;
  };
}

export function calculateCashFlow(transactions: Transaction[]): CashFlowData {
  const cashFlow: CashFlowData = {
    operating: {},
    investing: {},
    financing: {},
    totals: { operating: 0, investing: 0, financing: 0, netChange: 0 }
  };

  transactions.forEach(transaction => {
    const amount = transaction.amount + (transaction.bankCharges || 0);
    const isOutflow = transaction.type === 'debit';
    const flow = isOutflow ? -amount : amount;

    if (transaction.account.toLowerCase().includes('loan') || 
        transaction.account.toLowerCase().includes('capital')) {
      cashFlow.financing[transaction.account] = 
        (cashFlow.financing[transaction.account] || 0) + flow;
    } else if (transaction.account.toLowerCase().includes('equipment') || 
               transaction.account.toLowerCase().includes('asset')) {
      cashFlow.investing[transaction.account] = 
        (cashFlow.investing[transaction.account] || 0) + flow;
    } else {
      cashFlow.operating[transaction.account] = 
        (cashFlow.operating[transaction.account] || 0) + flow;
    }
  });

  cashFlow.totals.operating = Object.values(cashFlow.operating).reduce((a, b) => a + b, 0);
  cashFlow.totals.investing = Object.values(cashFlow.investing).reduce((a, b) => a + b, 0);
  cashFlow.totals.financing = Object.values(cashFlow.financing).reduce((a, b) => a + b, 0);
  cashFlow.totals.netChange = cashFlow.totals.operating + 
                             cashFlow.totals.investing + 
                             cashFlow.totals.financing;

  return cashFlow;
}