import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users2, 
  UserPlus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  DollarSign, 
  Percent, 
  Copy, 
  Sparkles, 
  Coins, 
  Equal, 
  Shuffle, 
  Check,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateUnequalSplit } from '../utils/calculations';
import { formatCurrency, getCurrencyConfig } from '../utils/currency';
import { copyToClipboard } from '../utils/receipt';

const AVATAR_COLORS = [
  'from-purple-500 to-indigo-600',
  'from-cyan-500 to-blue-600',
  'from-pink-500 to-rose-600',
  'from-amber-500 to-orange-600',
  'from-emerald-500 to-teal-600',
  'from-violet-500 to-fuchsia-600',
];

export const BillSplitter = ({
  currency = 'USD',
  globalTip = 18,
  onNotify,
}) => {
  const currencyConfig = getCurrencyConfig(currency);

  const [splitMode, setSplitMode] = useState('exact'); // 'exact' (custom amounts), 'equal', 'percentage'
  const [totalBillAmount, setTotalBillAmount] = useState('150.00');
  const [taxRate, setTaxRate] = useState('8.5');

  const [participants, setParticipants] = useState([
    { id: 'p1', name: 'Alex', amount: '55.00', percentage: '35', customTip: null, color: AVATAR_COLORS[0] },
    { id: 'p2', name: 'Sarah', amount: '45.00', percentage: '30', customTip: null, color: AVATAR_COLORS[1] },
    { id: 'p3', name: 'Jordan', amount: '50.00', percentage: '35', customTip: null, color: AVATAR_COLORS[2] },
  ]);

  const [copiedId, setCopiedId] = useState(null);

  // Compute breakdown
  const splitResult = useMemo(() => {
    return calculateUnequalSplit({
      participants,
      tipPercentage: globalTip,
      taxPercentage: parseFloat(taxRate) || 0,
      splitMode,
      totalBill: parseFloat(totalBillAmount) || 0,
    });
  }, [participants, globalTip, taxRate, splitMode, totalBillAmount]);

  const addParticipant = () => {
    const id = `p_${Date.now()}`;
    const nextIdx = participants.length;
    const color = AVATAR_COLORS[nextIdx % AVATAR_COLORS.length];
    setParticipants([
      ...participants,
      {
        id,
        name: `Guest ${nextIdx + 1}`,
        amount: '0.00',
        percentage: '0',
        customTip: null,
        color,
      },
    ]);
  };

  const removeParticipant = (id) => {
    if (participants.length <= 1) {
      if (onNotify) onNotify('At least one participant is required', 'error');
      return;
    }
    setParticipants(participants.filter((p) => p.id !== id));
  };

  const updateParticipant = (id, field, value) => {
    setParticipants(
      participants.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const distributeEvenly = () => {
    const total = parseFloat(totalBillAmount) || 0;
    const count = participants.length;
    if (count === 0) return;
    const evenAmount = (total / count).toFixed(2);
    const evenPct = (100 / count).toFixed(1);

    setParticipants(
      participants.map((p) => ({
        ...p,
        amount: evenAmount,
        percentage: evenPct,
      }))
    );
    if (onNotify) onNotify('Distributed evenly among all guests', 'success');
  };

  const handleCopyPersonShare = async (person) => {
    const text = `Hey ${person.name}! Your share for the bill is ${formatCurrency(person.totalPayable, currency)} (Food: ${formatCurrency(person.subtotal, currency)} + Tip: ${formatCurrency(person.tipAmount, currency)} @ ${person.tipPercentage}%). Settled via Dibbl.`;
    await copyToClipboard(text);
    setCopiedId(person.id);
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    } catch {}
    if (onNotify) onNotify(`Copied payment request for ${person.name}!`, 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="split-engine" className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-cyan-500/20 text-xs font-semibold text-cyan-400 mb-3">
            <Users2 className="w-3.5 h-3.5" />
            <span>Multi-Person Custom Expense Split</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            Unequal & Itemized Splits.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Fair to Every Cent.
            </span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Alex had the steak, Sarah had the salad? Assign custom subtotal amounts, individual tips, and proportional tax in seconds.
          </p>
        </div>

        {/* Control Toolbar */}
        <div className="glass-panel p-4 sm:p-6 rounded-3xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Split Mode Selector */}
          <div className="flex items-center gap-2 bg-slate-900/10 dark:bg-white/5 p-1 rounded-2xl w-full md:w-auto">
            <button
              onClick={() => setSplitMode('exact')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                splitMode === 'exact'
                  ? 'bg-purple-600 text-white shadow-neon-purple'
                  : 'text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Exact Amounts</span>
            </button>

            <button
              onClick={() => setSplitMode('percentage')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                splitMode === 'percentage'
                  ? 'bg-cyan-600 text-white shadow-neon-cyan'
                  : 'text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              <span>Percentage (%)</span>
            </button>

            <button
              onClick={() => setSplitMode('equal')}
              className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                splitMode === 'equal'
                  ? 'bg-violet-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
            >
              <Equal className="w-3.5 h-3.5" />
              <span>Even Split</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={distributeEvenly}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-input text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-white hover:border-purple-400 transition-colors"
              title="Equally distribute the target bill"
            >
              <Shuffle className="w-3.5 h-3.5 text-purple-400" />
              <span>Auto-Balance</span>
            </button>

            <button
              onClick={addParticipant}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold shadow-glass-glow hover:opacity-95 transition-all hover:scale-105"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Guest</span>
            </button>
          </div>
        </div>

        {/* Global Target Bill Bar (for percentage / equal / reference mode) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-panel p-4 rounded-2xl">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Total Target Bill
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-sm font-mono font-bold text-slate-400">{currencyConfig.symbol}</span>
              <input
                type="number"
                step="0.01"
                value={totalBillAmount}
                onChange={(e) => setTotalBillAmount(e.target.value)}
                placeholder="150.00"
                className="w-full glass-input pl-8 pr-3 py-1.5 rounded-xl text-base font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Estimated Tax / VAT
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                placeholder="8.5"
                className="w-full glass-input pr-7 pl-3 py-1.5 rounded-xl text-base font-mono font-bold text-slate-900 dark:text-white"
              />
              <span className="absolute right-3 top-2 text-xs font-mono text-slate-400">%</span>
            </div>
          </div>

          {/* Reconciliation Balance Meter */}
          <div className={`p-4 rounded-2xl glass-panel border ${
            splitResult.isBalanced 
              ? 'border-emerald-500/30 bg-emerald-950/20' 
              : 'border-amber-500/30 bg-amber-950/20'
          }`}>
            <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider mb-1">
              <span className={splitResult.isBalanced ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                Reconciliation Status
              </span>
              {splitResult.isBalanced ? (
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Balanced
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" /> Discrepancy
                </span>
              )}
            </div>

            <div className="text-lg font-bold font-mono text-slate-900 dark:text-white flex items-center justify-between">
              <span>Allocated: {formatCurrency(splitResult.totalCalculated, currency)}</span>
              {!splitResult.isBalanced && (
                <span className="text-xs font-mono text-amber-400">
                  ({splitResult.remaining > 0 ? `Unassigned: ${formatCurrency(splitResult.remaining, currency)}` : `Over by: ${formatCurrency(Math.abs(splitResult.remaining), currency)}`})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Participant Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {splitResult.participants.map((person, idx) => (
              <motion.div
                key={person.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="glass-panel-elevated p-6 rounded-3xl border border-white/10 dark:border-white/10 relative overflow-hidden group hover:border-purple-500/40 transition-all shadow-glass"
              >
                {/* Top Row: Avatar, Name, Delete */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${person.color || AVATAR_COLORS[0]} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                      {person.name ? person.name.slice(0, 2).toUpperCase() : `P${idx + 1}`}
                    </div>
                    <div>
                      <input
                        type="text"
                        value={person.name}
                        onChange={(e) => updateParticipant(person.id, 'name', e.target.value)}
                        placeholder="Guest Name"
                        className="bg-transparent font-bold text-base text-slate-900 dark:text-white focus:outline-none border-b border-transparent hover:border-white/20 focus:border-purple-400 px-1 py-0.5 rounded transition-colors w-32 sm:w-36"
                      />
                      <div className="text-[10px] font-mono text-slate-400">Guest #{idx + 1}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeParticipant(person.id)}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-70 group-hover:opacity-100"
                    title="Remove participant"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Subtotal input according to split mode */}
                <div className="space-y-3 mb-4">
                  {splitMode === 'exact' && (
                    <div>
                      <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                        Individual Subtotal (Food & Drinks)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-sm font-mono text-slate-400">{currencyConfig.symbol}</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={person.amount}
                          onChange={(e) => updateParticipant(person.id, 'amount', e.target.value)}
                          className="w-full glass-input pl-8 pr-3 py-1.5 rounded-xl font-mono text-base font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  )}

                  {splitMode === 'percentage' && (
                    <div>
                      <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                        Percentage Share
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="1"
                          min="0"
                          max="100"
                          value={person.percentage}
                          onChange={(e) => updateParticipant(person.id, 'percentage', e.target.value)}
                          className="w-full glass-input pr-8 pl-3 py-1.5 rounded-xl font-mono text-base font-bold text-slate-900 dark:text-white"
                        />
                        <span className="absolute right-3 top-2 text-sm font-mono text-slate-400">%</span>
                      </div>
                    </div>
                  )}

                  {/* Individual custom tip toggle/override */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400 font-mono text-[11px]">Tip Allocation:</span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder={`${globalTip}%`}
                        value={person.customTip !== null ? person.customTip : ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? null : Number(e.target.value);
                          updateParticipant(person.id, 'customTip', val);
                        }}
                        className="w-16 glass-input text-center py-0.5 px-1 rounded-lg text-xs font-mono font-bold"
                      />
                      <span className="font-mono text-slate-400 text-xs">%</span>
                    </div>
                  </div>
                </div>

                {/* Individual Final Payable Box */}
                <div className="p-3.5 rounded-2xl bg-midnight-950/60 dark:bg-midnight-950/60 bg-slate-100 border border-white/5 dark:border-white/5 border-slate-200/50 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Total Payable</span>
                    <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                      Tip: {formatCurrency(person.tipAmount, currency)}
                    </span>
                  </div>
                  <div className="text-2xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                    {formatCurrency(person.totalPayable, currency)}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 mt-1">
                    Subtotal: {formatCurrency(person.subtotal, currency)} • Tax: {formatCurrency(person.taxAmount, currency)}
                  </div>
                </div>

                {/* Copy share button */}
                <button
                  onClick={() => handleCopyPersonShare(person)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl glass-input text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-white hover:border-purple-500/40 hover:bg-white/10 transition-colors"
                >
                  {copiedId === person.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Share!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-purple-400" />
                      <span>Copy Request for {person.name}</span>
                    </>
                  )}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

