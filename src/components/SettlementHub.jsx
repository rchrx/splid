import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
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
  currency = 'USD',
  onSettleDebt,
  onNotify,
}) => {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyReminder = async (debt) => {
    const text = `Hey ${debt.fromName}! To settle up our group expenses, please send ${formatCurrency(debt.amount, currency)} to ${debt.toName}. Powered by Dibbl.`;
    await copyToClipboard(text);
    setCopiedId(debt.id);
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    } catch {}
    if (onNotify) onNotify(`Copied payment reminder for ${debt.fromName}!`, 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="settlements" className="py-6 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border-cyan-500/20 text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
              <span>Smart Debt Simplification</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans flex items-center gap-2">
              <span>Who Pays Whom</span>
              <span className="text-[11px] font-mono font-normal text-slate-500 dark:text-slate-400 py-0.5 px-2.5 rounded-full bg-slate-200/50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                Minimum Cash Flow
              </span>
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Dibbl simplifies multiple entangled debts down to the fewest direct payments.
            </p>
          </div>
        </div>

        {/* Debt Cards Grid or All-Settled Card */}
        {simplifiedDebts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 sm:p-10 rounded-3xl glass-panel-elevated border border-emerald-500/30 bg-emerald-500/[0.04] text-center relative overflow-hidden shadow-glass"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500 dark:text-emerald-400 mb-3 shadow-neon-cyan">
              <CheckCircle2 className="w-7 h-7" />
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
                  className="glass-panel-elevated p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-white/10 relative overflow-hidden group hover:border-purple-500/40 hover:shadow-glass-glow transition-all"
                >
                  {/* Visual Pathway: Debtor -> Arrow -> Creditor */}
                  <div className="flex items-center justify-between gap-2 sm:gap-3 mb-4">
                    {/* Debtor */}
                    <div className="flex flex-col items-center text-center w-24 sm:w-28">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${debt.fromColor || 'from-purple-500 to-indigo-600'} flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-white/10 mb-1.5`}>
                        {debt.fromName.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-full">
                        {debt.fromName}
                      </span>
                      <span className="text-[10px] font-mono text-rose-500 dark:text-rose-400 font-semibold uppercase">
                        Owes
                      </span>
                    </div>

                    {/* Glowing Transfer Indicator */}
                    <div className="flex flex-col items-center justify-center flex-1 px-1">
                      <div className="w-full flex items-center justify-center relative">
                        <div className="h-[2px] w-full bg-gradient-to-r from-rose-500/40 via-purple-500 to-emerald-500/40" />
                        <div className="absolute p-1.5 rounded-full bg-white dark:bg-midnight-950 border border-purple-500/40 text-electric-purple shadow-sm">
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 mt-2 font-medium">
                        pays
                      </span>
                    </div>

                    {/* Creditor */}
                    <div className="flex flex-col items-center text-center w-24 sm:w-28">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${debt.toColor || 'from-cyan-500 to-blue-600'} flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-white/10 mb-1.5`}>
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

                  {/* Settlement Amount Banner */}
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-midnight-950/60 border border-slate-200 dark:border-white/5 text-center mb-3.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                      Transfer Amount
                    </span>
                    <div className="text-xl sm:text-2xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
                      {formatCurrency(debt.amount, currency)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSettleDebt(debt)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-95 shadow-glass-glow transition-all active:scale-[0.98]"
                    >
                      <HandCoins className="w-3.5 h-3.5" />
                      <span>Settle Up</span>
                    </button>

                    <button
                      onClick={() => handleCopyReminder(debt)}
                      className="p-2 rounded-xl glass-input text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-purple-400/50 transition-colors"
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
