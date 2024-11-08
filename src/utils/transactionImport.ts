import { Transaction } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function transformBankTransaction(description: string, amount: number, date: string): Transaction {
  const isCredit = description.toLowerCase().includes('invoice') || 
                   description.toLowerCase().includes('credit');

  const category = categorizeTransaction(description);
                   
  return {
    id: uuidv4(),
    date,
    description,
    amount: Math.abs(amount),
    currency: 'ZAR',
    type: isCredit ? 'credit' : 'debit',
    account: category.account,
    category: category.category
  };
}

function categorizeTransaction(description: string): { account: string; category: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense' } {
  const desc = description.toLowerCase();
  
  if (desc.includes('invoice') || desc.includes('payment received')) {
    return { account: 'Accounts Receivable', category: 'asset' };
  } else if (desc.includes('payment made') || desc.includes('purchase')) {
    return { account: 'Accounts Payable', category: 'liability' };
  } else if (desc.includes('investment') || desc.includes('capital')) {
    return { account: 'Owner\'s Equity', category: 'equity' };
  } else if (desc.includes('revenue') || desc.includes('sales')) {
    return { account: 'Revenue', category: 'revenue' };
  } else {
    return { account: 'Expenses', category: 'expense' };
  }
}