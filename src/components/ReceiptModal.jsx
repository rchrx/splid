import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  FileDown, 
  Share2, 
  Receipt, 
  Check, 
  Copy, 
  Sparkles,
  Calendar,
  Users
} from 'lucide-react';
import { formatCurrency, getCurrencyConfig } from '../utils/currency';
import { downloadReceiptPDF, copyToClipboard, generateShareText } from '../utils/receipt';

export const ReceiptModal = ({
  isOpen,
  onClose,
  calculation,
  currency = 'USD',
  onNotify,
}) => {
  if (!isOpen || !calculation) return null;

  const [receiptTitle, setReceiptTitle] = useState('Dinner Bill Settlement');
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const currencyConfig = getCurrencyConfig(currency);

  const handleDownloadPDF = async () => {
    try {
      setDownloading(true);
      downloadReceiptPDF({
        calculation,
        currency,
        title: receiptTitle,
      });
      if (onNotify) onNotify('Receipt PDF downloaded successfully!', 'success');
    } catch (e) {
      console.error(e);
      if (onNotify) onNotify('Failed to generate PDF', 'error');
    } finally {
      setDownloading(false);
    }
  };

  const handleCopySummary = async () => {
    const text = generateShareText({ calculation, currency });
    await copyToClipboard(text);
    setCopied(true);
    if (onNotify) onNotify('Receipt summary copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg glass-panel-elevated bg-midnight-950/95 dark:bg-midnight-950/95 p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl z-10 overflow-hidden"
      >
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-600/20 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-electric-purple">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Digital Bill Receipt</h3>
              <p className="text-[11px] text-slate-400">Official Settlement Summary</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl glass-input text-slate-400 hover:text-white transition-colors"
            aria-label="Close receipt modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Mock Paper Card */}
        <div className="bg-slate-900/90 dark:bg-midnight-900/90 rounded-2xl p-5 border border-white/10 font-mono text-xs text-slate-300 relative shadow-inner mb-6">
          {/* Top Brand Banner */}
          <div className="text-center pb-4 border-b border-dashed border-white/15">
            <div className="text-sm font-extrabold tracking-wider text-white">DIBBL RECEIPT</div>
            <input
              type="text"
              value={receiptTitle}
              onChange={(e) => setReceiptTitle(e.target.value)}
              className="text-center bg-transparent text-xs text-purple-300 font-semibold focus:outline-none border-b border-transparent hover:border-white/20 focus:border-purple-400 mt-1 w-full"
              placeholder="Tap to set bill description"
            />
            <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-center gap-2">
              <Calendar className="w-3 h-3" />
              <span>{formattedDate}</span>
              <span>•</span>
              <Users className="w-3 h-3" />
              <span>{calculation.numberOfPeople} Guests</span>
            </div>
          </div>

          {/* Line Items */}
          <div className="py-4 space-y-2 border-b border-dashed border-white/15">
            <div className="flex justify-between">
              <span className="text-slate-400">Subtotal</span>
              <span className="font-bold text-white">{formatCurrency(calculation.subtotal, currency)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Gratuity / Tip ({calculation.tipPercentage}%)</span>
              <span className="font-bold text-cyan-400">+{formatCurrency(calculation.tipAmount, currency)}</span>
            </div>

            {calculation.taxAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-400">Tax / VAT</span>
                <span className="font-bold text-pink-400">+{formatCurrency(calculation.taxAmount, currency)}</span>
              </div>
            )}

            {calculation.additionalCharges > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-400">Extra Service Fees</span>
                <span className="font-bold text-amber-400">+{formatCurrency(calculation.additionalCharges, currency)}</span>
              </div>
            )}

            {calculation.roundUpDifference > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-400">Round-Up Adjustment</span>
                <span className="font-bold text-emerald-400">+{formatCurrency(calculation.roundUpDifference, currency)}</span>
              </div>
            )}
          </div>

          {/* Grand Total Row */}
          <div className="pt-3 pb-2 space-y-2">
            <div className="flex justify-between text-sm font-bold text-white">
              <span>TOTAL BILL</span>
              <span className="text-base text-purple-300">{formatCurrency(calculation.finalTotal, currency)}</span>
            </div>

            {/* Per person callout inside receipt */}
            <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-200">EACH PERSON PAYS</span>
              <span className="text-base font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-cyan-300">
                {formatCurrency(calculation.amountPerPerson, currency)}
              </span>
            </div>
          </div>

          <div className="text-center text-[9px] text-slate-500 pt-3 border-t border-dashed border-white/10">
            Powered by Dibbl • Client-Side Security Verified
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-500 hover:opacity-95 shadow-glass-glow transition-all disabled:opacity-50"
          >
            <FileDown className="w-4 h-4" />
            <span>{downloading ? 'Generating PDF...' : 'Download PDF Receipt'}</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold glass-input text-slate-200 hover:text-white hover:border-purple-400/50 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

