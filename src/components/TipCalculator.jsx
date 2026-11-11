import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Smile, 
  SmilePlus, 
  Meh, 
  Frown, 
  Flame, 
  ThumbsUp, 
  Coins, 
  Check, 
  Copy,
  SlidersHorizontal
} from 'lucide-react';
import { formatCurrency, getCurrencyConfig } from '../utils/currency';
import { copyToClipboard } from '../utils/receipt';

export const TipCalculator = ({ currency = 'USD', onNotify }) => {
  const currencyConfig = getCurrencyConfig(currency);

  const [bill, setBill] = useState('85.00');
  const [tipRate, setTipRate] = useState(18);
  const [people, setPeople] = useState(2);
  const [selectedQuality, setSelectedQuality] = useState('good');
  const [copied, setCopied] = useState(false);

  const qualityPresets = [
    { id: 'poor', label: 'Poor', rate: 10, icon: Frown, desc: 'Below expectations', color: 'from-amber-600 to-rose-600', ring: 'hover:border-rose-400' },
    { id: 'average', label: 'Average', rate: 15, icon: Meh, desc: 'Met basic expectations', color: 'from-amber-500 to-yellow-500', ring: 'hover:border-amber-400' },
    { id: 'good', label: 'Good', rate: 18, icon: Smile, desc: 'Great service & polite', color: 'from-cyan-500 to-blue-500', ring: 'hover:border-cyan-400' },
    { id: 'excellent', label: 'Excellent', rate: 20, icon: SmilePlus, desc: 'Attentive, swift, exceptional', color: 'from-teal-500 to-emerald-600', ring: 'hover:border-teal-400' },
    { id: 'outstanding', label: 'VIP / Superb', rate: 25, icon: Flame, desc: 'Unmatched 5-star experience', color: 'from-pink-500 to-rose-500', ring: 'hover:border-pink-400' },
  ];

  const billNum = Math.max(0, parseFloat(bill) || 0);
  const tipAmount = (billNum * tipRate) / 100;
  const grandTotal = billNum + tipAmount;
  const splitWays = Math.max(1, parseInt(people, 10) || 1);
  const perPerson = grandTotal / splitWays;
  const tipPerPerson = tipAmount / splitWays;

  const handleSelectQuality = (preset) => {
    setSelectedQuality(preset.id);
    setTipRate(preset.rate);
  };

  const handleCopy = async () => {
    const text = `Tip Calculation: Bill ${formatCurrency(billNum, currency)} with a ${tipRate}% tip (${formatCurrency(tipAmount, currency)}) = Total ${formatCurrency(grandTotal, currency)} (${formatCurrency(perPerson, currency)}/person across ${splitWays} people).`;
    await copyToClipboard(text);
    setCopied(true);
    if (onNotify) onNotify('Tip breakdown copied!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="tip-calculator" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background glow orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-r from-teal-700/10 via-cyan-700/10 to-emerald-700/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-teal-500/20 text-xs font-semibold text-teal-700 dark:text-teal-300 mb-3">
            <SlidersHorizontal className="w-3.5 h-3.5 text-teal-500" />
            <span>Dedicated Service Experience Mode</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            Reward Exceptional Service.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
              Without the Guesswork.
            </span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Select your service satisfaction level and let Splid calculate the ideal gratuity with instant visual feedback.
          </p>
        </div>

        {/* Tip Dashboard Container */}
        <div className="max-w-4xl mx-auto glass-panel-elevated p-6 sm:p-10 rounded-3xl border border-white/10 dark:border-white/10 shadow-2xl relative">
          {/* Quality Presets Selector Cards */}
          <div className="mb-8">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3 font-bold">
              Rate Dining & Service Experience
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {qualityPresets.map((preset) => {
                const Icon = preset.icon;
                const isSelected = selectedQuality === preset.id || Number(tipRate) === preset.rate;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectQuality(preset)}
                    className={`p-3.5 rounded-2xl text-left transition-all duration-200 border ${
                      isSelected
                        ? `bg-gradient-to-br ${preset.color} text-white shadow-lg scale-[1.03] border-white/30`
                        : 'glass-input text-slate-700 dark:text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                      <span className="text-xs font-mono font-bold">{preset.rate}%</span>
                    </div>
                    <div className="text-sm font-bold truncate">{preset.label}</div>
                    <div className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                      {preset.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Dual Slider & Input Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Bill Input */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block">
                Bill Subtotal
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-lg font-bold font-mono text-teal-400">
                  {currencyConfig.symbol}
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={bill}
                  onChange={(e) => setBill(e.target.value)}
                  placeholder="0.00"
                  className="w-full glass-input text-xl font-bold font-mono pl-10 pr-4 py-3 rounded-2xl text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Custom Tip Rate Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Custom Gratuity Slider
                </label>
                <span className="font-mono text-sm font-bold text-teal-500 dark:text-teal-400">{tipRate}%</span>
              </div>
              <div className="pt-2">
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={tipRate}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTipRate(val);
                    setSelectedQuality(null);
                  }}
                  className="w-full cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>0% (Zero)</span>
                  <span>15% (Std)</span>
                  <span>20% (Great)</span>
                  <span>30%+ (Exceptional)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Result Highlight Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-900/30 via-slate-900/50 to-midnight-950/70 border border-teal-500/30">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Tip Amount ({tipRate}%)
                </span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-cyan-400">
                  {formatCurrency(tipAmount, currency)}
                </div>
                <div className="text-[11px] font-mono text-slate-500 mt-1">
                  {formatCurrency(tipPerPerson, currency)} / person
                </div>
              </div>

              <div className="border-y sm:border-y-0 sm:border-x border-white/10 dark:border-white/10 py-4 sm:py-0">
                <span className="text-[11px] font-mono uppercase tracking-wider text-teal-300 font-semibold block mb-1">
                  Total With Tip
                </span>
                <div className="text-3xl sm:text-4xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-white to-cyan-300">
                  {formatCurrency(grandTotal, currency)}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  Bill: {formatCurrency(billNum, currency)}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Amount Per Person ({splitWays} {splitWays === 1 ? 'way' : 'ways'})
                </span>
                <div className="text-2xl sm:text-3xl font-black font-mono text-[#f07864]">
                  {formatCurrency(perPerson, currency)}
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <button
                    onClick={() => setPeople(Math.max(1, splitWays - 1))}
                    className="w-6 h-6 rounded-lg glass-input text-xs font-bold text-slate-400 hover:text-white"
                  >
                    -
                  </button>
                  <span className="text-xs font-mono font-bold text-slate-200">{splitWays} guests</span>
                  <button
                    onClick={() => setPeople(splitWays + 1)}
                    className="w-6 h-6 rounded-lg glass-input text-xs font-bold text-slate-400 hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Copy Result button */}
            <div className="mt-6 pt-4 border-t border-white/10 flex justify-center">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl glass-input text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-white hover:border-teal-500/40 hover:bg-white/10 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-teal-400" />}
                <span>{copied ? 'Copied Tip Summary!' : 'Copy Tip Summary'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

