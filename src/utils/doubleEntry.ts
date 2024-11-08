import { Transaction } from '../types';

interface DoubleEntryItem {
  accountId: string;
  type: 'debit' | 'credit';
  amount: number;
}

export function createDoubleEntry(transaction: Transaction): DoubleEntryItem[] {
  const entries: DoubleEntryItem[] = [];
  const { description, amount, type, bankCharges } = transaction;

  // Determine accounts based on transaction type
  const { mainAccount, offsetAccount } = determineAccounts(description);

  // Main transaction entry
  entries.push({
    accountId: mainAccount,
    type,
    amount
  });

  // Offset entry (usually cash unless specified otherwise)
  entries.push({
    accountId: offsetAccount,
    type: type === 'debit' ? 'credit' : 'debit',
    amount
  });

  // Handle bank charges separately to avoid double counting
  if (bankCharges && bankCharges > 0) {
    entries.push({
      accountId: 'Bank Charges',
      type: 'debit',
      amount: bankCharges
    });

    // Offset bank charges against cash
    if (offsetAccount === 'Cash') {
      // Adjust the existing cash entry instead of creating a new one
      const cashEntry = entries.find(e => e.accountId === 'Cash');
      if (cashEntry && cashEntry.type === 'credit') {
        cashEntry.amount += bankCharges;
      }
    } else {
      entries.push({
        accountId: 'Cash',
        type: 'credit',
        amount: bankCharges
      });
    }
  }

  return entries;
}

function determineAccounts(description: string): { mainAccount: string; offsetAccount: string } {
  const desc = description.toLowerCase();
  
  // Default to cash as offset account
  let mainAccount = 'Other Expenses';
  let offsetAccount = 'Cash';

  if (desc.includes('payment to') || desc.includes('pos purchase')) {
    mainAccount = 'Expenses';
  } else if (desc.includes('payment from')) {
    mainAccount = 'Accounts Receivable';
  } else if (desc.includes('credit')) {
    mainAccount = 'Revenue';
  } else if (desc.includes('atm')) {
    mainAccount = 'Cash Withdrawals';
  } else if (desc.includes('loan')) {
    if (desc.includes('repayment')) {
      mainAccount = 'Loan Account';
    } else {
      mainAccount = 'Cash';
      offsetAccount = 'Loans Payable';
    }
  } else if (desc.includes('bank charge') || desc.includes('service fee')) {
    mainAccount = 'Bank Charges';
  } else if (desc.includes('internet pmt')) {
    mainAccount = 'Internet Payments';
  }

  return { mainAccount, offsetAccount };
}