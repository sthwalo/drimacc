import React, { useEffect } from 'react';
import { useTaxStore } from '../../store/taxStore';

const TaxCompliance = () => {
  const { complianceStatus, fetchComplianceStatus } = useTaxStore();

  useEffect(() => {
    fetchComplianceStatus();
  }, [fetchComplianceStatus]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold">Tax Compliance Status</h2>
      <p>Status: {complianceStatus}</p>
    </div>
  );
};

export default TaxCompliance;