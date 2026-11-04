import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toasts = [], onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => {
          const isError = toast.type === 'error';
          const isInfo = toast.type === 'info';
          
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl glass-panel-elevated shadow-glass border ${
                isError
                  ? 'border-red-500/30 bg-red-950/40 text-red-200'
                  : isInfo
                  ? 'border-cyan-500/30 bg-cyan-950/40 text-cyan-200'
                  : 'border-purple-500/30 bg-midnight-900/90 text-slate-100'
              }`}
            >
              <div className="flex items-center gap-3">
                {isError ? (
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                ) : isInfo ? (
                  <Info className="w-5 h-5 text-cyan-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-electric-purple shrink-0" />
                )}
                <div>
                  {toast.title && <div className="text-xs font-semibold uppercase tracking-wider text-purple-300">{toast.title}</div>}
                  <div className="text-sm font-medium">{toast.message}</div>
                </div>
              </div>

              <button
                onClick={() => onDismiss && onDismiss(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Dismiss toast"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

