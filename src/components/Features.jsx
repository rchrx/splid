import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  Users, 
  Percent, 
  Globe2, 
  Split, 
  Zap, 
  Smartphone, 
  Share2, 
  Sparkles 
} from 'lucide-react';

export const Features = () => {
  const features = [
    {
      icon: Calculator,
      title: 'Smart Tip Calculator',
      description: 'Calculate tips instantly with intelligent service presets, adaptive rounding, and zero math friction.',
      gradient: 'from-purple-500/20 to-indigo-500/10',
      iconColor: 'text-purple-400',
      badge: 'Zero Friction',
    },
    {
      icon: Users,
      title: 'Easy Bill Splitting',
      description: 'Divide checks smoothly among 1 to 100+ friends without awkward discussions or manual ledger work.',
      gradient: 'from-cyan-500/20 to-blue-500/10',
      iconColor: 'text-cyan-400',
      badge: 'Up to 100+ guests',
    },
    {
      icon: Percent,
      title: 'Custom Tip Percentage',
      description: 'Choose any tip percentage from 0% to 100% or slide smoothly to fine-tune your gratuity to the penny.',
      gradient: 'from-pink-500/20 to-rose-500/10',
      iconColor: 'text-pink-400',
      badge: 'Full Control',
    },
    {
      icon: Globe2,
      title: 'Indian Rupee (₹)',
      description: 'Native INR support with regional numbering formatting, seamless settlements, and WhatsApp summaries.',
      gradient: 'from-emerald-500/20 to-teal-500/10',
      iconColor: 'text-emerald-400',
      badge: 'INR Engine',
    },
    {
      icon: Split,
      title: 'Unequal Splitting',
      description: 'Itemize dishes and assign unequal contributions with automatic tax distribution and balance verification.',
      gradient: 'from-amber-500/20 to-orange-500/10',
      iconColor: 'text-amber-400',
      badge: '100% Fair',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Watch all calculations update live with micro-second reactive performance as you type or slide.',
      gradient: 'from-violet-500/20 to-purple-500/10',
      iconColor: 'text-violet-400',
      badge: 'Zero Latency',
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Engineered for thumb-friendly one-handed restaurant table use on iOS, Android, tablets, and desktops.',
      gradient: 'from-blue-500/20 to-cyan-500/10',
      iconColor: 'text-blue-400',
      badge: 'Responsive',
    },
    {
      icon: Share2,
      title: 'Share & PDF Export',
      description: 'Generate clean text summaries for WhatsApp, or download high-resolution PDF receipts with one tap.',
      gradient: 'from-rose-500/20 to-purple-500/10',
      iconColor: 'text-rose-400',
      badge: 'Export PDF',
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-purple-500/20 text-xs font-semibold text-purple-700 dark:text-purple-300 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Built for Modern Dining</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            Designed for Simplicity.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Engineered for Precision.
            </span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Every feature is crafted to eliminate awkward math at the dinner table and give everyone confidence in what they pay.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass-panel p-6 rounded-3xl border border-white/10 dark:border-white/10 relative overflow-hidden group hover:border-purple-500/40 hover:shadow-glass-glow transition-all"
              >
                {/* Ambient Card Background Gradient */}
                <div
                  className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${feat.gradient} blur-2xl rounded-full opacity-60 group-hover:opacity-100 transition-opacity`}
                />

                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl glass-panel-elevated flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:border-purple-500/40 transition-all duration-300">
                    <Icon className={`w-6 h-6 ${feat.iconColor}`} />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

