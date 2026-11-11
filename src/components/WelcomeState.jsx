import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoImg from '../assets/logo.png';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Users,
  Receipt,
  FileDown,
  Share2,
  Check,
  X,
  ChevronDown,
  HelpCircle,
  TrendingDown,
  Sliders,
  DollarSign
} from 'lucide-react';
import { formatCurrency } from '../utils/currency';

const PRESET_TEMPLATES = [
  {
    name: 'Goa Beach Holiday',
    emoji: '🏖️',
    description: 'Resort stay, beach shacks, scooty rentals, and dinners',
    members: ['You', 'Rahul', 'Priya', 'Amit'],
  },
  {
    name: 'Flat 304 Roommates',
    emoji: '🛋️',
    description: 'Monthly rent, WiFi, groceries, maid, and electricity',
    members: ['You', 'Rohan', 'Sneha'],
  },
  {
    name: 'Manali Mountain Trek',
    emoji: '🏔️',
    description: 'Camps, bonfire snacks, gear rentals, and tempo traveler',
    members: ['You', 'Vikram', 'Ananya', 'Kabir'],
  },
  {
    name: 'Weekend Road Trip',
    emoji: '🚗',
    description: 'Highway toll, petrol, dhaba meals, and resort stay',
    members: ['You', 'Neha', 'Raj'],
  },
];

export const WelcomeState = ({ onCreateGroup }) => {
  const [groupName, setGroupName] = useState('');
  const [emoji, setEmoji] = useState('🏖️');
  const [description, setDescription] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState(['You', 'Rahul', 'Priya']);
  const [activeTemplate, setActiveTemplate] = useState(null);

  // Quick Calculator state
  const [showQuickCalc, setShowQuickCalc] = useState(false);
  const [quickBill, setQuickBill] = useState('2400');
  const [quickPeople, setQuickPeople] = useState('4');
  const [quickTip, setQuickTip] = useState('10');

  // FAQ state
  const [openFaq, setOpenFaq] = useState(0);

  const emojis = ['🏖️', '🌲', '🛋️', '🍕', '✈️', '🎉', '🚗', '🏔️', '⛺', '🍣', '🏢', '⛵'];

  const handleApplyTemplate = (tpl) => {
    setActiveTemplate(tpl.name);
    setGroupName(tpl.name);
    setEmoji(tpl.emoji);
    setDescription(tpl.description);
    setMembers([...tpl.members]);
  };

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

  // Quick Calc Math
  const billNum = Math.max(0, parseFloat(quickBill) || 0);
  const peopleNum = Math.max(1, parseInt(quickPeople, 10) || 1);
  const tipPct = Math.max(0, parseFloat(quickTip) || 0);
  const tipAmount = (billNum * tipPct) / 100;
  const totalAmount = billNum + tipAmount;
  const perPerson = totalAmount / peopleNum;

  const faqs = [
    {
      q: 'How does Splid simplify debts?',
      a: 'Instead of having everyone settle individual IOUs with multiple people, Splid computes each person’s total net balance (what they spent minus what they consumed) and resolves the whole group using the fewest direct transfers possible.',
    },
    {
      q: 'Does Splid store my financial data or bank logins?',
      a: 'No. Splid is 100% private and runs entirely in your browser using local storage. No bank logins, no accounts, and no phone numbers required.',
    },
    {
      q: 'Can I split unevenly by exact rupees?',
      a: 'Yes! Splid supports both equal splits and custom exact amounts per person, so someone who only ordered a drink can pay their exact share.',
    },
    {
      q: 'Is it free and does it work offline?',
      a: 'Splid is completely free with zero ads. Because all calculations and data run in your browser client, it works seamlessly even without an internet connection.',
    },
  ];

  return (
    <div className="pt-24 sm:pt-28 pb-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ==========================================================
            1. HERO & VALUE PROPOSITION
            ========================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl neu-icon-disc p-3 mx-auto mb-4 flex items-center justify-center">
            <img
              src={logoImg}
              alt="Splid Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full neu-inset text-xs font-semibold text-teal-700 dark:text-teal-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            <span>Intelligent Neomorphic Debt Simplifier</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
            Split Smart. <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-400 to-[#f07864]">Pay Fair.</span>
          </h1>
          <p className="mt-3 text-xs sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            The modern ledger for trips, flatmates, and events. Log shared bills, itemize meals, and let Splid minimize payments so nobody owes awkward loose ends.
          </p>

          {/* Quick Value Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-6">
            <div className="neu-flat p-2.5 rounded-2xl text-center">
              <Zap className="w-4 h-4 text-cyan-500 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-slate-900 dark:text-white">Minimum Cash Flow</div>
              <div className="text-[9px] text-slate-500 font-mono">Fewer transfers</div>
            </div>
            <div className="neu-flat p-2.5 rounded-2xl text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-slate-900 dark:text-white">100% Private</div>
              <div className="text-[9px] text-slate-500 font-mono">No sign-up or server</div>
            </div>
            <div className="neu-flat p-2.5 rounded-2xl text-center">
              <span className="text-sm font-bold text-teal-500 block mb-0.5">₹</span>
              <div className="text-[11px] font-bold text-slate-900 dark:text-white">Native INR (₹)</div>
              <div className="text-[9px] text-slate-500 font-mono">Indian numbering</div>
            </div>
            <div className="neu-flat p-2.5 rounded-2xl text-center">
              <FileDown className="w-4 h-4 text-[#f07864] mx-auto mb-1" />
              <div className="text-[11px] font-bold text-slate-900 dark:text-white">PDF & WhatsApp</div>
              <div className="text-[9px] text-slate-500 font-mono">1-tap summary share</div>
            </div>
          </div>
        </div>

        {/* ==========================================================
            2. PRIMARY WORKSPACE: CREATE GROUP + LIVE SIMULATOR
            ========================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14">
          
          {/* LEFT: GROUP CREATOR CARD */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-7 neu-raised p-6 sm:p-8 rounded-3xl relative overflow-hidden"
          >
            {/* Card Header with Template Quick-Picks */}
            <div className="pb-5 border-b border-slate-300/60 dark:border-white/5 mb-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl neu-icon-socket flex items-center justify-center text-2xl shrink-0">
                    {emoji}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                      Start Your Group Ledger
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Shared expense tracker for friends, flatmates, or holidays
                    </p>
                  </div>
                </div>
              </div>

              {/* 1-Click Quick Preset Templates */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2 font-bold">
                  Quick-Start Templates (1-Click Fill)
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.name}
                      type="button"
                      onClick={() => handleApplyTemplate(tpl)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        activeTemplate === tpl.name
                          ? 'neu-inset text-teal-600 dark:text-teal-300 font-bold'
                          : 'neu-btn text-slate-700 dark:text-slate-300 hover:text-teal-500'
                      }`}
                    >
                      <span>{tpl.emoji} {tpl.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Emoji Selector */}
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block mb-1.5">
                  Trip Icon
                </label>
                <div className="flex items-center gap-2 overflow-x-auto py-1.5 px-1">
                  {emojis.map((em) => {
                    const isSelected = emoji === em;
                    return (
                      <button
                        key={em}
                        type="button"
                        onClick={() => {
                          setEmoji(em);
                          setActiveTemplate(null);
                        }}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all shrink-0 ${
                          isSelected
                            ? 'neu-btn-primary'
                            : 'neu-btn opacity-80 hover:opacity-100'
                        }`}
                      >
                        <span className="leading-none select-none">{em}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Group Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                  Group / Trip Name *
                </label>
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => {
                    setGroupName(e.target.value);
                    setActiveTemplate(null);
                  }}
                  placeholder="e.g. Goa Vacation, Flat 304, Manali Trek"
                  required
                  autoFocus
                  className="w-full neu-input px-3.5 py-2.5 rounded-2xl text-sm font-bold focus:outline-none placeholder-slate-400"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 4-day weekend trip with college friends"
                  className="w-full neu-input px-3.5 py-2 rounded-xl text-xs focus:outline-none placeholder-slate-400"
                />
              </div>

              {/* Member Tag Manager */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                    Group Members ({members.length})
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Add friends who will share bills
                  </span>
                </div>

                <div className="neu-sunken p-3 rounded-2xl flex flex-wrap gap-2 min-h-[48px] items-center">
                  {members.map((name) => (
                    <span
                      key={name}
                      className="neu-inset inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-teal-700 dark:text-teal-300 text-xs font-semibold"
                    >
                      <span>{name}</span>
                      {members.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(name)}
                          className="hover:text-red-500 p-0.5 rounded-full"
                          title="Remove member"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                {/* Add Member Input Bar */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={memberInput}
                    onChange={(e) => setMemberInput(e.target.value)}
                    placeholder="Type friend's name (e.g. Vikram)"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddMember(e);
                      }
                    }}
                    className="flex-1 neu-input px-3.5 py-2 rounded-xl text-xs focus:outline-none placeholder-slate-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddMember}
                    className="neu-btn px-4 py-2 rounded-xl text-xs font-bold text-teal-600 dark:text-teal-300 shrink-0"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-300/60 dark:border-white/5 flex items-center justify-between gap-3">
                <div className="text-[11px] text-slate-500 hidden sm:block">
                  All calculations run 100% in your browser
                </div>
                <button
                  type="submit"
                  disabled={!groupName.trim()}
                  className="w-full sm:w-auto neu-btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold disabled:opacity-50"
                >
                  <span>Create Group & Start Splitting</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>

          {/* RIGHT: LIVE DEBT SIMULATOR PREVIEW */}
          <div className="lg:col-span-5 space-y-5">
            {/* Simulator Card */}
            <div className="neu-flat p-6 rounded-3xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-300/60 dark:border-white/5 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
                    How Splid Simplifies Debts
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full neu-inset text-teal-600 dark:text-teal-300 font-bold">
                  Algorithm
                </span>
              </div>

              {/* Before vs After comparison */}
              <div className="space-y-3.5">
                <div className="neu-sunken p-3.5 rounded-2xl">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-rose-500">Traditional Splitting</span>
                    <span className="text-[10px] font-mono text-slate-400">4 People • 6 Cross-Debts</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Rahul owes Priya ₹800, Priya owes Amit ₹600, Amit owes Rahul ₹300... Endless back-and-forth UPI requests!
                  </p>
                </div>

                <div className="flex items-center justify-center">
                  <div className="neu-icon-disc p-1.5 rounded-full text-teal-500">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                </div>

                <div className="neu-raised p-4 rounded-2xl border border-teal-500/20">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-teal-500" />
                      Splid Net Simplification
                    </span>
                    <span className="text-[10px] font-mono text-emerald-500 font-bold">Only 2 Direct Payments!</span>
                  </div>

                  {/* Simulated Simplified Transactions */}
                  <div className="space-y-2 font-mono text-xs">
                    <div className="neu-sunken p-2.5 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-white">Rahul</span>
                        <ArrowRight className="w-3 h-3 text-teal-500" />
                        <span className="font-bold text-slate-800 dark:text-white">Priya</span>
                      </div>
                      <span className="font-black text-teal-600 dark:text-teal-300">₹1,450</span>
                    </div>

                    <div className="neu-sunken p-2.5 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 dark:text-white">Amit</span>
                        <ArrowRight className="w-3 h-3 text-teal-500" />
                        <span className="font-bold text-slate-800 dark:text-white">Priya</span>
                      </div>
                      <span className="font-black text-teal-600 dark:text-teal-300">₹850</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-2.5 text-center font-mono">
                    ✨ All other cross-debts cancel out to ₹0.00
                  </div>
                </div>
              </div>
            </div>

            {/* Quick 1-Off Split Accordion Toggle */}
            <div className="neu-flat p-4 sm:p-5 rounded-3xl">
              <button
                type="button"
                onClick={() => setShowQuickCalc(!showQuickCalc)}
                className="w-full flex items-center justify-between text-left focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl neu-icon-socket flex items-center justify-center text-cyan-500 shrink-0">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Need a 1-Time Quick Split Right Now?
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Quick lunch or dinner math without creating a group
                    </p>
                  </div>
                </div>
                <div className={`p-1.5 rounded-lg neu-btn text-slate-400 transition-transform ${showQuickCalc ? 'rotate-180' : ''}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence>
                {showQuickCalc && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden pt-4 mt-3 border-t border-slate-300/60 dark:border-white/5 space-y-3"
                  >
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Total Bill (₹)</label>
                        <input
                          type="number"
                          value={quickBill}
                          onChange={(e) => setQuickBill(e.target.value)}
                          className="w-full neu-input px-2.5 py-1.5 rounded-xl font-mono font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Guests</label>
                        <input
                          type="number"
                          min="1"
                          value={quickPeople}
                          onChange={(e) => setQuickPeople(e.target.value)}
                          className="w-full neu-input px-2.5 py-1.5 rounded-xl font-mono font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1">Tip (%)</label>
                        <input
                          type="number"
                          min="0"
                          value={quickTip}
                          onChange={(e) => setQuickTip(e.target.value)}
                          className="w-full neu-input px-2.5 py-1.5 rounded-xl font-mono font-bold text-xs"
                        />
                      </div>
                    </div>

                    <div className="neu-sunken p-3 rounded-2xl flex items-center justify-between font-mono">
                      <span className="text-xs text-slate-600 dark:text-slate-300">Each Person Pays:</span>
                      <span className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">
                        {formatCurrency(perPerson, 'INR')}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ==========================================================
            3. "WHY SPLID" 4-CARD FEATURE GRID
            ========================================================== */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400 font-bold block mb-1">
              Built For Frictionless Groups
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-sans">
              Everything You Need to Split Cleanly
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="neu-flat p-5 rounded-3xl hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-2xl neu-icon-socket flex items-center justify-center text-teal-500 mb-3.5">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                Greedy Debt Minimizer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Collapses complex multi-person cross loans into the theoretical minimum number of direct payments.
              </p>
            </div>

            <div className="neu-flat p-5 rounded-3xl hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-2xl neu-icon-socket flex items-center justify-center text-cyan-500 mb-3.5">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                Equal & Itemized Splits
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Split bills evenly across everyone, or specify exact rupee amounts and custom member allocations.
              </p>
            </div>

            <div className="neu-flat p-5 rounded-3xl hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-2xl neu-icon-socket flex items-center justify-center text-[#f07864] mb-3.5">
                <FileDown className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                Branded PDF Statements
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Export clean, printable PDF reports with individual spending summaries, settlements, and receipt logs.
              </p>
            </div>

            <div className="neu-flat p-5 rounded-3xl hover:-translate-y-1 transition-all">
              <div className="w-10 h-10 rounded-2xl neu-icon-socket flex items-center justify-center text-emerald-500 mb-3.5">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                1-Tap WhatsApp Summaries
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Generate formatted payment reminders ready to paste directly into your trip or roommate WhatsApp group.
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================================
            4. HOW IT WORKS 3-STEP PIPELINE
            ========================================================== */}
        <div className="neu-flat p-6 sm:p-10 rounded-3xl mb-16">
          <div className="text-center max-w-lg mx-auto mb-8">
            <span className="text-[11px] font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400 font-bold block mb-1">
              Three Simple Steps
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-sans">
              How Splid Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="neu-sunken p-5 rounded-2xl text-center">
              <div className="w-10 h-10 rounded-xl neu-icon-disc mx-auto mb-3 flex items-center justify-center font-mono font-bold text-xs text-teal-600 dark:text-teal-400">
                01
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Create Trip & Add Friends
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pick a trip icon, name your group, and add members. No accounts or phone numbers required.
              </p>
            </div>

            <div className="neu-sunken p-5 rounded-2xl text-center">
              <div className="w-10 h-10 rounded-xl neu-icon-disc mx-auto mb-3 flex items-center justify-center font-mono font-bold text-xs text-cyan-600 dark:text-cyan-400">
                02
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Log Shared Bills As You Go
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Record dining, hotels, cabs, or groceries. Select who paid and who was part of the expense.
              </p>
            </div>

            <div className="neu-sunken p-5 rounded-2xl text-center">
              <div className="w-10 h-10 rounded-xl neu-icon-disc mx-auto mb-3 flex items-center justify-center font-mono font-bold text-xs text-[#f07864]">
                03
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Settle in Minimum Steps
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Splid calculates the exact minimal transfers. Share reminders to WhatsApp or export a clean PDF.
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================================
            5. FREQUENTLY ASKED QUESTIONS
            ========================================================== */}
        <div className="max-w-4xl mx-auto mb-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full neu-inset text-xs font-semibold text-teal-700 dark:text-teal-300 mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-teal-500" />
              <span>Got Questions?</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-sans">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="neu-flat rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {faq.q}
                    </span>
                    <div className={`p-1 rounded-lg neu-btn text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-teal-500' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-200/50 dark:border-white/5 pt-3"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
