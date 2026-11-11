import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  Percent, 
  Users, 
  Plus, 
  Minus, 
  RotateCcw, 
  Copy, 
  Share2, 
  FileDown, 
  BookmarkPlus, 
  Receipt, 
  Sparkles, 
  Check, 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import confetti from 'canvas-confetti';
import { formatCurrency, getCurrencyConfig } from '../utils/currency';
import { shareCalculation, copyToClipboard } from '../utils/receipt';

export const Calculator = ({
  calcState,
  onNotify,
  onOpenReceiptModal,
}) => {
  const {
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
    saveToHistory,
    resetCalculator,
  } = calcState;

  const [customTipMode, setCustomTipMode] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const currencyConfig = getCurrencyConfig(currency);

  const tipPresets = [5, 10, 15, 18, 20, 25];
  const billPresets = [30, 60, 100, 150, 250];

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#a855f7', '#06b6d4', '#ec4899', '#3b82f6'],
      });
    } catch {}
  };

  const handleCopy = async () => {
    const text = `Splid Bill Summary: Total ${formatCurrency(calculation.finalTotal, currency)} split across ${calculation.numberOfPeople} people = ${formatCurrency(calculation.amountPerPerson, currency)}/person (Subtotal: ${formatCurrency(calculation.subtotal, currency)}, Tip: ${formatCurrency(calculation.tipAmount, currency)} @ ${calculation.tipPercentage}%).`;
    await copyToClipboard(text);
    setCopied(true);
    triggerConfetti();
    if (onNotify) onNotify('Copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shared = await shareCalculation({ calculation, currency }, () => {
      if (onNotify) onNotify('Bill breakdown copied to share!', 'info');
    });
    if (shared && onNotify) {
      onNotify('Bill shared successfully!', 'success');
    }
  };

  const handleSave = () => {
    const saved = saveToHistory();
    if (saved) {
      triggerConfetti();
      if (onNotify) onNotify('Calculation saved to your history!', 'success');
    }
  };

  const handleReset = () => {
    resetCalculator();
    if (onNotify) onNotify('Calculator reset to default', 'info');
  };

  const chartData = [
    { name: 'Subtotal', value: calculation.subtotal, color: '#8b5cf6' },
    { name: 'Tip', value: calculation.tipAmount, color: '#06b6d4' },
    ...(calculation.taxAmount > 0 ? [{ name: 'Tax', value: calculation.taxAmount, color: '#ec4899' }] : []),
    ...(calculation.additionalCharges > 0 ? [{ name: 'Fees', value: calculation.additionalCharges, color: '#f59e0b' }] : []),
  ].filter(item => item.value > 0);

  return (
    <section id="calculator" className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-teal-500/20 text-xs font-semibold text-teal-700 dark:text-teal-300 mb-3">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Split Dashboard</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            Precision Calculation.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
              Zero Confusion.
            </span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Adjust tip rates, bill charges, and people with real-time reactive feedback.
          </p>
        </div>

        {/* Two-Column Glassmorphism Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT PANEL: Bill Details */}
          <div className="lg:col-span-7 glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-white/10 dark:border-white/10 relative overflow-hidden">
            {/* Ambient accent glow in card background */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none" />

            {/* Bill Amount Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-teal-500" />
                  <span>Bill Amount</span>
                </label>
                <span className="text-xs text-slate-500 font-mono">
                  Currency: <strong className="text-slate-700 dark:text-slate-200">{currencyConfig.code} ({currencyConfig.symbol})</strong>
                </span>
              </div>

              {/* Large Input with currency badge */}
              <div className="relative flex items-center">
                <div className="absolute left-4 text-2xl font-bold text-teal-600 dark:text-teal-400 font-mono select-none">
                  {currencyConfig.symbol}
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full glass-input text-2xl sm:text-3xl font-bold pl-12 pr-12 py-3.5 rounded-2xl text-slate-900 dark:text-white font-mono tracking-tight placeholder-slate-400/50"
                />
                {billAmount && (
                  <button
                    onClick={() => setBillAmount('')}
                    className="absolute right-4 text-xs font-mono px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Quick Preset Amount Pills */}
              <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1 text-xs">
                <span className="text-slate-500 dark:text-slate-400 text-[11px] shrink-0 font-medium">Quick set:</span>
                {billPresets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setBillAmount(preset.toFixed(2))}
                    className="px-2.5 py-1 rounded-lg glass-input text-slate-700 dark:text-slate-300 hover:text-teal-400 hover:border-teal-500/30 text-xs font-mono transition-colors shrink-0"
                  >
                    {currencyConfig.symbol}{preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Tip Percentage Section */}
            <div className="mt-8 space-y-4 pt-6 border-t border-white/5 dark:border-white/5 border-slate-200/50">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5">
                  <Percent className="w-4 h-4 text-cyan-400" />
                  <span>Tip Percentage</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Selected:</span>
                  <span className="font-mono font-bold text-sm text-cyan-500 dark:text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                    {tipPercentage}%
                  </span>
                </div>
              </div>

              {/* Tip Preset Buttons */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {tipPresets.map((pct) => {
                  const isActive = !customTipMode && Number(tipPercentage) === pct;
                  return (
                    <button
                      key={pct}
                      onClick={() => {
                        setCustomTipMode(false);
                        setTipPercentage(pct);
                      }}
                      className={`py-2.5 px-3 rounded-xl text-sm font-bold font-mono transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-neu-glow-teal scale-[1.03]'
                          : 'glass-input text-slate-700 dark:text-slate-200 hover:border-teal-500/40 hover:bg-white/10'
                      }`}
                    >
                      {pct}%
                    </button>
                  );
                })}
              </div>

              {/* Interactive Tip Slider & Custom Input */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={tipPercentage}
                    onChange={(e) => {
                      setTipPercentage(Number(e.target.value));
                    }}
                    className="w-full cursor-pointer"
                  />
                  <div className="w-20 shrink-0 relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={tipPercentage}
                      onChange={(e) => setTipPercentage(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
                      className="w-full glass-input text-center py-1.5 rounded-xl text-sm font-mono font-bold text-slate-900 dark:text-white"
                    />
                    <span className="absolute right-2 top-2 text-xs font-mono text-slate-400 select-none">%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>0% (No Tip)</span>
                  <span>15% (Standard)</span>
                  <span>25% (Generous)</span>
                  <span>50% (Max)</span>
                </div>
              </div>
            </div>

            {/* Number of People Section */}
            <div className="mt-8 space-y-4 pt-6 border-t border-white/5 dark:border-white/5 border-slate-200/50">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-electric-pink" />
                  <span>Number of People</span>
                </label>
                <span className="text-xs font-mono text-slate-500">
                  Splitting {numberOfPeople} {Number(numberOfPeople) === 1 ? 'way' : 'ways'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setNumberOfPeople(Math.max(1, Number(numberOfPeople) - 1))}
                  disabled={Number(numberOfPeople) <= 1}
                  className="w-12 h-12 rounded-2xl glass-input flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-white hover:border-teal-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease people"
                >
                  <Minus className="w-5 h-5" />
                </button>

                <div className="flex-1 relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={numberOfPeople}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setNumberOfPeople(isNaN(val) || val < 1 ? 1 : Math.min(100, val));
                    }}
                    className="w-full glass-input text-center text-2xl font-bold py-2 rounded-2xl text-slate-900 dark:text-white font-mono"
                  />
                  <span className="absolute right-3.5 top-3.5 text-xs font-mono text-slate-400 hidden sm:inline">
                    {Number(numberOfPeople) === 1 ? 'person' : 'people'}
                  </span>
                </div>

                <button
                  onClick={() => setNumberOfPeople(Math.min(100, Number(numberOfPeople) + 1))}
                  className="w-12 h-12 rounded-2xl glass-input flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-white hover:border-teal-500/40 transition-colors"
                  aria-label="Increase people"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Dynamic avatars preview */}
              <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
                {Array.from({ length: Math.min(10, Number(numberOfPeople)) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-cyan-500 flex items-center justify-center text-white text-[11px] font-bold shadow-sm ring-2 ring-midnight-950 shrink-0"
                    title={`Guest ${i + 1}`}
                  >
                    P{i + 1}
                  </div>
                ))}
                {Number(numberOfPeople) > 10 && (
                  <div className="text-xs font-mono text-slate-400 px-2">
                    +{Number(numberOfPeople) - 10} more
                  </div>
                )}
              </div>
            </div>

            {/* Additional Options Accordion Toggle */}
            <div className="mt-8 pt-6 border-t border-white/5 dark:border-white/5 border-slate-200/50">
              <button
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="w-full flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-600 dark:text-slate-300 font-bold hover:text-teal-400 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-400" />
                  <span>Advanced Options (Tax, Extra Charges, Round-Up)</span>
                </span>
                {showAdvancedOptions ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              <AnimatePresence>
                {showAdvancedOptions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 pt-4 overflow-hidden"
                  >
                    {/* Tax Option */}
                    <div className="p-3.5 rounded-2xl glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="taxCheckbox"
                          checked={includeTax}
                          onChange={(e) => setIncludeTax(e.target.checked)}
                          className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
                        />
                        <label htmlFor="taxCheckbox" className="text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer">
                          Include Tax / VAT in bill
                        </label>
                      </div>

                      {includeTax && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-mono">Tax rate:</span>
                          <div className="relative w-24">
                            <input
                              type="number"
                              step="0.1"
                              value={taxPercentage}
                              onChange={(e) => setTaxPercentage(e.target.value)}
                              placeholder="8.5"
                              className="w-full glass-input text-right pr-6 py-1 rounded-xl text-xs font-mono font-bold"
                            />
                            <span className="absolute right-2 top-1 text-xs text-slate-400 font-mono">%</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Additional Custom Charges */}
                    <div className="p-3.5 rounded-2xl glass-panel flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="text-xs font-medium text-slate-700 dark:text-slate-200">
                        Additional Fees (Delivery, Service Fee, Corkage)
                      </div>
                      <div className="relative w-32">
                        <span className="absolute left-2.5 top-1 text-xs font-mono text-slate-400">{currencyConfig.symbol}</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={additionalCharges}
                          onChange={(e) => setAdditionalCharges(e.target.value)}
                          placeholder="0.00"
                          className="w-full glass-input text-right pl-6 pr-2 py-1 rounded-xl text-xs font-mono font-bold"
                        />
                      </div>
                    </div>

                    {/* Round Up Selector */}
                    <div className="p-3.5 rounded-2xl glass-panel space-y-2">
                      <div className="text-xs font-medium text-slate-700 dark:text-slate-200">
                        Round-Up Settings
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        {[
                          { id: 'none', label: 'Exact Cents' },
                          { id: 'nearest-dollar', label: 'Nearest $1' },
                          { id: 'nearest-five', label: 'Nearest $5' },
                          { id: 'per-person-dollar', label: 'Even Person' },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setRoundUpOption(opt.id)}
                            className={`py-2 px-2 rounded-xl text-[11px] font-semibold transition-all ${
                              roundUpOption === opt.id
                                ? 'bg-teal-600/30 border border-teal-500/50 text-teal-300 font-bold'
                                : 'glass-input text-slate-600 dark:text-slate-300 hover:bg-white/10'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT PANEL: Calculation Results Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-teal-500/30 relative overflow-hidden shadow-glass-glow">
              {/* Radial gradient backing */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-teal-600/20 to-cyan-500/20 blur-3xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 dark:border-white/10 border-slate-200/50">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                    Calculation Results
                  </span>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-teal-300">
                  {calculation.numberOfPeople} {calculation.numberOfPeople === 1 ? 'Guest' : 'Guests'}
                </div>
              </div>

              {/* HERO HIGHLIGHT: Amount Per Person */}
              <div className="my-6 p-5 rounded-2xl bg-gradient-to-br from-teal-900/40 via-midnight-900/80 to-midnight-950/80 border border-teal-500/30 text-center relative group">
                <span className="text-xs font-mono uppercase tracking-wider text-teal-300 font-semibold block mb-1">
                  Amount Per Person
                </span>
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono flex items-center justify-center gap-1">
                  <span className="text-2xl sm:text-3xl text-teal-400 font-bold">{currencyConfig.symbol}</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-white to-cyan-300">
                    {calculation.amountPerPerson.toFixed(currencyConfig.decimals ?? 2)}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-2 flex items-center justify-center gap-2">
                  <span>Base: {formatCurrency(calculation.subtotalPerPerson, currency)}</span>
                  <span>•</span>
                  <span>Tip: {formatCurrency(calculation.tipPerPerson, currency)}</span>
                </div>
              </div>

              {/* Breakdown Rows */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between py-1 text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Bill Subtotal</span>
                  <span className="font-semibold">{formatCurrency(calculation.subtotal, currency)}</span>
                </div>

                <div className="flex items-center justify-between py-1 text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400">Tip ({calculation.tipPercentage}%)</span>
                  <span className="font-semibold text-cyan-400">
                    +{formatCurrency(calculation.tipAmount, currency)}
                  </span>
                </div>

                {calculation.taxAmount > 0 && (
                  <div className="flex items-center justify-between py-1 text-slate-600 dark:text-slate-300">
                    <span className="text-slate-400">Tax / VAT</span>
                    <span className="font-semibold text-pink-400">
                      +{formatCurrency(calculation.taxAmount, currency)}
                    </span>
                  </div>
                )}

                {calculation.additionalCharges > 0 && (
                  <div className="flex items-center justify-between py-1 text-slate-600 dark:text-slate-300">
                    <span className="text-slate-400">Additional Fees</span>
                    <span className="font-semibold text-amber-400">
                      +{formatCurrency(calculation.additionalCharges, currency)}
                    </span>
                  </div>
                )}

                {calculation.roundUpDifference > 0 && (
                  <div className="flex items-center justify-between py-1 text-slate-600 dark:text-slate-300">
                    <span className="text-slate-400">Round-Up ({calculation.roundUpOption})</span>
                    <span className="font-semibold text-emerald-400">
                      +{formatCurrency(calculation.roundUpDifference, currency)}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-white/10 dark:border-white/10 flex items-center justify-between text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  <span>Grand Total</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 text-lg">
                    {formatCurrency(calculation.finalTotal, currency)}
                  </span>
                </div>
              </div>

              {/* Visual Mini Chart Breakdown */}
              {chartData.length > 0 && calculation.finalTotal > 0 && (
                <div className="mt-5 pt-4 border-t border-white/5 dark:border-white/5">
                  <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Expense Distribution</span>
                    <span className="text-[10px] text-teal-300">Interactive</span>
                  </div>
                  <div className="h-28 w-full flex items-center">
                    <ResponsiveContainer width="50%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          innerRadius={24}
                          outerRadius={44}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(val) => formatCurrency(val, currency)}
                          contentStyle={{
                            background: '#0b0f1d',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            fontSize: '11px',
                            color: '#fff',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="w-[50%] pl-2 space-y-1.5 text-[10px] font-mono">
                      {chartData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-slate-400">
                            <span className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                            <span>{item.name}</span>
                          </span>
                          <span className="font-semibold text-slate-200">
                            {formatCurrency(item.value, currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons Grid */}
              <div className="mt-6 pt-5 border-t border-white/10 dark:border-white/10 space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl glass-input text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-white hover:border-teal-500/50 transition-all hover:bg-white/10"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-teal-400" />}
                    <span>{copied ? 'Copied!' : 'Copy Results'}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl glass-input text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-white hover:border-cyan-500/50 transition-all hover:bg-white/10"
                  >
                    <Share2 className="w-4 h-4 text-cyan-400" />
                    <span>Share Split</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl glass-input text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-teal-300 hover:bg-white/10 transition-colors"
                    title="Save calculation to history"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </button>

                  <button
                    onClick={onOpenReceiptModal}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl glass-input text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-300 hover:bg-white/10 transition-colors"
                    title="View & Download PDF Receipt"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Receipt</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl glass-input text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-red-400 hover:bg-white/10 transition-colors"
                    title="Reset to default values"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

