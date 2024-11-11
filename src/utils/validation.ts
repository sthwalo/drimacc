import { Transaction } from '../types';

export const validateTransaction = (transaction: Partial<Transaction>): string[] => {
  const errors: string[] = [];

  if (!transaction.date) {
    errors.push('Date is required');
  }

  if (!transaction.description?.trim()) {
    errors.push('Description is required');
  }

  if (typeof transaction.amount !== 'number' || isNaN(transaction.amount)) {
    errors.push('Valid amount is required');
  }

  if (!transaction.type || !['debit', 'credit'].includes(transaction.type)) {
    errors.push('Valid transaction type is required');
  }

  if (!transaction.account?.trim()) {
    errors.push('Account is required');
  }

  return errors;
};

export const validateBankStatement = (content: string): boolean => {
  const lines = content.split('\n').filter(line => line.trim());
  const datePattern = /^\d{2}\s+Mar/;
  const amountPattern = /\d+,\d+\.\d+/;

  return lines.some(line => 
    datePattern.test(line) && 
    amountPattern.test(line)
  );
};