import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Users, 
  Zap, 
  Coins, 
  Share2 
} from 'lucide-react';

export const Hero = () => {
  const scrollToCalculator = (e) => {
    e.preventDefault();
    const target = document.getElementById('calculator');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFeatures = (e) => {
    e.preventDefault();
    const target = document.getElementById('features');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Ambient glowing radial orbs behind hero */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-purple-600/25 via-indigo-500/20 to-cyan-500/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-purple-700/15 blur-[100px] rounded-full pointer-events-none -z-10 animate-blob" />
      <div className="absolute top-1/2 right-10 w-80 h-80 bg-cyan-600/15 blur-[110px] rounded-full pointer-events-none -z-10 animate-blob [animation-delay:4s]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Floating pill badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass-panel border-purple-500/30 text-xs font-semibold text-purple-700 dark:text-purple-300 shadow-glass mb-8 hover:border-purple-500/50 transition-colors"
        >
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="tracking-wide">Next-Generation FinTech Split Engine 2.0</span>
          <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-[10px] text-purple-600 dark:text-purple-200 uppercase font-mono">
            Zero Math Friction
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1] font-sans"
        >
          Split the Bill.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-violet-300 to-cyan-300">
            Not the Experience.
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300/90 max-w-2xl mx-auto font-normal leading-relaxed"
        >
          Calculate tips, divide expenses, and settle bills effortlessly. The smartest way to make every dining experience fair, accurate, and stress-free.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#calculator"
            onClick={scrollToCalculator}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-glass-glow hover:shadow-neon-purple transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-5 h-5 text-purple-200" />
            <span>Start Calculating</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </a>

          <a
            href="#features"
            onClick={scrollToFeatures}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold text-slate-800 dark:text-slate-200 glass-panel hover:bg-white/10 dark:hover:bg-white/[0.08] hover:border-white/20 transition-all duration-300"
          >
            <span>Explore Features</span>
          </a>
        </motion.div>

        {/* Floating Stat Badges */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto"
        >
          <div className="glass-panel p-4 rounded-2xl flex items-center gap-3 text-left hover:border-purple-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-electric-purple shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">100% Accurate</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Zero rounding bias</div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex items-center gap-3 text-left hover:border-cyan-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Real-Time Sync</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Instant recalculation</div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex items-center gap-3 text-left hover:border-purple-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Unequal Splits</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Itemized contributions</div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex items-center gap-3 text-left hover:border-pink-500/30 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">PDF & Share</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Export clean receipts</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

