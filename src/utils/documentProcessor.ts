import * as pdfjsLib from 'pdfjs-dist';
import { Transaction } from '../types';
import { v4 as uuidv4 } from 'uuid';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function processDocument(file: File): Promise<Transaction[]> {
  try {
    const text = await extractText(file);
    return parseFNBStatement(text);
  } catch (error) {
    console.error('Document processing error:', error);
    throw new Error('Failed to process FNB statement. Please ensure it\'s a valid statement file.');
  }
}

async function extractText(file: File): Promise<string> {
  if (file.type === 'application/pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map((item: any) => item.str).join(' ');
    }
    
    return fullText;
  }
  throw new Error('Only PDF files are supported at this time');
}

function parseFNBStatement(text: string): Transaction[] {
  const transactions: Transaction[] = [];
  
  // Find the transactions section
  const transactionsStart = text.indexOf('Transactions in RAND (ZAR)');
  if (transactionsStart === -1) {
    throw new Error('Could not find transactions section in statement');
  }

  // Split into lines and process each transaction
  const lines = text.substring(transactionsStart).split(/\s+(?=\d{2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))/);
  
  for (const line of lines) {
    const transaction = parseTransactionLine(line.trim());
    if (transaction) {
      transactions.push(transaction);
    }
  }

  return transactions;
}

function parseTransactionLine(line: string): Transaction | null {
  // Match date pattern: DD MMM
  const datePattern = /(\d{2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i;
  const dateMatch = line.match(datePattern);
  
  if (!dateMatch) return null;

  // Extract components
  const parts = line.split(/\s+/);
  if (parts.length < 4) return null;

  const dateIndex = parts.findIndex(p => datePattern.test(p + ' ' + parts[p + 1]));
  if (dateIndex === -1) return null;

  // Get description (everything between date and amount)
  const description = parts.slice(dateIndex + 2, -2).join(' ');
  
  // Get amount and balance
  const amount = parseFloat(parts[parts.length - 2].replace(',', ''));
  const balanceStr = parts[parts.length - 1];
  const balance = parseFloat(balanceStr.replace(',', ''));
  
  // Determine if credit/debit
  const isCr = balanceStr.endsWith('Cr');
  
  // Extract reference number if present
  const referenceMatch = description.match(/\d{6}\*\d{4}/);
  const reference = referenceMatch ? referenceMatch[0] : undefined;

  // Extract bank charges if present
  const bankChargesMatch = line.match(/(\d+\.\d{2})\s*(?=Bank Charges)/i);
  const bankCharges = bankChargesMatch ? parseFloat(bankChargesMatch[1]) : undefined;

  return {
    id: uuidv4(),
    date: formatDate(dateMatch[0]),
    description: description.trim(),
    amount: Math.abs(amount),
    type: isCr ? 'credit' : 'debit',
    account: categorizeTransaction(description),
    currency: 'ZAR',
    balance,
    bankCharges,
    reference
  };
}

function formatDate(dateStr: string): string {
  const [day, month] = dateStr.trim().split(/\s+/);
  const months: { [key: string]: string } = {
    'jan': '01', 'feb': '02', 'mar': '03', 'apr': '04',
    'may': '05', 'jun': '06', 'jul': '07', 'aug': '08',
    'sep': '09', 'oct': '10', 'nov': '11', 'dec': '12'
  };
  
  return `${new Date().getFullYear()}-${months[month.toLowerCase()]}-${day.padStart(2, '0')}`;
}

function categorizeTransaction(description: string): string {
  const desc = description.toLowerCase();
  
  if (desc.includes('monthly account fee') || desc.includes('service fee')) {
    return 'Bank Charges';
  } else if (desc.includes('pos purchase') || desc.includes('card purchase')) {
    return 'Card Purchases';
  } else if (desc.includes('atm') || desc.includes('cash')) {
    return 'Cash Withdrawals';
  } else if (desc.includes('payment')) {
    return 'Payments';
  } else if (desc.includes('interest')) {
    return 'Interest';
  } else if (desc.includes('loan')) {
    return 'Loan Transactions';
  }
  
  return 'Other Transactions';
}