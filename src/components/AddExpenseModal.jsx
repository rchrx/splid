import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Receipt, 
  AlertCircle,
  Check,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EXPENSE_CATEGORIES } from '../utils/categories';
import { getCurrencyConfig, formatCurrency } from '../utils/currency';

export const AddExpenseModal = ({
  isOpen,
  onClose,
  members = [],
  currency = 'INR',
  onAddExpense,
  onNotify,
}) => {
  if (!isOpen) return null;

  const currencyConfig = getCurrencyConfig(currency);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paidById, setPaidById] = useState(members[0]?.id || '');
  const [splitType, setSplitType] = useState('equal'); // 'equal' | 'exact' | 'percentage'
  const [selectedMemberIds, setSelectedMemberIds] = useState(members.map((m) => m.id));
  const [exactSplits, setExactSplits] = useState({});
  const [pctSplits, setPctSplits] = useState({});
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const numAmount = Math.max(0, parseFloat(amount) || 0);

  const toggleMemberSelection = (id) => {
    if (selectedMemberIds.includes(id)) {
      if (selectedMemberIds.length <= 1) {
        setError('At least one member must be included in the split');
        return;
      }
      setSelectedMemberIds(selectedMemberIds.filter((mId) => mId !== id));
    } else {
      setSelectedMemberIds([...selectedMemberIds, id]);
    }
    setError('');
  };

  const exactSum = Object.values(exactSplits).reduce((s, a) => s + (parseFloat(a) || 0), 0);
  const pctSum = Object.values(pctSplits).reduce((s, a) => s + (parseFloat(a) || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter an expense description');
      return;
    }
    if (numAmount <= 0) {
      setError('Please enter a valid expense amount greater than 0');
      return;
    }
    if (!paidById) {
      setError('Please select who paid for this expense');
      return;
    }

    let finalSplits = {};
    if (splitType === 'exact') {
      if (Math.abs(exactSum - numAmount) > 0.05) {
        setError(`Exact splits total ${formatCurrency(exactSum, currency)}, but bill amount is ${formatCurrency(numAmount, currency)}`);
        return;
      }
      finalSplits = exactSplits;
    } else if (splitType === 'percentage') {
      if (Math.abs(pctSum - 100) > 0.5) {
        setError(`Percentages must add up to 100% (currently ${pctSum.toFixed(1)}%)`);
        return;
      }
      finalSplits = pctSplits;
    }

    onAddExpense({
      title: title.trim(),
      amount: numAmount,
      category,
      date,
      paidById,
      splitType,
      splitWith: selectedMemberIds,
      splits: finalSplits,
      notes: notes.trim(),
    });

    try {
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
    } catch {}

    if (onNotify) onNotify(`Added "${title}" (${formatCurrency(numAmount, currency)})!`, 'success');
    onClose();
  };

  const perPersonAmount = selectedMemberIds.length > 0 ? numAmount / selectedMemberIds.length : 0;

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
        className="relative w-full max-w-xl neu-raised text-slate-800 dark:text-slate-100 p-5 sm:p-7 rounded-3xl z-10 overflow-hidden max-h-[92vh] flex flex-col justify-between"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-300/60 dark:border-white/5 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl neu-icon-socket flex items-center justify-center text-teal-600 dark:text-teal-400">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Add New Expense
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Log a shared bill, dinner, ride, or accommodation
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
          <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[62vh] pr-1">
            {error && (
              <div className="p-3 rounded-xl neu-sunken border-l-4 border-l-red-500 text-red-600 dark:text-red-300 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Description & Amount Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-7 space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                  Description *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Dinner, Uber, Villa"
                  required
                  autoFocus
                  className="w-full neu-input px-3.5 py-2.5 rounded-2xl text-sm font-semibold focus:outline-none placeholder-slate-400"
                />
              </div>

              <div className="sm:col-span-5 space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                  Amount *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-bold font-mono text-teal-600 dark:text-teal-400">
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
                    className="w-full neu-input pl-8 pr-3 py-2.5 rounded-2xl text-sm font-mono font-bold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {EXPENSE_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-2 rounded-xl text-left flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'neu-btn-primary font-bold'
                          : 'neu-btn text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[11px] truncate">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Paid By & Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                  Paid By (Out of Pocket)
                </label>
                <select
                  value={paidById}
                  onChange={(e) => setPaidById(e.target.value)}
                  className="w-full neu-input px-3 py-2.5 rounded-2xl text-xs font-bold focus:outline-none"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full neu-input px-3 py-2.5 rounded-2xl text-xs font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Split Mode Selector */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                  Split Method
                </label>
                <div className="flex items-center gap-1 neu-sunken p-1 rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => setSplitType('equal')}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all ${
                      splitType === 'equal' ? 'neu-btn-primary' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Equally
                  </button>
                  <button
                    type="button"
                    onClick={() => setSplitType('exact')}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all ${
                      splitType === 'exact' ? 'neu-btn-primary' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Exact Amounts
                  </button>
                  <button
                    type="button"
                    onClick={() => setSplitType('percentage')}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all ${
                      splitType === 'percentage' ? 'neu-btn-primary' : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Percentage
                  </button>
                </div>
              </div>

              {/* Equal Mode Members Picker */}
              {splitType === 'equal' && (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {members.map((m) => {
                      const isIncluded = selectedMemberIds.includes(m.id);
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => toggleMemberSelection(m.id)}
                          className={`p-2.5 rounded-xl flex items-center justify-between text-xs transition-all ${
                            isIncluded
                              ? 'neu-btn-primary font-bold'
                              : 'neu-sunken text-slate-400 opacity-60'
                          }`}
                        >
                          <span className="truncate">{m.name}</span>
                          {isIncluded && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {numAmount > 0 && selectedMemberIds.length > 0 && (
                    <div className="neu-sunken p-2.5 rounded-xl text-xs font-mono text-teal-600 dark:text-teal-300 text-center">
                      Each person pays: <strong>{formatCurrency(perPersonAmount, currency)}</strong> ({selectedMemberIds.length} {selectedMemberIds.length === 1 ? 'person' : 'people'})
                    </div>
                  )}
                </div>
              )}

              {/* Exact Mode Custom Amount Inputs */}
              {splitType === 'exact' && (
                <div className="space-y-2 pt-1">
                  <div className="text-[10px] font-mono flex items-center justify-between text-slate-500">
                    <span>Allocated: {formatCurrency(exactSum, currency)}</span>
                    <span className={Math.abs(exactSum - numAmount) < 0.05 ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>
                      Target: {formatCurrency(numAmount, currency)}
                    </span>
                  </div>

                  {members.map((m) => (
                    <div key={m.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl neu-sunken text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{m.name}</span>
                      <div className="relative w-32">
                        <span className="absolute left-2.5 top-1.5 text-xs font-mono text-slate-400">{currencyConfig.symbol}</span>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={exactSplits[m.id] || ''}
                          onChange={(e) => setExactSplits({ ...exactSplits, [m.id]: e.target.value })}
                          className="w-full neu-input pl-7 pr-2 py-1 rounded-lg text-right font-mono text-xs font-bold"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Percentage Mode */}
              {splitType === 'percentage' && (
                <div className="space-y-2 pt-1">
                  <div className="text-[10px] font-mono flex items-center justify-between text-slate-500">
                    <span>Total %: {pctSum.toFixed(1)}%</span>
                    <span className={Math.abs(pctSum - 100) < 0.5 ? 'text-emerald-500 font-bold' : 'text-amber-500 font-bold'}>
                      Target: 100%
                    </span>
                  </div>

                  {members.map((m) => (
                    <div key={m.id} className="flex items-center justify-between gap-3 p-2.5 rounded-xl neu-sunken text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{m.name}</span>
                      <div className="relative w-28">
                        <input
                          type="number"
                          step="1"
                          placeholder="0"
                          value={pctSplits[m.id] || ''}
                          onChange={(e) => setPctSplits({ ...pctSplits, [m.id]: e.target.value })}
                          className="w-full neu-input pr-6 pl-2 py-1 rounded-lg text-right font-mono text-xs font-bold"
                        />
                        <span className="absolute right-2 top-1.5 text-xs font-mono text-slate-400">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Optional Notes */}
            <div className="space-y-1 pt-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                Notes & Context (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. includes tip, receipt saved"
                className="w-full neu-input px-3.5 py-2 rounded-xl text-xs placeholder-slate-400 focus:outline-none"
              />
            </div>

            {/* Submit Action */}
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
                <Plus className="w-4 h-4" />
                <span>Save Expense</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
