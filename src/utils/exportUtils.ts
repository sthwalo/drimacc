import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction, ExportOptions } from '../types';

// Export to Excel using exceljs
export const exportToExcel = async (transactions: Transaction[], currency: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Transactions');

  // Set header row
  worksheet.addRow(['Date', 'Description', 'Amount', 'Type', 'Account', 'Balance']);

  // Populate rows with transaction data
  transactions.forEach((transaction) => {
    worksheet.addRow([
      transaction.date,
      transaction.description,
      `${transaction.type === 'credit' ? '' : '-'}${transaction.amount} ${transaction.currency}`,
      transaction.type,
      transaction.account,
      transaction.balance
    ]);
  });

  // Add totals
  const totalCredits = transactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDebits = transactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  worksheet.addRow([]);
  worksheet.addRow(['Total Credits', '', totalCredits.toFixed(2)]);
  worksheet.addRow(['Total Debits', '', totalDebits.toFixed(2)]);
  worksheet.addRow(['Net Balance', '', (totalCredits - totalDebits).toFixed(2)]);

  // Download file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'accounting_data.xlsx';
  link.click();
  URL.revokeObjectURL(link.href);
};

// Export to PDF using jsPDF and jsPDF-AutoTable
export const exportToPDF = (transactions: Transaction[], currency: string) => {
  const doc = new jsPDF();
  setupPDFHeader(doc, currency);
  addTransactionTable(doc, transactions);
  doc.save('accounting_report.pdf');
};

// Export to Word
export const exportToWord = (transactions: Transaction[], currency: string) => {
  const content = generateWordContent(transactions, currency);
  downloadWordFile(content);
};

// Helper functions
const formatTransactionForExport = (t: Transaction) => ({
  Date: t.date,
  Description: t.description,
  Amount: `${t.type === 'credit' ? '' : '-'}${t.amount} ${t.currency}`,
  Type: t.type,
  Account: t.account,
  Balance: t.balance
});

const setupPDFHeader = (doc: jsPDF, currency: string) => {
  doc.setFontSize(16);
  doc.text('Financial Transactions Report', 14, 15);
  doc.setFontSize(10);
  doc.text(`Currency: ${currency}`, 14, 25);
};

const addTransactionTable = (doc: jsPDF, transactions: Transaction[]) => {
  autoTable(doc, {
    startY: 30,
    head: [['Date', 'Description', 'Amount', 'Type', 'Account', 'Balance']],
    body: transactions.map(t => [
      t.date,
      t.description,
      `${t.type === 'credit' ? '' : '-'}${t.amount}`,
      t.type,
      t.account,
      t.balance
    ]),
    foot: calculateTableFooter(transactions)
  });
};

const calculateTableFooter = (transactions: Transaction[]) => {
  const credits = transactions.reduce((sum, t) => t.type === 'credit' ? sum + t.amount : sum, 0);
  const debits = transactions.reduce((sum, t) => t.type === 'debit' ? sum + t.amount : sum, 0);

  return [
    ['Total Credits', '', credits.toFixed(2), '', '', ''],
    ['Total Debits', '', debits.toFixed(2), '', '', ''],
    ['Net Balance', '', (credits - debits).toFixed(2), '', '', '']
  ];
};

const generateWordContent = (transactions: Transaction[], currency: string) => {
  const header = `<html>
    <head>
      <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <h1>Financial Transactions Report</h1>
      <p>Currency: ${currency}</p>`;

  const tableContent = generateTableContent(transactions);
  return `${header}${tableContent}</body></html>`;
};

const generateTableContent = (transactions: Transaction[]) => {
  const rows = transactions.map(t => `
    <tr>
      <td>${t.date}</td>
      <td>${t.description}</td>
      <td>${t.type === 'credit' ? '' : '-'}${t.amount}</td>
      <td>${t.type}</td>
      <td>${t.account}</td>
      <td>${t.balance}</td>
    </tr>
  `).join('');

  return `
    <table>
      <tr>
        <th>Date</th>
        <th>Description</th>
        <th>Amount</th>
        <th>Type</th>
        <th>Account</th>
        <th>Balance</th>
      </tr>
      ${rows}
      ${generateTotalRows(transactions)}
    </table>
  `;
};

const generateTotalRows = (transactions: Transaction[]) => {
  const credits = transactions.reduce((sum, t) => t.type === 'credit' ? sum + t.amount : sum, 0);
  const debits = transactions.reduce((sum, t) => t.type === 'debit' ? sum + t.amount : sum, 0);

  return `
    <tr>
      <td colspan="2">Total Credits</td>
      <td>${credits.toFixed(2)}</td>
      <td colspan="3"></td>
    </tr>
    <tr>
      <td colspan="2">Total Debits</td>
      <td>${debits.toFixed(2)}</td>
      <td colspan="3"></td>
    </tr>
    <tr>
      <td colspan="2">Net Balance</td>
      <td>${(credits - debits).toFixed(2)}</td>
      <td colspan="3"></td>
    </tr>
  `;
};

const downloadWordFile = (content: string) => {
  const blob = new Blob([content], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'accounting_report.doc';
  link.click();
  URL.revokeObjectURL(url);
};