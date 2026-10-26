import { CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  PKR: {
    code: 'PKR',
    symbol: 'Rs.',
    name: 'Pakistani Rupee',
    exchangeRateFromPKR: 1,
    format: (amount: number) => `Rs. ${Math.round(amount).toLocaleString('en-PK')}`,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    exchangeRateFromPKR: 0.0036, // ~278 PKR per USD
    format: (amount: number) => `$${(amount * 0.0036).toFixed(2)}`,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    exchangeRateFromPKR: 0.0033, // ~303 PKR per EUR
    format: (amount: number) => `€${(amount * 0.0033).toFixed(2)}`,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    exchangeRateFromPKR: 0.0028, // ~357 PKR per GBP
    format: (amount: number) => `£${(amount * 0.0028).toFixed(2)}`,
  },
};

export function convertAndFormatPrice(amountPKR: number, currencyCode: CurrencyCode): string {
  const config = CURRENCIES[currencyCode] || CURRENCIES.PKR;
  return config.format(amountPKR);
}
