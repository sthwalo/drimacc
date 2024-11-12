import { Account } from '@/types';
import { ChartOfAccounts } from '../accounts/ChartOfAccounts';

export interface FinancialStatement {
  date: string;
  items: Array<{
    name: string;
    amount: number;
    type?: string;
    subItems?: Array<{ name: string; amount: number }>;
  }>;
  totals: {
    [key: string]: number;
  };
}

// Extend the Account type to include the 'code' property
interface ExtendedAccount extends Account {
  code: string;
}

export class FinancialStatements {
  private chartOfAccounts: ChartOfAccounts;

  constructor(chartOfAccounts: ChartOfAccounts) {
    this.chartOfAccounts = chartOfAccounts;
  }

  generateBalanceSheet(date: string): FinancialStatement {
    const trialBalance = this.generateTrialBalance();
    
    const assets = trialBalance.filter(a => a.type === 'asset');
    const liabilities = trialBalance.filter(a => a.type === 'liability');
    const equity = trialBalance.filter(a => a.type === 'equity');

    const totalAssets = this.calculateTotal(assets.map(item => ({ amount: item.balance })));
    const totalLiabilities = this.calculateTotal(liabilities.map(item => ({ amount: item.balance })));
    const totalEquity = this.calculateTotal(equity.map(item => ({ amount: item.balance })));

    return {
      date,
      items: [
        { name: 'Assets', amount: totalAssets, type: 'asset', subItems: assets.map(item => ({ name: item.name, amount: item.balance })) },
        { name: 'Liabilities', amount: totalLiabilities, type: 'liability', subItems: liabilities.map(item => ({ name: item.name, amount: item.balance })) },
        { name: 'Equity', amount: totalEquity, type: 'equity', subItems: equity.map(item => ({ name: item.name, amount: item.balance })) }
      ],
      totals: {
        assets: totalAssets,
        liabilities: totalLiabilities,
        equity: totalEquity,
        liabilitiesAndEquity: totalLiabilities + totalEquity
      }
    };
  }

  generateIncomeStatement(startDate: string, endDate: string): FinancialStatement {
    const trialBalance = this.generateTrialBalance();
    
    const revenue = trialBalance.filter(a => a.type === 'revenue');
    const expenses = trialBalance.filter(a => a.type === 'expense');

    const totalRevenue = this.calculateTotal(revenue.map(item => ({ amount: item.balance })));
    const totalExpenses = this.calculateTotal(expenses.map(item => ({ amount: item.balance })));
    const netIncome = totalRevenue - totalExpenses;

    return {
      date: `${startDate} to ${endDate}`,
      items: [
        { name: 'Revenue', amount: totalRevenue, type: 'revenue', subItems: revenue.map(item => ({ name: item.name, amount: item.balance })) },
        { name: 'Expenses', amount: totalExpenses, type: 'expense', subItems: expenses.map(item => ({ name: item.name, amount: item.balance })) }
      ],
      totals: {
        revenue: totalRevenue,
        expenses: totalExpenses,
        netIncome: netIncome
      }
    };
  }

  generateCashFlowStatement(startDate: string, endDate: string): FinancialStatement {
    const trialBalance = this.generateTrialBalance();
    
    // Group cash flows by activities
    const operating = this.calculateOperatingCashFlow(trialBalance);
    const investing = this.calculateInvestingCashFlow(trialBalance as ExtendedAccount[]);
    const financing = this.calculateFinancingCashFlow(trialBalance as ExtendedAccount[]);

    const netCashFlow = operating + investing + financing;

    return {
      date: `${startDate} to ${endDate}`,
      items: [
        { name: 'Operating Activities', amount: operating, type: 'operating' },
        { name: 'Investing Activities', amount: investing, type: 'investing' },
        { name: 'Financing Activities', amount: financing, type: 'financing' }
      ],
      totals: {
        operating,
        investing,
        financing,
        netCashFlow
      }
    };
  }

  private groupAccounts(accounts: Account[]): Array<{ name: string; amount: number }> {
    return accounts.map(account => ({
      name: account.name,
      amount: Math.abs(account.balance)
    }));
  }

  private calculateTotal(items: Array<{ amount: number }>): number {
    return items.reduce((sum, item) => sum + item.amount, 0);
  }

  private calculateOperatingCashFlow(accounts: Account[]): number {
    // Simplified operating cash flow calculation
    const operatingAccounts = accounts.filter(
      account => account.type === 'revenue' || account.type === 'expense'
    );
    return operatingAccounts.reduce((sum, account) => sum + account.balance, 0);
  }

  private calculateInvestingCashFlow(accounts: ExtendedAccount[]): number {
    // Simplified investing cash flow calculation
    const investingAccounts = accounts.filter(
      account => account.type === 'asset' && account.code.startsWith('15') // Long-term assets
    );
    return investingAccounts.reduce((sum, account) => sum + account.balance, 0);
  }

  private calculateFinancingCashFlow(accounts: ExtendedAccount[]): number {
    // Simplified financing cash flow calculation
    const financingAccounts = accounts.filter(
      account => 
        account.type === 'liability' && account.code.startsWith('2') || // Long-term liabilities
        account.type === 'equity' && account.code.startsWith('3') // Equity accounts
    );
    return financingAccounts.reduce((sum, account) => sum + account.balance, 0);
  }

  // Method to generate a trial balance from all accounts
  generateTrialBalance(): Array<ExtendedAccount> {
    const accounts = this.chartOfAccounts.getAllAccounts() as ExtendedAccount[];
    return accounts.map(account => ({
      ...account,
      code: account.code || 'default-code', // Provide a default code if necessary
      id: account.id || 'default-id', // Assuming 'id' might already exist, otherwise provide a default
      currency: account.currency || 'ZAR' // Assuming 'currency' might already exist, otherwise provide a default
    }));
  }
}