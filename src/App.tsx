import React from 'react';
import { useLoadingStore } from './store/loadingStore';
import { DocumentUpload } from './components/DocumentUpload/DocumentUpload';
import { TransactionList } from './components/TransactionList/TransactionList';
import { ChartOfAccounts } from './components/ChartOfAccounts/ChartOfAccounts';
import { FinancialReports } from './components/FinancialReports/FinancialReports';
import { CurrencySelector } from './components/CurrencySelector/CurrencySelector';
import ExportData from './components/ExportData/ExportData';
import ManualTransactionInput from './components/ManualInput/ManualTransactionInput';
import  { NotificationList } from './components/Notifications/Notifications';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { TailSpin } from 'react-loader-spinner';

function App() {
  // Access global loading state
  const isLoading = useLoadingStore((state) => state.isLoading);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">AI Accounting System</h1>

        <NotificationList />

        {isLoading && <TailSpin color="#00BFFF" height={100} width={100} />} {/* Show loading spinner if loading */}

        <ErrorBoundary>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4 md:space-y-6">
              <CurrencySelector />
              <DocumentUpload />
              <ManualTransactionInput />
              <ExportData />
            </div>
            <div className="space-y-4 md:space-y-6">
              <TransactionList />
              <ChartOfAccounts />
              <FinancialReports />
            </div>
          </div>
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;