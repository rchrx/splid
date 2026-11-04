import React from 'react';
import { Calculator, Shield, ArrowUp } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="pt-12 pb-10 border-t border-slate-200 dark:border-white/10 relative overflow-hidden bg-slate-100/50 dark:bg-midnight-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-200 dark:border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 shadow-sm p-1 overflow-hidden shrink-0">
                <img src="/logo.png" alt="Dibbl Logo" className="w-full h-full object-contain drop-shadow-sm" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white font-sans leading-none">
                  Dib<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">bl</span>
                </span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium tracking-wide mt-0.5">
                  Split Smart. Pay Fair
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              The premier glassmorphism group expense tracker and smart debt settlement engine. Built for friends, flatmates, and trips who value fairness and frictionless payments.
            </p>

            <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                <span>100% Client-Side Privacy</span>
              </span>
              <span>•</span>
              <span>Zero Tracking</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-white font-bold">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <a href="#settlements" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Who Pays Whom
                </a>
              </li>
              <li>
                <a href="#members" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Members & Net Balances
                </a>
              </li>
              <li>
                <a href="#expenses" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Expense History
                </a>
              </li>
              <li>
                <a href="#analytics" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Category Analytics
                </a>
              </li>
            </ul>
          </div>

          {/* Standards & Security */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-white font-bold">
              Features
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>Minimum Cash Flow Simplification</li>
              <li>Itemized & Equal Splits</li>
              <li>Multi-Currency Support</li>
              <li>PDF Statement Export</li>
              <li>WhatsApp Group Sharing</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>© {new Date().getFullYear()} Dibbl. All debts mathematically simplified and balanced.</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-input text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-purple-400/50 transition-colors"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
