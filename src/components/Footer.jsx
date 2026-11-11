import React from 'react';
import logoImg from '../assets/logo.png';
import { Shield, ArrowUp } from 'lucide-react';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="pt-12 pb-10 border-t border-slate-300/60 dark:border-white/5 relative bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-300/60 dark:border-white/5">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl neu-icon-disc p-1.5 shrink-0">
                <img
                  src={logoImg}
                  alt="Splid Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-sans leading-none lowercase">
                  spl<span className="text-cyan-500">i</span>d
                </span>
                <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-medium tracking-wide mt-0.5">
                  Split Smart. Pay Fair
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              The premier neomorphism group expense tracker and smart debt settlement engine. Built for friends, flatmates, and trips who value tactile elegance, fairness, and frictionless payments.
            </p>

            <div className="flex items-center gap-3 text-xs font-mono text-slate-500">
              <span className="neu-inset px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-[11px]">
                <Shield className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
                <span>100% Client-Side Privacy</span>
              </span>
              <span>•</span>
              <span className="neu-inset px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-300 text-[11px]">Zero Tracking</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-900 dark:text-white font-bold">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <a href="#settlements" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Who Pays Whom
                </a>
              </li>
              <li>
                <a href="#members" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Members & Net Balances
                </a>
              </li>
              <li>
                <a href="#expenses" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Expense History
                </a>
              </li>
              <li>
                <a href="#analytics" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
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
              <li>Tactile Neumorphic Design</li>
              <li>Minimum Cash Flow Engine</li>
              <li>Custom & Itemized Splits</li>
              <li>INR Rupee Ledger (₹)</li>
              <li>PDF Statement Download</li>
              <li>WhatsApp Group Sharing</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <span>© {new Date().getFullYear()} Splid. Tactile Neomorphic UI & Debt Engine.</span>
          </div>

          <button
            onClick={scrollToTop}
            className="neu-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-slate-600 dark:text-slate-300"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
