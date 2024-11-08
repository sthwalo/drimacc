import { Account } from '@/types';

export class ChartOfAccounts {
  private accounts: Account[] = [];

  constructor() {
    // Initialize with empty accounts array
    this.accounts = [];
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
      created: now,
      modified: now
    };
    this.accounts.push(newAccount);
    return newAccount;
  }

  private generateAccountId(): string {
    return Math.max(...this.accounts.map(a => parseInt(a.id)), 0) + 1 + '';
  }
}