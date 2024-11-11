// src/types/index.ts

// Represents an account in the chart of accounts
export interface Account {
  id: string;                      // Unique identifier for the account
  name: string;                    // Name of the account
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense'; // Account type
  balance: number;                 // Current balance of the account
  currency: string;                // Currency code for the account balance
  description?: string;            // Optional description of the account
  parentId?: string;               // Optional parent account ID for hierarchical structures
}

// Represents an audit log entry for tracking actions in the system
export interface AuditLogEntry {
  id: string;                      // Unique identifier for the audit log entry
  action: string;                  // Action performed (e.g., 'CREATE', 'UPDATE', 'DELETE')
  details: string;                 // Details about the action performed
  timestamp: string;               // Timestamp of when the action occurred in ISO format
  userId?: string;                 // Optional user ID associated with the action
}

// Represents options for exporting data from the system
export interface ExportOptions {
  format: 'xlsx' | 'pdf' | 'csv';  // Export format type
  dateRange?: {                    // Optional date range filter for export
    start: string;                 // Start date of the export range in ISO format
    end: string;                   // End date of the export range in ISO format
  };
  includeAuditLog?: boolean;       // Flag to include audit log in the export
}

// Represents the state and actions for the accounting store
export interface AccountingStore {
  transactions: Transaction[];     // List of all transactions
  selectedCurrency: string;        // Currently selected currency for transactions
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void; // Adds a transaction without ID (auto-generated)
  setSelectedCurrency: (currency: string) => void;  // Sets the selected currency
  // New property
  logAuditEntry: (action: string, details: string) => void;  // Log an audit entry

}

export interface Transaction {
  id: string;                        // Unique identifier for the transaction
  date: string;                      // Transaction date in ISO format
  description: string;               // Description of the transaction
  account: string;                   // Associated account ID
  balance: number;                   // Running balance after transaction
  type: 'debit' | 'credit';          // Type of transaction (debit or credit)
  amount: number;                    // Transaction amount
  currency: string;                  // Currency code of the transaction
  reconciled: boolean;               // Indicates if the transaction has been reconciled
  reconciliationNote?: string;       // Optional note for reconciliation
  created: Date;                     // Timestamp of creation
  modified: Date;                    // Timestamp of last modification
}
export interface AuditLogEntry {
  id: string;
  action: string;
  details: string;
  timestamp: string;
}