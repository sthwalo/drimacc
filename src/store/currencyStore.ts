import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CurrencyState {
  defaultCurrency: string;
  exchangeRates: Record<string, number>;
  setDefaultCurrency: (currency: string) => void;
  updateExchangeRate: (currency: string, rate: number) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      defaultCurrency: 'ZAR',
      exchangeRates: {
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        JPY: 110.0,
        CNY: 6.45,
        ZAR: 15.0,
      },
      setDefaultCurrency: (currency) => set({ defaultCurrency: currency }),
      updateExchangeRate: (currency, rate) =>
        set((state) => ({
          exchangeRates: { ...state.exchangeRates, [currency]: rate },
        })),
    }),
    {
      name: 'currency-storage',
    }
  )
);