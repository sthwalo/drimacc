import { create, StateCreator } from 'zustand';
import { TaxComplianceInfo } from '../types';

interface TaxState {
  complianceStatus: string;
  fetchComplianceStatus: () => void;
}

export const useTaxStore = create<TaxState>((set, get) => ({
  complianceStatus: 'Not Checked',
  fetchComplianceStatus: async () => {
    try {
      // Simulate fetching data
      const response = await fetch('/api/tax/compliance');
      const data = await response.json();
      set({ complianceStatus: data.status });
    } catch (error) {
      console.error('Failed to fetch compliance status', error);
      set({ complianceStatus: 'Error Fetching Status' });
    }
  }
}));