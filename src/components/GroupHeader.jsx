import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Receipt, 
  HandCoins, 
  FileDown, 
  Users, 
  CreditCard, 
  Share2, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, getCurrencyConfig } from '../utils/currency';

export const GroupHeader = ({
  group,
  totalSpending,
  totalSettled,
  simplifiedDebts = [],
  currency,
  onOpenAddExpense,
  onOpenSettleUp,
  onExportPDF,
  onShareWhatsApp,
  onDeleteGroup,
}) => {
  if (!group) return null;

  const currencyConfig = getCurrencyConfig(currency);
  const totalExpensesCount = group?.expenses?.length || 0;
  const membersCount = group?.members?.length || 0;
  const outstandingDebtsCount = simplifiedDebts.length;

  return (
    <section className="pt-28 pb-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/15 to-cyan-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Group Banner Card */}
        <div className="glass-panel-elevated p-6 sm:p-8 rounded-3xl border border-white/10 dark:border-white/10 relative overflow-hidden shadow-2xl mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Title & Description */}
            <div className="flex items-start gap-4">
              <div className="text-4xl sm:text-5xl p-3 rounded-2xl glass-panel border border-white/10 shrink-0 select-none shadow-glass">
                {group?.emoji || '🏖️'}
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20 text-[11px] font-mono font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3 h-3" />
                  <span>Dibbl • Split Smart. Pay Fair</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                  {group?.name || 'Group Expenses'}
                </h1>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
                  {group?.description || 'Track shared expenses, automatically simplify debts, and settle seamlessly.'}
                </p>
              </div>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={onOpenAddExpense}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-500 hover:opacity-95 shadow-glass-glow hover:shadow-neon-purple transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Expense</span>
              </button>

              <button
                onClick={() => onOpenSettleUp()}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 glass-input hover:text-white hover:border-cyan-500/40 hover:bg-white/10 transition-all"
              >
                <HandCoins className="w-4 h-4 text-cyan-400" />
                <span>Settle Up</span>
              </button>

              {totalExpensesCount > 0 && (
                <>
                  <button
                    onClick={onExportPDF}
                    className="p-3 rounded-2xl glass-input text-slate-600 dark:text-slate-300 hover:text-purple-300 hover:border-purple-400/40 transition-colors"
                    title="Download Group Statement PDF"
                  >
                    <FileDown className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onShareWhatsApp}
                    className="p-3 rounded-2xl glass-input text-slate-600 dark:text-slate-300 hover:text-emerald-400 hover:border-emerald-400/40 transition-colors"
                    title="Share Summary via WhatsApp / Clipboard"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete the group "${group.name}"?`)) {
                    onDeleteGroup(group.id);
                  }
                }}
                className="p-3 rounded-2xl glass-input text-slate-500 hover:text-red-400 hover:border-red-500/30 transition-colors"
                title="Delete this group"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/5 dark:border-white/5 border-slate-200/50">
            {/* Total Spending */}
            <div className="glass-panel p-4 rounded-2xl">
              <div className="flex items-center justify-between text-slate-500 text-[11px] font-mono uppercase tracking-wider mb-1">
                <span>Total Expenses</span>
                <Receipt className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                {formatCurrency(totalSpending, currency)}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                {totalExpensesCount} {totalExpensesCount === 1 ? 'logged expense' : 'logged expenses'}
              </div>
            </div>

            {/* Total Settled */}
            <div className="glass-panel p-4 rounded-2xl">
              <div className="flex items-center justify-between text-slate-500 text-[11px] font-mono uppercase tracking-wider mb-1">
                <span>Total Settled</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                {formatCurrency(totalSettled, currency)}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Reimbursed between members
              </div>
            </div>

            {/* Outstanding Debts */}
            <div className="glass-panel p-4 rounded-2xl">
              <div className="flex items-center justify-between text-slate-500 text-[11px] font-mono uppercase tracking-wider mb-1">
                <span>Active Settlements</span>
                <HandCoins className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-cyan-400">
                {outstandingDebtsCount} {outstandingDebtsCount === 1 ? 'Transfer' : 'Transfers'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Simplified minimum cash flow
              </div>
            </div>

            {/* Members Count */}
            <div className="glass-panel p-4 rounded-2xl">
              <div className="flex items-center justify-between text-slate-500 text-[11px] font-mono uppercase tracking-wider mb-1">
                <span>Group Size</span>
                <Users className="w-3.5 h-3.5 text-pink-400" />
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                {membersCount} {membersCount === 1 ? 'Person' : 'People'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                Active group members
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
