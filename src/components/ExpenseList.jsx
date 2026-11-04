import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Receipt, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Calendar, 
  Users, 
  Plus,
  X
} from 'lucide-react';
import { getCategoryById, EXPENSE_CATEGORIES } from '../utils/categories';
import { formatCurrency } from '../utils/currency';

export const ExpenseList = ({
  expenses = [],
  members = [],
  currency = 'USD',
  onDeleteExpense,
  onOpenAddExpense,
  onNotify,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const filteredExpenses = expenses.filter((e) => {
    const matchesCat = selectedCategory === 'all' || e.category === selectedCategory;
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const getMemberName = (id) => {
    return members.find((m) => m.id === id)?.name || 'Unknown Member';
  };

  return (
    <section id="expenses" className="py-6 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border-purple-500/20 text-xs font-semibold text-purple-600 dark:text-purple-300 mb-1.5">
              <Receipt className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
              <span>Activity & Receipts</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
              Expense History
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Complete chronological breakdown of every shared payment and receipt.
            </p>
          </div>

          <button
            onClick={onOpenAddExpense}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-xs font-bold shadow-glass-glow hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="glass-panel p-3.5 rounded-3xl mb-5 flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto py-1 px-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'glass-input text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({expenses.length})
            </button>
            {EXPENSE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white shadow-sm font-bold'
                    : 'glass-input text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search expenses..."
              className="w-full glass-input pl-8 pr-7 py-1.5 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Expenses List */}
        {filteredExpenses.length === 0 ? (
          <div className="glass-panel p-10 rounded-3xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto text-slate-400 mb-3">
              <Receipt className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              No Expenses Found
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your filters or search query.'
                : 'Start tracking by logging the first bill or group expense!'}
            </p>
            <button
              onClick={onOpenAddExpense}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Expense</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredExpenses.map((expense) => {
                const categoryObj = getCategoryById(expense.category);
                const Icon = categoryObj.icon;
                const isExpanded = expandedId === expense.id;
                const payerName = getMemberName(expense.paidById);
                const splitCount = expense.splitWith?.length || members.length;

                return (
                  <motion.div
                    key={expense.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="glass-panel-elevated p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10 transition-all hover:border-purple-500/30"
                  >
                    <div className="flex items-center justify-between gap-3 sm:gap-4">
                      {/* Left: Category Icon & Details */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${categoryObj.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {expense.title}
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                              Paid by {payerName}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{expense.date}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>Split between {splitCount}</span>
                            </span>
                          </div>
                          {expense.notes && (
                            <p className="text-[11px] text-slate-400 italic mt-0.5 truncate">
                              "{expense.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Amount & Actions */}
                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-base sm:text-lg font-black font-mono text-slate-900 dark:text-white">
                            {formatCurrency(expense.amount, currency)}
                          </div>
                          <div className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">
                            {formatCurrency(expense.amount / Math.max(1, splitCount), currency)} / person
                          </div>
                        </div>

                        <button
                          onClick={() => setExpandedId(isExpanded ? null : expense.id)}
                          className="p-1.5 rounded-xl glass-input text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                          title="View split breakdown"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Delete "${expense.title}"?`)) {
                              onDeleteExpense(expense.id);
                              if (onNotify) onNotify('Expense deleted', 'info');
                            }
                          }}
                          className="p-1.5 rounded-xl glass-input text-slate-400 hover:text-red-500 transition-colors"
                          title="Delete expense"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Split Breakdown */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-3.5 pt-3.5 border-t border-slate-200 dark:border-white/5 overflow-hidden"
                        >
                          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
                            Individual Shares ({expense.splitType || 'equal'} split):
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {(expense.splitWith || members.map((m) => m.id)).map((memberId) => {
                              const member = members.find((m) => m.id === memberId);
                              if (!member) return null;
                              let share = 0;
                              if (expense.splitType === 'exact' && expense.splits && expense.splits[memberId]) {
                                share = parseFloat(expense.splits[memberId]) || 0;
                              } else if (expense.splitType === 'percentage' && expense.splits && expense.splits[memberId]) {
                                share = (expense.amount * (parseFloat(expense.splits[memberId]) || 0)) / 100;
                              } else {
                                share = expense.amount / (expense.splitWith?.length || members.length);
                              }

                              return (
                                <div
                                  key={memberId}
                                  className="p-2.5 rounded-xl glass-panel text-xs flex items-center justify-between"
                                >
                                  <span className="text-slate-700 dark:text-slate-300 font-medium truncate">
                                    {member.name}
                                  </span>
                                  <span className="font-mono font-bold text-purple-600 dark:text-purple-300">
                                    {formatCurrency(share, currency)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};
