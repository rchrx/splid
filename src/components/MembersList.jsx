import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  TrendingUp, 
  TrendingDown, 
  Check, 
  Sparkles,
  Wallet
} from 'lucide-react';
import { formatCurrency } from '../utils/currency';

export const MembersList = ({
  members = [],
  balances = [],
  currency = 'USD',
  onAddMember,
  onRemoveMember,
  onNotify,
}) => {
  const [newMemberName, setNewMemberName] = useState('');
  const [showAddInput, setShowAddInput] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    onAddMember(newMemberName.trim());
    setNewMemberName('');
    setShowAddInput(false);
    if (onNotify) onNotify(`Added ${newMemberName} to the group!`, 'success');
  };

  return (
    <section id="members" className="py-6 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel border-purple-500/20 text-xs font-semibold text-purple-600 dark:text-purple-300 mb-1.5">
              <Users className="w-3.5 h-3.5 text-electric-purple" />
              <span>Participant Net Balances</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
              Members & Balances
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Each member's total out-of-pocket spending compared with their consumed share.
            </p>
          </div>

          <button
            onClick={() => setShowAddInput(!showAddInput)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 rounded-2xl glass-input text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:border-purple-400/50 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
            <span>Add Member</span>
          </button>
        </div>

        {/* Add Member Inline Row */}
        <AnimatePresence>
          {showAddInput && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAdd}
              className="mb-5 p-3.5 rounded-2xl glass-panel-elevated border border-purple-500/30 flex items-center gap-2.5 max-w-md overflow-hidden"
            >
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Enter member name (e.g. Chloe)"
                autoFocus
                className="flex-1 glass-input px-3.5 py-2 rounded-xl text-xs font-medium focus:outline-none placeholder-slate-400"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors shrink-0 shadow-sm"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddInput(false)}
                className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white p-2"
              >
                Cancel
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Members Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {balances.map((member) => {
            const isOwed = member.net > 0.01;
            const owes = member.net < -0.01;
            const isSettled = !isOwed && !owes;

            return (
              <motion.div
                key={member.id}
                layout
                className="glass-panel p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10 relative overflow-hidden group hover:border-purple-500/30 transition-all shadow-glass"
              >
                {/* Top: Avatar, Name, Delete */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${member.color || 'from-purple-500 to-indigo-600'} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                        {member.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        {isOwed ? 'Net Creditor' : owes ? 'Net Debtor' : 'Settled'}
                      </span>
                    </div>
                  </div>

                  {members.length > 2 && (
                    <button
                      onClick={() => {
                        if (confirm(`Remove ${member.name} from this group?`)) {
                          onRemoveMember(member.id);
                        }
                      }}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-colors opacity-40 group-hover:opacity-100"
                      title="Remove member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Spending vs Share stats */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono py-2 px-3 rounded-2xl bg-slate-100 dark:bg-midnight-950/40 border border-slate-200 dark:border-transparent mb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Paid</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {formatCurrency(member.paid, currency)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Share</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {formatCurrency(member.share, currency)}
                    </span>
                  </div>
                </div>

                {/* Net Balance Status Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">Net Status</span>
                  <div
                    className={`px-2 py-0.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1 ${
                      isOwed
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : owes
                        ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                        : 'bg-slate-200/50 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10'
                    }`}
                  >
                    {isOwed ? (
                      <>
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                        <span>+{formatCurrency(member.net, currency)}</span>
                      </>
                    ) : owes ? (
                      <>
                        <TrendingDown className="w-3 h-3 text-rose-500" />
                        <span>-{formatCurrency(Math.abs(member.net), currency)}</span>
                      </>
                    ) : (
                      <span>Settled ($0.00)</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
