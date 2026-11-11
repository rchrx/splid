import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  HandCoins, 
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { getCurrencyConfig, formatCurrency } from '../utils/currency';

export const SettleUpModal = ({
  isOpen,
  onClose,
  members = [],
  initialDebt = null,
  currency = 'INR',
  onRecordSettlement,
  onNotify,
}) => {
  if (!isOpen) return null;

  const currencyConfig = getCurrencyConfig(currency);

  const [fromMemberId, setFromMemberId] = useState(initialDebt?.fromId || members[0]?.id || '');
  const [toMemberId, setToMemberId] = useState(initialDebt?.toId || members[1]?.id || '');
  const [amount, setAmount] = useState(initialDebt ? initialDebt.amount.toString() : '');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState('Settled via Splid');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialDebt) {
      setFromMemberId(initialDebt.fromId);
      setToMemberId(initialDebt.toId);
      setAmount(initialDebt.amount.toString());
    } else if (members.length >= 2) {
      setFromMemberId(members[0].id);
      setToMemberId(members[1].id);
    }
  }, [initialDebt, members]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = parseFloat(amount) || 0;
    if (fromMemberId === toMemberId) {
      setError('Payer and recipient cannot be the same person');
      return;
    }
    if (numAmount <= 0) {
      setError('Please enter a valid settlement amount greater than 0');
      return;
    }

    onRecordSettlement({
      fromMemberId,
      toMemberId,
      amount: numAmount,
      date,
      note: note.trim(),
    });

    try {
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    } catch {}

    const fromName = members.find((m) => m.id === fromMemberId)?.name || 'Payer';
    const toName = members.find((m) => m.id === toMemberId)?.name || 'Recipient';

    if (onNotify) onNotify(`Recorded ${formatCurrency(numAmount, currency)} payment from ${fromName} to ${toName}!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Neumorphic Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative w-full max-w-md neu-raised text-slate-800 dark:text-slate-100 p-5 sm:p-7 rounded-3xl z-10 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-300/60 dark:border-white/5 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neu-icon-socket flex items-center justify-center text-cyan-600 dark:text-cyan-400">
              <HandCoins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Record Settlement
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log a direct reimbursement payment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="neu-btn p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl neu-sunken border-l-4 border-l-red-500 text-red-600 dark:text-red-300 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Transfer Visual Selectors */}
          <div className="p-3.5 rounded-2xl neu-sunken space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  Payer (Who Paid)
                </label>
                <select
                  value={fromMemberId}
                  onChange={(e) => setFromMemberId(e.target.value)}
                  className="w-full neu-input px-3 py-2 rounded-xl text-xs font-bold focus:outline-none"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  Recipient (Who Received)
                </label>
                <select
                  value={toMemberId}
                  onChange={(e) => setToMemberId(e.target.value)}
                  className="w-full neu-input px-3 py-2 rounded-xl text-xs font-bold focus:outline-none"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
              Settlement Amount *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-lg font-bold font-mono text-cyan-600 dark:text-cyan-400">
                {currencyConfig.symbol}
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full neu-input pl-10 pr-4 py-2.5 rounded-2xl text-xl font-mono font-bold focus:outline-none"
              />
            </div>
          </div>

          {/* Date & Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full neu-input px-3 py-2 rounded-xl text-xs font-mono focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                Method / Note
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Venmo, Cash, UPI"
                className="w-full neu-input px-3 py-2 rounded-xl text-xs focus:outline-none placeholder-slate-400"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-300/60 dark:border-white/5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="neu-btn px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="neu-btn-primary flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold"
            >
              <HandCoins className="w-4 h-4" />
              <span>Record Payment</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
