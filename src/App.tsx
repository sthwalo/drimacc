import React from 'react';
import { TransactionImport } from './components/transactions/TransactionImport';
import { CurrencySelector } from './components/currency/CurrencySelector';
import { ManualTransactionInput } from './components/transactions/ManualTransactionInput';
import { TransactionList } from './components/transactions/TransactionList';
import { TrialBalance } from './components/reports/TrialBalance';
import { BalanceSheet } from './components/reports/BalanceSheet';
import { IncomeStatement } from './components/reports/IncomeStatement';
import { CashFlow } from './components/reports/CashFlow';
import { useStore } from './store/accountingStore';

export default function App() {
  const { transactions } = useStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">AI-Powered Accounting System</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <CurrencySelector />
            <TransactionImport />
            <ManualTransactionInput />
            <TransactionList />
          </div>
          
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <TrialBalance transactions={transactions} />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <BalanceSheet transactions={transactions} />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <IncomeStatement transactions={transactions} />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <CashFlow transactions={transactions} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}