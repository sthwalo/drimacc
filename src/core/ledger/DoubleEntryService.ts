import { Transaction } from '../../types';
import { ChartOfAccounts } from '../accounts/ChartOfAccounts';

export class DoubleEntryService {
  private chartOfAccounts: ChartOfAccounts;

  constructor() {
    this.chartOfAccounts = new ChartOfAccounts();
  }

  processTransaction(transaction: Transaction): void {
    // Create double entry
    const { mainEntry, offsetEntry } = this.createEntries(transaction);
    
    // Update account balances
    this.updateAccountBalance(mainEntry);
    this.updateAccountBalance(offsetEntry);
    
    // Handle bank charges if present
    if (transaction.bankCharges) {
      this.processBankCharges(transaction);
    }
  }

  private createEntries(transaction: Transaction) {
    const mainEntry = {
      accountId: this.determineMainAccount(transaction),
      type: transaction.type,
      amount: transaction.amount
    };

    const offsetEntry = {
      accountId: this.determineOffsetAccount(transaction),
      type: transaction.type === 'debit' ? 'credit' : 'debit',
      amount: transaction.amount
    };

    return { mainEntry, offsetEntry };
  }

  private updateAccountBalance(entry: { accountId: string; type: string; amount: number }) {
    const account = this.chartOfAccounts.getAccountById(entry.accountId);
    if (!account) return;

    if (entry.type === 'debit') {
      account.balance += entry.amount;
    } else {
      account.balance -= entry.amount;
    }
  }

  private processBankCharges(transaction: Transaction) {
    const bankChargesEntry = {
      accountId: 'BANK_CHARGES',
      type: 'debit',
      amount: transaction.bankCharges || 0
    };

    const cashEntry = {
      accountId: 'CASH',
      type: 'credit',
      amount: transaction.bankCharges || 0
    };

    this.updateAccountBalance(bankChargesEntry);
    this.updateAccountBalance(cashEntry);
  }

  private determineMainAccount(transaction: Transaction): string {
    const desc = transaction.description.toLowerCase();
    
    if (desc.includes('payment to') || desc.includes('pos purchase')) {
      return 'EXPENSES';
    } else if (desc.includes('payment from')) {
      return 'ACCOUNTS_RECEIVABLE';
    } else if (desc.includes('credit')) {
      return 'REVENUE';
    } else if (desc.includes('atm')) {
      return 'CASH_WITHDRAWALS';
    } else if (desc.includes('bank charge') || desc.includes('service fee')) {
      return 'BANK_CHARGES';
    }
    
    return 'MISCELLANEOUS';
  }

  private determineOffsetAccount(transaction: Transaction): string {
    const desc = transaction.description.toLowerCase();
    
    if (desc.includes('loan')) {
      return 'LOANS_PAYABLE';
    } else if (desc.includes('investment')) {
      return 'OWNERS_EQUITY';
    }
    
    return 'CASH'; // Default offset account
  }
}