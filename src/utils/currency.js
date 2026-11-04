export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', locale: 'ja-JP', decimals: 0 },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', flag: '🇨🇦', locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', locale: 'en-AU' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', locale: 'en-IN' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', flag: '🇨🇭', locale: 'de-CH' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬', locale: 'en-SG' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪', locale: 'ar-AE' },
];

export const getCurrencyConfig = (code) => {
  return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
};

export const formatCurrency = (amount, currencyCode = 'USD', options = {}) => {
  const num = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const config = getCurrencyConfig(currencyCode);
  const decimals = options.decimals !== undefined ? options.decimals : (config.decimals !== undefined ? config.decimals : 2);

  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  } catch {
    return `${config.symbol}${num.toFixed(decimals)}`;
  }
};

export const formatNumber = (num, decimals = 2) => {
  const n = typeof num === 'number' && !isNaN(num) ? num : 0;
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

