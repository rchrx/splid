import React from 'react';
import { motion } from 'framer-motion';
import { X, HandCoins, Trash2, Calendar, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

export const SettlementHistoryDrawer = ({
  isOpen,
  onClose,
  settlements = [],
  members = [],
  currency = 'INR',
  onDeleteSettlement,
  onNotify,
}) => {
  if (!isOpen) return null;

  const getMemberName = (id) => members.find((m) => m.id === id)?.name || 'Member';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-screen max-w-md neu-raised text-slate-800 dark:text-slate-100 p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-300/60 dark:border-white/5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl neu-icon-socket flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                  <HandCoins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Settlement History</h3>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {settlements.length} {settlements.length === 1 ? 'record' : 'records'}
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="neu-btn p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="space-y-3.5 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
              {settlements.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <div className="w-14 h-14 rounded-2xl neu-icon-socket flex items-center justify-center mx-auto text-slate-400 mb-3.5">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">No Payments Recorded Yet</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                    When members pay each other to settle their balances, record them via the "Settle Up" button.
                  </p>
                </div>
              ) : (
                settlements.map((item) => (
                  <div
                    key={item.id}
                    className="neu-flat p-4 rounded-2xl flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {getMemberName(item.fromMemberId)} paid {getMemberName(item.toMemberId)}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{item.date}</span>
                        {item.note && <span>• "{item.note}"</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(item.amount, currency)}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm('Delete this recorded settlement?')) {
                            onDeleteSettlement(item.id);
                            if (onNotify) onNotify('Settlement removed', 'info');
                          }
                        }}
                        className="neu-btn p-1.5 rounded-lg text-slate-400 hover:text-red-500"
                        title="Delete settlement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-300/60 dark:border-white/5 flex justify-end">
            <button
              onClick={onClose}
              className="neu-btn px-5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
