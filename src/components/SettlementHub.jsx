import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  HandCoins, 
  Copy, 
  Check, 
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency } from '../utils/currency';
import { copyToClipboard } from '../utils/receipt';

export const SettlementHub = ({
  simplifiedDebts = [],
  currency = 'INR',
  onSettleDebt,
  onNotify,
}) => {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyReminder = async (debt) => {
    const text = `Hey ${debt.fromName}! To settle up our group expenses, please send ${formatCurrency(debt.amount, currency)} to ${debt.toName}. Powered by Splid.`;
    await copyToClipboard(text);
    setCopiedId(debt.id);
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    } catch {}
    if (onNotify) onNotify(`Copied payment reminder for ${debt.fromName}!`, 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="settlements" className="py-3 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neu-inset text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-500" />
              <span>Smart Debt Simplification</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans flex items-center gap-2">
              <span>Who Pays Whom</span>
              <span className="text-[11px] font-mono font-normal text-slate-500 dark:text-slate-400 py-0.5 px-2.5 rounded-full neu-inset">
                Minimum Cash Flow
              </span>
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Splid simplifies multiple entangled debts down to the fewest direct payments.
            </p>
          </div>
        </div>

        {/* Debt Cards Grid or All-Settled Card */}
        {simplifiedDebts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 sm:p-10 rounded-3xl neu-flat text-center relative overflow-hidden"
          >
            <div className="w-16 h-16 rounded-2xl neu-icon-socket flex items-center justify-center mx-auto text-emerald-500 dark:text-emerald-400 mb-3.5">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mb-1.5">
              All Debts Are Fully Settled Up!
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Every member has paid their fair share and no outstanding balances remain in this group. You're completely square!
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <AnimatePresence>
              {simplifiedDebts.map((debt) => (
                <motion.div
                  key={debt.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="neu-flat p-5 sm:p-6 rounded-3xl relative overflow-hidden group hover:-translate-y-1 transition-all"
                >
                  {/* Visual Pathway: Debtor -> Arrow -> Creditor */}
                  <div className="flex items-center justify-between gap-2 sm:gap-3 mb-4">
                    {/* Debtor */}
                    <div className="flex flex-col items-center text-center w-24 sm:w-28">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${debt.fromColor || 'from-[#f07864] to-rose-600'} flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-white/20 mb-1.5`}>
                        {debt.fromName.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-full">
                        {debt.fromName}
                      </span>
                      <span className="text-[10px] font-mono text-rose-500 dark:text-rose-400 font-semibold uppercase">
                        Owes
                      </span>
                    </div>

                    {/* Glowing Neumorphic Transfer Indicator */}
                    <div className="flex flex-col items-center justify-center flex-1 px-1">
                      <div className="w-full flex items-center justify-center relative">
                        <div className="h-[2px] w-full bg-gradient-to-r from-rose-500/40 via-teal-500 to-emerald-500/40" />
                        <div className="absolute p-1.5 rounded-full neu-icon-disc text-teal-600 dark:text-teal-400">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 mt-2.5 font-medium">
                        pays
                      </span>
                    </div>

                    {/* Creditor */}
                    <div className="flex flex-col items-center text-center w-24 sm:w-28">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${debt.toColor || 'from-teal-500 to-cyan-600'} flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-white/20 mb-1.5`}>
                        {debt.toName.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-full">
                        {debt.toName}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold uppercase">
                        Gets
                      </span>
                    </div>
                  </div>

                  {/* Neumorphic Recessed Amount Banner */}
                  <div className="neu-sunken p-3.5 rounded-2xl text-center mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
                      Transfer Amount
                    </span>
                    <div className="text-xl sm:text-2xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-teal-300 dark:to-cyan-300">
                      {formatCurrency(debt.amount, currency)}
                    </div>
                  </div>

                  {/* Tactile Action Buttons */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => onSettleDebt(debt)}
                      className="neu-btn-primary flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold"
                    >
                      <HandCoins className="w-3.5 h-3.5" />
                      <span>Settle Up</span>
                    </button>

                    <button
                      onClick={() => handleCopyReminder(debt)}
                      className="neu-btn p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400"
                      title="Copy payment reminder"
                    >
                      {copiedId === debt.id ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};
