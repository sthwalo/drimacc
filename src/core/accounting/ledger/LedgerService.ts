import { Transaction } from './Transaction';
import { ChartOfAccounts } from '../accounts/ChartOfAccounts';
import type { TransactionData } from '@/types';

export class LedgerService {
  private chartOfAccounts: ChartOfAccounts;

  constructor() {
    this.chartOfAccounts = new ChartOfAccounts();
  }

  createTransaction(data: TransactionData): Transaction {
    const transaction = new Transaction();
    
    // Add the main entry
    transaction.addEntry(
      data.accountCode,
      data.type,
      data.amount
    );

    // Add the corresponding entry to maintain double-entry
    const offsetAccount = this.determineOffsetAccount(data);
    transaction.addEntry(
      offsetAccount,
      data.type === 'debit' ? 'credit' : 'debit',
      data.amount
    );

    if (!transaction.validate()) {
      throw new Error('Transaction is not balanced');
    }

    // Update account balances
    transaction.getEntries().forEach(entry => {
      this.chartOfAccounts.updateBalance(
        entry.accountCode,
        entry.amount,
        entry.type
      );
    });

    return transaction;
  }

  private determineOffsetAccount(data: TransactionData): string {
    // Basic logic for determining offset account
    // This should be enhanced based on transaction type and business rules
    switch (data.category) {
      case 'sales':
        return '4000'; // Revenue
      case 'purchase':
        return '5000'; // Expenses
      case 'transfer':
        return '1000'; // Assets
      default:
        return '1000'; // Default to Assets
    }
  }

  getAccountBalance(accountCode: string): number {
    const account = this.chartOfAccounts.getAccount(accountCode);
    return account?.balance ?? 0;
  }

  getTrialBalance(): Array<{ code: string; name: string; debit: number; credit: number }> {
    return this.chartOfAccounts.getAllAccounts().map(account => ({
      code: account.code,
      name: account.name,
      debit: account.balance > 0 ? account.balance : 0,
      credit: account.balance < 0 ? -account.balance : 0,
    }));
  }
}