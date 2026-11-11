import React from 'react';
import { 
  Plus, 
  Receipt, 
  HandCoins, 
  FileDown, 
  Users, 
  Share2, 
  Sparkles,
  CheckCircle2, 
  Trash2
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
    <section className="pt-28 pb-4 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Neumorphic Group Banner Card */}
        <div className="neu-flat p-6 sm:p-8 rounded-3xl relative overflow-hidden mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Title & Description */}
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl neu-icon-socket flex items-center justify-center text-4xl sm:text-5xl shrink-0 select-none">
                {group?.emoji || '🏖️'}
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full neu-inset text-[11px] font-mono font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-2">
                  <Sparkles className="w-3 h-3 text-cyan-500 dark:text-cyan-400" />
                  <span>Splid Neomorphic Ledger</span>
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
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenAddExpense}
                className="neu-btn-primary flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold"
              >
                <Plus className="w-4 h-4" />
                <span>Add Expense</span>
              </button>

              <button
                onClick={() => onOpenSettleUp()}
                className="neu-btn flex items-center gap-2 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200"
              >
                <HandCoins className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                <span>Settle Up</span>
              </button>

              {totalExpensesCount > 0 && (
                <>
                  <button
                    onClick={onExportPDF}
                    className="neu-btn p-3 rounded-2xl text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-300"
                    title="Download Group Statement PDF"
                  >
                    <FileDown className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onShareWhatsApp}
                    className="neu-btn p-3 rounded-2xl text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400"
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
                className="neu-btn p-3 rounded-2xl text-slate-400 hover:text-red-500"
                title="Delete this group"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Neumorphic Inset Stats Wells */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mt-8 pt-6 border-t border-slate-300/60 dark:border-white/5">
            {/* Total Spending */}
            <div className="neu-sunken p-4 sm:p-5 rounded-2xl">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-mono uppercase tracking-wider mb-1.5">
                <span>Total Expenses</span>
                <div className="p-1 rounded-lg neu-flat">
                  <Receipt className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                {formatCurrency(totalSpending, currency)}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                {totalExpensesCount} {totalExpensesCount === 1 ? 'logged expense' : 'logged expenses'}
              </div>
            </div>

            {/* Total Settled */}
            <div className="neu-sunken p-4 sm:p-5 rounded-2xl">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-mono uppercase tracking-wider mb-1.5">
                <span>Total Settled</span>
                <div className="p-1 rounded-lg neu-flat">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                {formatCurrency(totalSettled, currency)}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                Reimbursed between members
              </div>
            </div>

            {/* Outstanding Debts */}
            <div className="neu-sunken p-4 sm:p-5 rounded-2xl">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-mono uppercase tracking-wider mb-1.5">
                <span>Active Settlements</span>
                <div className="p-1 rounded-lg neu-flat">
                  <HandCoins className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400">
                {outstandingDebtsCount} {outstandingDebtsCount === 1 ? 'Transfer' : 'Transfers'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                Simplified minimum cash flow
              </div>
            </div>

            {/* Members Count */}
            <div className="neu-sunken p-4 sm:p-5 rounded-2xl">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-[11px] font-mono uppercase tracking-wider mb-1.5">
                <span>Group Size</span>
                <div className="p-1 rounded-lg neu-flat">
                  <Users className="w-3.5 h-3.5 text-pink-500 dark:text-pink-400" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
                {membersCount} {membersCount === 1 ? 'Person' : 'People'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                Active group members
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
