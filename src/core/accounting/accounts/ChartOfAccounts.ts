import { Account } from '@/types';

export class ChartOfAccounts {
  private accounts: Account[] = [];

  constructor() {
    // Initialize with some default accounts for testing
    this.initializeDefaultAccounts();
  }

  private initializeDefaultAccounts() {
    const now = new Date();
    this.accounts = [
      {
        id: '1000',
        name: 'Cash',
        type: 'asset',
        balance: 50000,
        created: now,
        modified: now,
        currency: 'ZAR' // Set currency to 'ZAR'
      },
      {
        id: '1100',
        name: 'Accounts Receivable',
        type: 'asset',
        balance: 25000,
        created: now,
        modified: now,
        currency: 'ZAR' // Set currency to 'ZAR'
      },
      {
        id: '2000',
        name: 'Accounts Payable',
        type: 'liability',
        balance: 15000,
        created: now,
        modified: now,
        currency: 'ZAR' // Set currency to 'ZAR'
      },
      {
        id: '3000',
        name: 'Owner\'s Equity',
        type: 'equity',
        balance: 60000,
        created: now,
        modified: now,
        currency: 'ZAR' // Set currency to 'ZAR'
      },
      {
        id: '4000',
        name: 'Revenue',
        type: 'revenue',
        balance: 100000,
        created: now,
        modified: now,
        currency: 'ZAR' // Set currency to 'ZAR'
      },
      {
        id: '5000',
        name: 'Expenses',
        type: 'expense',
        balance: 30000,
        created: now,
        modified: now,
        currency: 'ZAR' // Set currency to 'ZAR'
      }
    ];
  }

  getAllAccounts(): Account[] {
    return this.accounts;
  }

  getAccountById(id: string): Account | undefined {
    return this.accounts.find(account => account.id === id);
  }

  addAccount(account: Omit<Account, 'id' | 'created' | 'modified'>): Account {
    const now = new Date();
    const newAccount: Account = {
      ...account,
      id: this.generateAccountId(),
      created: new Date(),
      modified: new Date()
    };
    this.accounts.push(newAccount);
    return newAccount;
  }

  private generateAccountId(): string {
    return Math.max(...this.accounts.map(a => parseInt(a.id)), 0) + 1 + '';
  }
}