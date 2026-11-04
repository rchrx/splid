import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plus,
  X,
  Users
} from 'lucide-react';
import { CURRENCIES } from '../utils/currency';

export const WelcomeState = ({ onCreateGroup, currency, onCurrencyChange }) => {
  const [groupName, setGroupName] = useState('');
  const [emoji, setEmoji] = useState('🏖️');
  const [description, setDescription] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState(['You', 'Friend 1']);

  const emojis = ['🏖️', '🌲', '🛋️', '🍕', '✈️', '🎉', '🚗', '🏔️', '⛺', '🍣', '🏢', '⛵'];

  const handleAddMember = (e) => {
    if (e) e.preventDefault();
    const clean = memberInput.trim();
    if (!clean) return;
    if (!members.includes(clean)) {
      setMembers([...members, clean]);
    }
    setMemberInput('');
  };

  const handleRemoveMember = (name) => {
    if (members.length <= 1) return;
    setMembers(members.filter((m) => m !== name));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    onCreateGroup({
      name: groupName.trim(),
      emoji,
      description: description.trim(),
      initialMembers: members.length > 0 ? members : ['You', 'Friend 1'],
    });
  };

  return (
    <div className="pt-24 sm:pt-28 pb-16 relative overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-purple-600/15 via-indigo-600/15 to-cyan-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-500/20 via-violet-500/10 to-cyan-500/20 border border-purple-500/30 shadow-glass-glow p-3.5 mx-auto mb-4 flex items-center justify-center backdrop-blur-xl">
            <img src={`${import.meta.env.BASE_URL}/logo.png`} alt="Dibbl Logo" className="w-full h-full object-contain drop-shadow-[0_4px_16px_rgba(168,85,247,0.55)]" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-purple-500/30 text-xs font-semibold text-purple-600 dark:text-purple-300 mb-3 shadow-glass">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            <span>Dibbl • Group Expense & Debt Engine</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
            Split Smart. Pay Fair.
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Create your custom group or trip to start logging shared expenses and let Dibbl calculate who pays whom with zero math friction.
          </p>
        </div>

        {/* First Group Setup Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-panel-elevated p-5 sm:p-8 rounded-3xl border border-slate-200 dark:border-purple-500/30 shadow-2xl relative overflow-hidden"
        >
          <div className="flex items-center gap-3 pb-5 border-b border-slate-200 dark:border-white/10 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white text-2xl shadow-neon-purple shrink-0">
              {emoji}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Create Your Group
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Shared ledger for trips, vacations, apartments, or events
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Emoji Selector */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block mb-2">
                Choose Icon
              </label>
              <div className="flex items-center gap-2.5 overflow-x-auto py-2.5 px-2">
                {emojis.map((em) => {
                  const isSelected = emoji === em;
                  return (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setEmoji(em)}
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all duration-200 shrink-0 ${isSelected
                          ? 'bg-purple-500/20 border-2 border-purple-500 dark:border-purple-400 shadow-[0_0_14px_rgba(168,85,247,0.4)]'
                          : 'glass-input border border-slate-200 dark:border-white/10 hover:border-purple-500/40 hover:bg-slate-100 dark:hover:bg-white/10 opacity-70 hover:opacity-100'
                        }`}
                    >
                      <span className="leading-none select-none">{em}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group Name & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8 space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                  Group or Trip Name *
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Goa Vacation, Flat 204, Tokyo Trip"
                  required
                  autoFocus
                  className="w-full glass-input px-3.5 py-2.5 rounded-2xl text-sm font-bold focus:outline-none placeholder-slate-400"
                />
              </div>

              <div className="sm:col-span-4 space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => onCurrencyChange(e.target.value)}
                  className="w-full glass-input px-3 py-2.5 rounded-2xl text-xs font-bold focus:outline-none"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Optional Description */}
            <div className="space-y-1">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                Short Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Shared flight, villa rental, and daily dining expenses"
                className="w-full glass-input px-3.5 py-2 rounded-xl text-xs focus:outline-none placeholder-slate-400"
              />
            </div>

            {/* Members Section */}
            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold flex items-center justify-between">
                <span>Group Members ({members.length})</span>
                <span className="text-[10px] text-slate-400 font-normal">Add everyone sharing expenses</span>
              </label>

              {/* Tag Badges */}
              <div className="flex flex-wrap items-center gap-1.5 min-h-[32px]">
                {members.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-xs font-semibold"
                  >
                    <span>{name}</span>
                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(name)}
                        className="hover:text-red-500 p-0.5 rounded-full"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {/* Add Member Input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={memberInput}
                  onChange={(e) => setMemberInput(e.target.value)}
                  placeholder="Type a friend's name and press Add"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMember(e);
                    }
                  }}
                  className="flex-1 glass-input px-3.5 py-2 rounded-xl text-xs focus:outline-none placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={handleAddMember}
                  className="px-3.5 py-2 rounded-xl glass-input hover:border-purple-400 text-xs font-bold text-purple-600 dark:text-purple-300 hover:text-purple-700 dark:hover:text-white transition-colors shrink-0"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Launch Group CTA */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                <span>Client-Side Privacy • Zero Tracking</span>
              </div>

              <button
                type="submit"
                disabled={!groupName.trim()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-2xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-500 hover:opacity-95 shadow-glass-glow hover:shadow-neon-purple transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Launch Group</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
