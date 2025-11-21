import { useMemo } from 'react';
import { useCurrency } from './useCurrency';

const CURRENCY_SYMBOLS: { [key: string]: string } = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'CA$',
  AUD: 'A$',
  JPY: '¥',
  INR: '₹',
  CNY: '¥',
};

/**
 * Hook to get the currency symbol for the user's preferred currency
 */
export function useCurrencySymbol(): string {
  const currency = useCurrency();
  
  return useMemo(() => {
    return CURRENCY_SYMBOLS[currency] || '$';
  }, [currency]);
}
