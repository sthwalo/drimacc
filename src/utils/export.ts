import { Transaction, Account, ExportOptions } from '../types';

export const exportData = async (
  transactions: Transaction[],
  accounts: Account[],
  options: ExportOptions
): Promise<Blob> => {
  switch (options.format) {
    case 'xlsx':
      return generateExcel(transactions, accounts, options);
    case 'pdf':
      return generatePDF(transactions, accounts, options);
    case 'csv':
      return generateCSV(transactions, accounts, options);
    default:
      throw new Error('Unsupported export format');
  }
};

const generateExcel = async (
  transactions: Transaction[],
  accounts: Account[],
  options: ExportOptions
): Promise<Blob> => {
  // Excel generation logic will be implemented here
  const data = new Blob(['Excel data'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  return data;
};

const generatePDF = async (
  transactions: Transaction[],
  accounts: Account[],
  options: ExportOptions
): Promise<Blob> => {
  // PDF generation logic will be implemented here
  const data = new Blob(['PDF data'], { type: 'application/pdf' });
  return data;
};

const generateCSV = async (
  transactions: Transaction[],
  accounts: Account[],
  options: ExportOptions
): Promise<Blob> => {
  const headers = ['Date', 'Description', 'Amount', 'Type', 'Account', 'Currency'];
  const rows = transactions.map(t => [
    t.date,
    t.description,
    t.amount.toString(),
    t.type,
    t.account,
    t.currency
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return new Blob([csv], { type: 'text/csv' });
};