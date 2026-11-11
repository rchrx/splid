import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How do I calculate a tip?',
      a: 'Simply enter your total bill amount, select your preferred tip percentage (such as 15%, 18%, or 20%), or use our interactive slider. The calculator automatically applies the formula: Tip Amount = Bill Amount × (Tip % / 100) and displays the grand total in real-time.',
    },
    {
      q: 'How does the bill-splitting calculator work?',
      a: 'Splid divides your grand total (bill subtotal + tip + tax + any extra charges) equally across the number of guests. You can adjust the number of people using the quick +/- buttons or enter the exact head count. We also support round-up options so nobody has to deal with awkward loose coins.',
    },
    {
      q: 'Can I split a bill unevenly?',
      a: 'Yes! Check out our "Multi-Person Custom Expense Split" section right below the main dashboard. You can add guests by name, enter their individual food/drink totals or percentage shares, and allocate custom tips. Splid automatically validates the balance so every single rupee is accounted for.',
    },
    {
      q: 'Can I calculate tips for multiple people?',
      a: 'Absolutely. Splid shows both the overall tip amount and the exact tip per person. You can also view the base subtotal per person alongside the tip contribution.',
    },
    {
      q: 'What currency does the calculator use?',
      a: 'Splid is optimized for Indian Rupees (₹ - INR) with native Indian numbering formatting (lakhs, crores, and thousands).',
    },
    {
      q: 'Is Splid free to use and does it store my private data?',
      a: 'Splid is 100% free with no registration required. All calculations run entirely inside your browser client. Your data is never sent to any external server, and recent calculations are saved purely in your local browser storage.',
    },
  ];

  return (
    <section id="faq" className="py-20 md:py-28 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border-teal-500/20 text-xs font-semibold text-teal-700 dark:text-teal-300 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-teal-500 dark:text-teal-400" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
            Got Questions?{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
              We Have Answers.
            </span>
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Everything you need to know about tipping etiquette, split math, and receipt exports.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="glass-panel-elevated rounded-2xl border border-white/10 dark:border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl glass-input flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-teal-500' : 'text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-sm sm:text-base text-slate-600 dark:text-slate-300/90 leading-relaxed border-t border-white/5 dark:border-white/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

