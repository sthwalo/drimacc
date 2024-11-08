import { Transaction } from '../../types';

export class TransactionClassifier {
  parseLine(line: string): Partial<Transaction> | null {
    const datePattern = /(\d{1,2})\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{2})[/-]?/i;
    const dateMatch = line.match(datePattern);

    if (!dateMatch) return null;

    const description = line
      .substring(dateMatch[0].length)
      .replace(/\s+/g, ' ')
      .trim()
      .split(/\s+(?=\d+\.\d{2})/)[0];

    const amountMatch = line.match(/(\d+,?\d*\.\d{2})/);
    if (!amountMatch) return null;

    const amount = parseFloat(amountMatch[1].replace(',', ''));
    const balanceMatch = line.match(/(\d+,?\d*\.\d{2})(?!.*\d+,?\d*\.\d{2})/);
    const balance = balanceMatch ? parseFloat(balanceMatch[1].replace(',', '')) : undefined;

    return {
      id: crypto.randomUUID(),
      date: this.formatDate(dateMatch[0]),
      description: description.trim(),
      amount: Math.abs(amount),
      type: this.determineTransactionType(description, amount),
      account: this.categorizeTransaction(description),
      currency: 'ZAR',
      balance
    };
  }

  classifyTransaction(transaction: Partial<Transaction>): Transaction {
    return {
      id: transaction.id || crypto.randomUUID(),
      date: transaction.date || new Date().toISOString(),
      description: transaction.description || '',
      amount: transaction.amount || 0,
      type: transaction.type || 'debit',
      account: transaction.account || this.categorizeTransaction(transaction.description || ''),
      currency: transaction.currency || 'ZAR',
      balance: transaction.balance,
      bankCharges: this.extractBankCharges(transaction.description || '')
    };
  }

  private formatDate(dateStr: string): string {
    const months: { [key: string]: string } = {
      'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
      'may': '05', 'jun': '06', 'jul': '07', 'aug': '08',
      'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
    };

    const parts = dateStr.toLowerCase().match(/(\d{1,2})\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{2})/i);
    if (!parts) return dateStr;

    const day = parts[1].padStart(2, '0');
    const month = months[parts[2]] || parts[2].padStart(2, '0');
    const year = new Date().getFullYear();

    return `${year}-${month}-${day}`;
  }

  private determineTransactionType(description: string, amount: number): 'debit' | 'credit' {
    const creditKeywords = ['credit', 'deposit', 'interest received', 'payment received', 'refund'];
    const isCredit = creditKeywords.some(keyword => description.toLowerCase().includes(keyword));
    return isCredit || amount > 0 ? 'credit' : 'debit';
  }

  private categorizeTransaction(description: string): string {
    const categories: { [key: string]: string[] } = {
      'Bank Charges': ['monthly account fee', 'service fee', 'bank charges'],
      'Payments': ['payment to', 'payment from', 'transfer'],
      'Card Purchases': ['card purchase', 'pos purchase'],
      'Cash Withdrawals': ['atm withdrawal', 'cashback'],
      'Salary': ['salary', 'payroll'],
      'Interest': ['interest earned', 'interest charged']
    };

    const desc = description.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => desc.includes(keyword))) {
        return category;
      }
    }

    return 'Miscellaneous';
  }

  private extractBankCharges(description: string): number | undefined {
    const bankChargesMatch = description.match(/bank charges?:?\s*(\d+\.?\d*)/i);
    return bankChargesMatch ? parseFloat(bankChargesMatch[1]) : undefined;
  }
}