import React, { useState } from 'react';
import { useStore } from '../../store/accountingStore';
import { BalanceSheet } from './BalanceSheet';
import { IncomeStatement } from './IncomeStatement';
import { CashFlow } from './CashFlow';

export function FinancialReports() {
  const [activeTab, setActiveTab] = useState('balance');
  const { transactions } = useStore();

  const tabs = [
    { id: 'balance', name: 'Balance Sheet' },
    { id: 'income', name: 'Income Statement' },
    { id: 'cash', name: 'Cash Flow' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'balance' && <BalanceSheet transactions={transactions} />}
        {activeTab === 'income' && <IncomeStatement transactions={transactions} />}
        {activeTab === 'cash' && <CashFlow transactions={transactions} />}
      </div>
    </div>
  );
}