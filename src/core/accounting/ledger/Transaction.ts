import { TransactionData } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export class Transaction {
  private id: string;
  private entries: Array<{
    accountCode: string;
    type: 'debit' | 'credit';
    amount: number;
  }>;

  constructor() {
    this.id = uuidv4();
    this.entries = [];
  }

  addEntry(accountCode: string, type: 'debit' | 'credit', amount: number) {
    this.entries.push({ accountCode, type, amount });
  }

  validate(): boolean {
    const totalDebits = this.entries
      .filter(entry => entry.type === 'debit')
      .reduce((sum, entry) => sum + entry.amount, 0);

    const totalCredits = this.entries
      .filter(entry => entry.type === 'credit')
      .reduce((sum, entry) => sum + entry.amount, 0);

    return Math.abs(totalDebits - totalCredits) < 0.001; // Account for floating point precision
  }

  getEntries() {
    return this.entries;
  }

  getId() {
    return this.id;
  }
}