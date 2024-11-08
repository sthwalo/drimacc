import * as pdfjsLib from 'pdfjs-dist';
import { Transaction } from '../../types';
import { TransactionClassifier } from '../classification/TransactionClassifier';

export class DocumentProcessor {
  private classifier: TransactionClassifier;

  constructor() {
    this.classifier = new TransactionClassifier();
  }

  async processDocument(file: File): Promise<Transaction[]> {
    try {
      const text = await this.extractText(file);
      const rawTransactions = this.parseTransactions(text);
      return rawTransactions.map(tx => this.classifier.classifyTransaction(tx));
    } catch (error) {
      console.error('Document processing error:', error);
      throw new Error('Failed to process bank statement. Please ensure it\'s a valid statement file.');
    }
  }

  private async extractText(file: File): Promise<string> {
    if (file.type === 'application/pdf') {
      return this.extractPDFText(file);
    } else if (file.type.startsWith('image/')) {
      throw new Error('Image processing not implemented yet');
    } else if (file.type === 'text/csv' || file.type === 'text/plain') {
      return file.text();
    }
    throw new Error(`Unsupported file type: ${file.type}`);
  }

  private async extractPDFText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
    }

    return fullText;
  }

  private parseTransactions(text: string): Partial<Transaction>[] {
    const lines = text.split('\n');
    const transactions: Partial<Transaction>[] = [];

    for (const line of lines) {
      const transaction = this.parseTransactionLine(line);
      if (transaction) {
        transactions.push(transaction);
      }
    }

    return transactions;
  }

  private parseTransactionLine(line: string): Partial<Transaction> | null {
    // Implementation moved to TransactionClassifier
    return this.classifier.parseLine(line);
  }
}