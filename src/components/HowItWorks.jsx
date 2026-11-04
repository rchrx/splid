import React from 'react';
import { motion } from 'framer-motion';
import { ReceiptText, Sliders, CheckCircle2, ArrowRight } from 'lucide-react';

export const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      title: 'Enter Your Bill',
      description: 'Input your raw receipt amount, choose your global currency, and optionally add tax or custom charges.',
      icon: ReceiptText,
      accent: 'from-purple-500 to-indigo-600',
      badge: 'Step 1',
    },
    {
      step: '02',
      title: 'Customize Your Split',
      description: 'Select your preferred tip rate or service tier, adjust guest count, or assign individual itemized totals.',
      icon: Sliders,
      accent: 'from-cyan-500 to-blue-600',
      badge: 'Step 2',
    },
    {
      step: '03',
      title: 'Settle & Share',
      description: 'Instantly view fair per-person shares, copy breakdown texts to group chats, or export a sleek PDF receipt.',
      icon: CheckCircle2,
      accent: 'from-pink-500 to-purple-600',
      badge: 'Step 3',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-cyan-500/20 text-xs font-semibold text-cyan-400 mb-3">
            <span>Seamless Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            How It Works in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Three Simple Steps
            </span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            From the arrival of the bill to settled payments in under ten seconds.
          </p>
        </div>

        {/* Steps Grid with Connected Visual Line */}
        <div className="relative">
          {/* Connector Line behind cards on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-16 right-16 h-0.5 bg-gradient-to-r from-purple-500/40 via-cyan-500/40 to-pink-500/40 -translate-y-12 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  className="glass-panel-elevated p-8 rounded-3xl border border-white/10 dark:border-white/10 relative overflow-hidden group hover:border-purple-500/40 transition-all shadow-glass"
                >
                  {/* Step Number Watermark */}
                  <div className="absolute top-4 right-6 text-5xl font-black font-mono text-white/[0.04] select-none pointer-events-none group-hover:text-white/[0.08] transition-colors">
                    {item.step}
                  </div>

                  {/* Icon Badge */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${item.accent} flex items-center justify-center text-white shadow-lg mb-6 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 font-bold block mb-1">
                    {item.badge}
                  </span>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

