AI-Powered Accounting System

A modern, intelligent accounting system designed for small and medium enterprises, featuring automated document processing, real-time reporting, and integrated SARS e-filing support.

Table of Contents

	•	Core Features
	•	Tech Stack
	•	Project Structure
	•	Database Schema
	•	Getting Started
	•	Development Guidelines
	•	Key Feature Implementations
	•	Contributing
	•	License

Core Features

	•	📄 Intelligent Document Processing & OCR
	•	📊 Automated Double-Entry Accounting
	•	🔒 Real-Time Audit Trail Logging
	•	🔄 Real-Time Account Balancing
	•	🏦 Bank Statement Processing & Reconciliation
	•	💰 Multi-Currency Support with Real-Time Conversion
	•	✍️ Manual Transaction Entry
	•	📋 Chart of Accounts Management
	•	📈 Financial Statements (Balance Sheet, Income Statement, etc.)
	•	📊 Business Intelligence Dashboard & Analytics
	•	📝 Tax Compliance with SARS (ITR14 Pre-filling)
	•	💾 Data Export (Excel, PDF, Word)
	•	🔔 Notifications & Alerts
	•	📱 Responsive Dashboard

Tech Stack

Frontend

	•	React 18.2.0
	•	TypeScript 5.2.2
	•	Tailwind CSS 3.3.3
	•	Zustand (State Management)
	•	Vite 4.4.9

Backend & Database

	•	Node.js
	•	PostgreSQL (via Prisma ORM)
	•	Prisma Client
	•	RESTful API

Document Processing & Machine Learning

	•	Tesseract.js 4.1.1 (OCR)
	•	TensorFlow.js 4.10.0 (ML Processing)

Data Export

	•	ExcelJS 4.4.0 (Excel Export with Formulas)
	•	jsPDF 2.5.1 (PDF Generation)
	•	jsPDF-AutoTable 3.8.1 (PDF Tables)

Development Tools

	•	ESLint
	•	Vitest (Testing)
	•	PostCSS
	•	Autoprefixer

Project Structure

src/
├── components/                # React Components
│   ├── ChartOfAccounts/       # Account management UI
│   ├── CurrencySelector/      # Currency selection & conversion
│   ├── DocumentUpload/        # File upload & processing UI
│   ├── ExportData/            # Data export interface
│   ├── FinancialReports/      # Financial reports interface
│   ├── ManualInput/           # Manual transaction entry
│   ├── Notifications/         # User alerts and notifications
│   ├── Reconciliation/        # Bank statement reconciliation
│   ├── TaxCompliance/         # Tax form generation and pre-filling
│   ├── TransactionList/       # Transaction history display
│   └── common/                # Shared components
│
├── core/                      # Business Logic
│   ├── accounting/            # Accounting engine
│   │   ├── ledger.ts          # Double-entry system & journal postings
│   │   ├── validation.ts      # Transaction validation
│   │   ├── reconciliation.ts  # Reconciliation engine
│   │   ├── audit.ts           # Audit trail logging
│   │   └── taxation.ts        # SARS ITR14 compliance & tax calculations
│   ├── processing/            # Document processing
│   │   ├── ocr.ts             # OCR processing
│   │   └── parser.ts          # Statement parsing
│   ├── bi/                    # Business Intelligence logic
│   │   ├── analytics.ts       # Analytics calculations & BI generation
│   │   └── dashboard.ts       # BI dashboard generation
│   └── notifications/         # Notifications logic
│       └── notifier.ts        # Notification handler
│
├── store/                     # State Management
│   ├── accountStore.ts        # Account state
│   ├── currencyStore.ts       # Currency state
│   ├── transactionStore.ts    # Transaction state
│   └── notificationStore.ts   # Notification state
│
├── types/                     # TypeScript Definitions
│   └── index.ts               # Type declarations
│
├── utils/                     # Utility Functions
│   ├── currency.ts            # Currency operations
│   ├── date.ts                # Date formatting
│   ├── export/                # Export utilities
│   │   ├── excel.ts           # Excel export
│   │   ├── pdf.ts             # PDF generation
│   │   └── word.ts            # Word export
│   └── validation.ts          # Input validation helpers
│
├── lib/                       # Library Code
│   └── db.ts                  # Database client
│
└── services/                  # External Services
    ├── api/                   # API integrations
    └── currencyConverter.ts   # Real-time currency conversion

Database Schema

The system uses PostgreSQL with Prisma ORM and includes:
	•	Accounts: Chart of accounts with audit fields
	•	Transactions: Journal entries with double-entry records
	•	TransactionAccounts: Double-entry transaction details
	•	AuditLogs: Stores audit trails
	•	Reports: Stores generated reports for user reference
	•	ReconciliationRecords: Stores bank reconciliation history

Getting Started

	1.	Clone the repository:

git clone https://github.com/sthwalo/acc.git
cd acc


	2.	Install dependencies:

npm install


	3.	Set up the database:
Update .env with your PostgreSQL credentials, then migrate the database.

npm run migrate


	4.	Start development server:

npm run dev

Development Guidelines

	1.	Code Organization
	•	Use feature-based folder structure
	•	Use TypeScript for type safety
	•	Ensure proper error handling across components
	2.	State Management
	•	Use Zustand for global state
	•	Keep state updates immutable
	•	Separate store logic by functionality
	3.	Testing
	•	Write unit tests for core functionality
	•	Maintain test coverage above 80%
	4.	Documentation
	•	Document components and functions
	•	Add JSDoc comments
	•	Keep README updated with changes

Key Feature Implementations

	1.	Document Processing
	•	OCR: Process scanned documents and extract text
	•	Bank Statement Parsing: Extract data from bank statements for reconciliation
	•	Automated Classification: Classify transactions based on rules and chart of accounts
	2.	Accounting Engine
	•	Double-Entry System: Post journal entries to maintain balance
	•	Audit Trail: Log all changes to financial records
	•	Real-Time Balances: Instantly update account balances
	3.	Financial Reports
	•	Balance Sheet
	•	Income Statement
	•	Trial Balance
	•	Cash Flow Statement
	4.	Tax Compliance & SARS Integration
	•	Generate ITR14 forms with tax calculations
	•	Support for SARS e-filing
	5.	Data Export
	•	Export to Excel with formulas, PDF with tables, and Word documents
	•	Customizable reports and data extracts
	6.	Business Intelligence Dashboard
	•	Analytics and trend visualization using TensorFlow.js
	•	Alerts and anomaly detection
	7.	Notifications & Alerts
	•	Notify users on invalid entries, reconciliation mismatches, or report issues

Contributing

	1.	Fork the repository
	2.	Create a feature branch
	3.	Commit changes
	4.	Push to the branch
	5.	Create a Pull Request

License

MIT License - See LICENSE file for details.