export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', locale: 'en-IN' },
];

export const getCurrencyConfig = () => {
  return CURRENCIES[0];
};

export const formatCurrency = (amount, _currencyCode = 'INR', options = {}) => {
  const num = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const decimals = options.decimals !== undefined ? options.decimals : 2;

  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  } catch {
    return `₹${num.toFixed(decimals)}`;
  }
};

export const formatNumber = (num, decimals = 2) => {
  const n = typeof num === 'number' && !isNaN(num) ? num : 0;
  return n.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};
