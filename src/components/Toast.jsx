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
              className="pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl neu-raised text-slate-800 dark:text-slate-100"
            >
              <div className="flex items-center gap-3">
                <div className="neu-icon-socket p-2 rounded-xl flex items-center justify-center shrink-0">
                  {isError ? (
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                  ) : isInfo ? (
                    <Info className="w-5 h-5 text-cyan-500 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  )}
                </div>
                <div>
                  {toast.title && (
                    <div className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-300">
                      {toast.title}
                    </div>
                  )}
                  <div className="text-xs sm:text-sm font-medium">{toast.message}</div>
                </div>
              </div>

              <button
                onClick={() => onDismiss && onDismiss(toast.id)}
                className="neu-btn p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
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
