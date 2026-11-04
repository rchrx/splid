import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  History, 
  Trash2, 
  ArrowUpRight, 
  Download, 
  Receipt, 
  Users, 
  DollarSign 
} from 'lucide-react';
import { formatCurrency } from '../utils/currency';

export const HistoryDrawer = ({
  isOpen,
  onClose,
  history = [],
  onLoad,
  onDelete,
  onClear,
  onNotify,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md glass-panel-elevated bg-midnight-950/95 dark:bg-midnight-950/95 p-6 shadow-2xl border-l border-white/10 flex flex-col justify-between"
        >
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-electric-purple">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Calculation History</h3>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {history.length} {history.length === 1 ? 'saved record' : 'saved records'}
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl glass-input text-slate-400 hover:text-white transition-colors"
                aria-label="Close history"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List */}
            <div className="mt-6 space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {history.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400 mb-3">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">No Saved Bills Yet</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    Click the "Save" bookmark button on any calculation in the dashboard to store it here for future reference.
                  </p>
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl glass-panel border border-white/10 hover:border-purple-500/40 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="text-xs font-bold text-white truncate max-w-[200px]">
                          {item.note}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {new Date(item.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-cyan-400">
                          {formatCurrency(item.calculation.finalTotal, item.currency)}
                        </div>
                        <div className="text-[10px] font-mono text-purple-300">
                          {formatCurrency(item.calculation.amountPerPerson, item.currency)} / person
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono text-slate-400">
                      <span>{item.numberOfPeople} people • Tip {item.tipPercentage}%</span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            onLoad(item);
                            onClose();
                            if (onNotify) onNotify('Calculation loaded into dashboard', 'success');
                          }}
                          className="px-2 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 hover:text-white transition-colors flex items-center gap-1"
                          title="Load this into calculator"
                        >
                          <span>Load</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-1 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer Actions */}
          {history.length > 0 && (
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  if (confirm('Clear all saved calculations from this browser?')) {
                    onClear();
                    if (onNotify) onNotify('History cleared', 'info');
                  }
                }}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl glass-input text-xs font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

