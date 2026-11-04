import { useState, useEffect, useMemo, useCallback } from 'react';
import { calculateSplitBill } from '../utils/calculations';

const STORAGE_KEY_CALC = 'splitly_current_calc_v1';
const STORAGE_KEY_HIST = 'splitly_history_v1';
const STORAGE_KEY_CURR = 'splitly_currency_v1';

const INITIAL_STATE = {
  billAmount: '124.50',
  tipPercentage: 18,
  customTip: '',
  numberOfPeople: 3,
  currency: 'USD',
  includeTax: true,
  taxPercentage: '8.875',
  includeTip: true,
  additionalCharges: '0',
  roundUpOption: 'none',
};

export const useCalculator = () => {
  const [billAmount, setBillAmount] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CALC);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.billAmount ?? INITIAL_STATE.billAmount;
      } catch {}
    }
    return INITIAL_STATE.billAmount;
  });

  const [tipPercentage, setTipPercentage] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CALC);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.tipPercentage ?? INITIAL_STATE.tipPercentage;
      } catch {}
    }
    return INITIAL_STATE.tipPercentage;
  });

  const [numberOfPeople, setNumberOfPeople] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CALC);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.numberOfPeople ?? INITIAL_STATE.numberOfPeople;
      } catch {}
    }
    return INITIAL_STATE.numberOfPeople;
  });

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_CURR) || INITIAL_STATE.currency;
  });

  const [includeTax, setIncludeTax] = useState(INITIAL_STATE.includeTax);
  const [taxPercentage, setTaxPercentage] = useState(INITIAL_STATE.taxPercentage);
  const [includeTip, setIncludeTip] = useState(INITIAL_STATE.includeTip);
  const [additionalCharges, setAdditionalCharges] = useState(INITIAL_STATE.additionalCharges);
  const [roundUpOption, setRoundUpOption] = useState(INITIAL_STATE.roundUpOption);

  // History list
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Calculate live results
  const calculation = useMemo(() => {
    return calculateSplitBill({
      billAmount,
      tipPercentage,
      numberOfPeople,
      includeTax,
      taxPercentage,
      includeTip,
      additionalCharges,
      roundUpOption,
    });
  }, [
    billAmount,
    tipPercentage,
    numberOfPeople,
    includeTax,
    taxPercentage,
    includeTip,
    additionalCharges,
    roundUpOption,
  ]);

  // Persist current state
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_CALC,
        JSON.stringify({
          billAmount,
          tipPercentage,
          numberOfPeople,
        })
      );
    } catch {}
  }, [billAmount, tipPercentage, numberOfPeople]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURR, currency);
    } catch {}
  }, [currency]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HIST, JSON.stringify(history));
    } catch {}
  }, [history]);

  // Actions
  const handleSaveToHistory = useCallback((note = '') => {
    if (!calculation || calculation.subtotal <= 0) return null;
    const newEntry = {
      id: `calc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      note: note || `Bill split for ${calculation.numberOfPeople} people`,
      currency,
      billAmount,
      tipPercentage,
      numberOfPeople,
      includeTax,
      taxPercentage,
      includeTip,
      additionalCharges,
      roundUpOption,
      calculation,
    };
    setHistory((prev) => [newEntry, ...prev.slice(0, 19)]); // keep recent 20
    return newEntry;
  }, [
    calculation,
    currency,
    billAmount,
    tipPercentage,
    numberOfPeople,
    includeTax,
    taxPercentage,
    includeTip,
    additionalCharges,
    roundUpOption,
  ]);

  const handleDeleteHistory = useCallback((id) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const handleLoadFromHistory = useCallback((entry) => {
    if (!entry) return;
    setBillAmount(entry.billAmount || '0');
    setTipPercentage(entry.tipPercentage ?? 15);
    setNumberOfPeople(entry.numberOfPeople || 1);
    if (entry.currency) setCurrency(entry.currency);
    if (entry.includeTax !== undefined) setIncludeTax(entry.includeTax);
    if (entry.taxPercentage !== undefined) setTaxPercentage(entry.taxPercentage);
    if (entry.includeTip !== undefined) setIncludeTip(entry.includeTip);
    if (entry.additionalCharges !== undefined) setAdditionalCharges(entry.additionalCharges);
    if (entry.roundUpOption) setRoundUpOption(entry.roundUpOption);
  }, []);

  const resetCalculator = useCallback(() => {
    setBillAmount('100.00');
    setTipPercentage(18);
    setNumberOfPeople(2);
    setIncludeTax(false);
    setTaxPercentage('8.5');
    setIncludeTip(true);
    setAdditionalCharges('0');
    setRoundUpOption('none');
  }, []);

  return {
    billAmount,
    setBillAmount,
    tipPercentage,
    setTipPercentage,
    numberOfPeople,
    setNumberOfPeople,
    currency,
    setCurrency,
    includeTax,
    setIncludeTax,
    taxPercentage,
    setTaxPercentage,
    includeTip,
    setIncludeTip,
    additionalCharges,
    setAdditionalCharges,
    roundUpOption,
    setRoundUpOption,
    calculation,
    history,
    saveToHistory: handleSaveToHistory,
    deleteHistory: handleDeleteHistory,
    clearHistory: handleClearHistory,
    loadFromHistory: handleLoadFromHistory,
    resetCalculator,
  };
};

