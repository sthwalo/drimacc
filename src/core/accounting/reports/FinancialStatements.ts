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

export class FinancialStatements {
  private chartOfAccounts: ChartOfAccounts;

  constructor(chartOfAccounts: ChartOfAccounts) {
    this.chartOfAccounts = chartOfAccounts;
  }

  generateBalanceSheet(date: string): FinancialStatement {
    const accounts = this.chartOfAccounts.getAllAccounts();
    
    const assets = this.groupAccounts(accounts.filter(a => a.type === 'asset'));
    const liabilities = this.groupAccounts(accounts.filter(a => a.type === 'liability'));
    const equity = this.groupAccounts(accounts.filter(a => a.type === 'equity'));

    const totalAssets = this.calculateTotal(assets);
    const totalLiabilities = this.calculateTotal(liabilities);
    const totalEquity = this.calculateTotal(equity);

    return {
      date,
      items: [
        { name: 'Assets', amount: totalAssets, type: 'asset', subItems: assets },
        { name: 'Liabilities', amount: totalLiabilities, type: 'liability', subItems: liabilities },
        { name: 'Equity', amount: totalEquity, type: 'equity', subItems: equity }
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
    const accounts = this.chartOfAccounts.getAllAccounts();
    
    const revenue = this.groupAccounts(accounts.filter(a => a.type === 'revenue'));
    const expenses = this.groupAccounts(accounts.filter(a => a.type === 'expense'));

    const totalRevenue = this.calculateTotal(revenue);
    const totalExpenses = this.calculateTotal(expenses);
    const netIncome = totalRevenue - totalExpenses;

    return {
      date: `${startDate} to ${endDate}`,
      items: [
        { name: 'Revenue', amount: totalRevenue, type: 'revenue', subItems: revenue },
        { name: 'Expenses', amount: totalExpenses, type: 'expense', subItems: expenses }
      ],
      totals: {
        revenue: totalRevenue,
        expenses: totalExpenses,
        netIncome: netIncome
      }
    };
  }

  generateCashFlowStatement(startDate: string, endDate: string): FinancialStatement {
    const accounts = this.chartOfAccounts.getAllAccounts();
    
    // Group cash flows by activities
    const operating = this.calculateOperatingCashFlow(accounts);
    const investing = this.calculateInvestingCashFlow(accounts);
    const financing = this.calculateFinancingCashFlow(accounts);

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

  private calculateInvestingCashFlow(accounts: Account[]): number {
    // Simplified investing cash flow calculation
    const investingAccounts = accounts.filter(
      account => account.type === 'asset' && account.code.startsWith('15') // Long-term assets
    );
    return investingAccounts.reduce((sum, account) => sum + account.balance, 0);
  }

  private calculateFinancingCashFlow(accounts: Account[]): number {
    // Simplified financing cash flow calculation
    const financingAccounts = accounts.filter(
      account => 
        account.type === 'liability' && account.code.startsWith('2') || // Long-term liabilities
        account.type === 'equity' && account.code.startsWith('3') // Equity accounts
    );
    return financingAccounts.reduce((sum, account) => sum + account.balance, 0);
  }
}