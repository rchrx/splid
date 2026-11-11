import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { BarChart3, TrendingUp, Sparkles, Receipt } from 'lucide-react';
import { getCategoryById } from '../utils/categories';
import { formatCurrency } from '../utils/currency';

const CATEGORY_COLORS = {
  food: '#8b5cf6',
  transport: '#06b6d4',
  stay: '#3b82f6',
  groceries: '#10b981',
  entertainment: '#ec4899',
  utilities: '#f59e0b',
  travel: '#0ea5e9',
  general: '#64748b',
};

export const AnalyticsSection = ({
  group,
  categoryBreakdown = [],
  balances = [],
  currency = 'INR',
}) => {
  if (!group?.expenses || group.expenses.length === 0) {
    return (
      <section id="analytics" className="py-4 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="neu-flat p-6 sm:p-8 rounded-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-300/60 dark:border-white/5 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl neu-icon-socket flex items-center justify-center text-teal-600 dark:text-teal-400">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Spending Analytics & Category Insights
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Live visual distributions and top spender rankings activate once bills are logged
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono px-3 py-1 rounded-full neu-inset text-slate-500 dark:text-slate-400 self-start sm:self-auto font-bold">
                Awaiting First Bill
              </span>
            </div>

            {/* Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="neu-sunken p-4 rounded-2xl text-center">
                <div className="text-xl mb-1">🍕</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Food & Dining</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Ready to track</div>
              </div>
              <div className="neu-sunken p-4 rounded-2xl text-center">
                <div className="text-xl mb-1">🚕</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Rides & Cabs</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Ready to track</div>
              </div>
              <div className="neu-sunken p-4 rounded-2xl text-center">
                <div className="text-xl mb-1">🏨</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Accommodation</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Ready to track</div>
              </div>
              <div className="neu-sunken p-4 rounded-2xl text-center">
                <div className="text-xl mb-1">🛒</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Groceries & Misc</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">Ready to track</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const chartData = categoryBreakdown.map((item) => {
    const cat = getCategoryById(item.category);
    return {
      name: cat.name,
      value: item.value,
      color: CATEGORY_COLORS[item.category] || '#8b5cf6',
    };
  });

  // Top spender
  const topSpender = balances.reduce(
    (max, m) => (m.paid > (max?.paid || 0) ? m : max),
    balances[0]
  );

  // Highest expense
  const highestExpense = group.expenses.reduce(
    (max, e) => (e.amount > (max?.amount || 0) ? e : max),
    group.expenses[0]
  );

  return (
    <section id="analytics" className="py-3 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-2xl neu-icon-socket flex items-center justify-center text-teal-600 dark:text-teal-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Spending Analytics & Insights
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Breakdown of expenses by category and member contributions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Category Donut Chart */}
          <div className="lg:col-span-7 neu-flat p-5 sm:p-6 rounded-3xl">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-3.5">
              Category Distribution
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-6 h-48 sm:h-52 flex items-center justify-center neu-sunken rounded-2xl p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={46}
                      outerRadius={76}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="transparent"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => formatCurrency(val, currency)}
                      contentStyle={{
                        background: 'var(--neu-surface)',
                        border: '1px solid var(--neu-border)',
                        borderRadius: '16px',
                        fontSize: '11px',
                        color: 'var(--neu-text-primary)',
                        boxShadow: '4px 4px 12px var(--neu-shadow)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="sm:col-span-6 space-y-2">
                {chartData.map((item) => (
                  <div key={item.name} className="neu-sunken px-3 py-2 rounded-xl flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ background: item.color }} />
                      <span className="truncate">{item.name}</span>
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {formatCurrency(item.value, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Insights Cards */}
          <div className="lg:col-span-5 space-y-3.5">
            {/* Top Spender */}
            {topSpender && (
              <div className="neu-flat p-4 sm:p-5 rounded-3xl hover:-translate-y-0.5 transition-all">
                <span className="text-[10px] font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400 font-bold block mb-1">
                  Top Spender in Group
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-base font-bold text-slate-900 dark:text-white">{topSpender.name}</h5>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Fronted the most group bills</span>
                  </div>
                  <div className="neu-sunken px-3 py-1.5 rounded-xl text-right">
                    <div className="text-lg font-black font-mono text-cyan-600 dark:text-cyan-400">
                      {formatCurrency(topSpender.paid, currency)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Highest Single Expense */}
            {highestExpense && (
              <div className="neu-flat p-4 sm:p-5 rounded-3xl hover:-translate-y-0.5 transition-all">
                <span className="text-[10px] font-mono uppercase tracking-wider text-pink-600 dark:text-pink-400 font-bold block mb-1">
                  Largest Single Expense
                </span>
                <div className="flex items-center justify-between">
                  <div className="truncate pr-2">
                    <h5 className="text-base font-bold text-slate-900 dark:text-white truncate">{highestExpense.title}</h5>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{highestExpense.date}</span>
                  </div>
                  <div className="neu-sunken px-3 py-1.5 rounded-xl text-right shrink-0">
                    <div className="text-lg font-black font-mono text-pink-600 dark:text-pink-400">
                      {formatCurrency(highestExpense.amount, currency)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Total Settlements Count */}
            <div className="neu-flat p-4 sm:p-5 rounded-3xl hover:-translate-y-0.5 transition-all">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold block mb-1">
                Settlements Recorded
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-base font-bold text-slate-900 dark:text-white">
                    {group.settlements?.length || 0} Payments Settled
                  </h5>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Direct member reimbursements</span>
                </div>
                <div className="neu-sunken px-3 py-1.5 rounded-xl text-right">
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">Square</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
