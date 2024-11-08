import { Transaction } from '../../types';
import { DoubleEntryService } from '../ledger/DoubleEntryService';
import { DocumentProcessor } from '../../ml/ocr/DocumentProcessor';

export class TransactionProcessor {
  private doubleEntryService: DoubleEntryService;
  private documentProcessor: DocumentProcessor;

  constructor() {
    this.doubleEntryService = new DoubleEntryService();
    this.documentProcessor = new DocumentProcessor();
  }

  async processDocument(file: File): Promise<Transaction[]> {
    const transactions = await this.documentProcessor.processDocument(file);
    transactions.forEach(transaction => {
      this.doubleEntryService.processTransaction(transaction);
    });
    return transactions;
  }

  processTransaction(transaction: Transaction): void {
    this.doubleEntryService.processTransaction(transaction);
  }
}