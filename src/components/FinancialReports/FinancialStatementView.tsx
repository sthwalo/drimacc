import React from 'react';
import type { FinancialStatement } from '../../core/accounting/reports/FinancialStatements';

interface Props {
  statement: FinancialStatement;
  title: string;
}

export const FinancialStatementView: React.FC<Props> = ({ statement, title }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-gray-600 mb-4">Period: {statement.date}</p>

      <div className="space-y-6">
        {statement.items.map((item, index) => (
          <div key={index} className="border-b border-gray-200 pb-4">
            <div className="flex justify-between font-semibold text-lg">
              <span>{item.name}</span>
              <span>${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>

            {item.subItems && (
              <div className="mt-2 space-y-1">
                {item.subItems.map((subItem, subIndex) => (
                  <div key={subIndex} className="flex justify-between text-gray-600 pl-4">
                    <span>{subItem.name}</span>
                    <span>${subItem.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t-2 border-gray-200">
        <h3 className="text-lg font-semibold mb-2">Totals</h3>
        {Object.entries(statement.totals).map(([key, value]) => (
          <div key={key} className="flex justify-between text-gray-800">
            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
            <span className="font-semibold">
              ${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}