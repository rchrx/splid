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
  currency = 'USD',
}) => {
  if (!group?.expenses || group.expenses.length === 0) return null;

  const chartData = categoryBreakdown.map((item) => {
    const cat = getCategoryById(item.category);
    return {
      name: cat.name,
      value: item.value,
      color: CATEGORY_COLORS[item.category] || '#a855f7',
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
    <section id="analytics" className="py-6 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-electric-purple">
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
          <div className="lg:col-span-7 glass-panel-elevated p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-white/10">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-3">
              Category Distribution
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              <div className="sm:col-span-6 h-48 sm:h-52 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val) => formatCurrency(val, currency)}
                      contentStyle={{
                        background: '#0b0f1d',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        fontSize: '11px',
                        color: '#fff',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="sm:col-span-6 space-y-2">
                {chartData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
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
              <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold block mb-1">
                  Top Spender in Group
                </span>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-base font-bold text-slate-900 dark:text-white">{topSpender.name}</h5>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Fronted the most group bills</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black font-mono text-cyan-600 dark:text-cyan-400">
                      {formatCurrency(topSpender.paid, currency)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Highest Single Expense */}
            {highestExpense && (
              <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10">
                <span className="text-[10px] font-mono uppercase tracking-wider text-pink-600 dark:text-pink-400 font-bold block mb-1">
                  Largest Single Expense
                </span>
                <div className="flex items-center justify-between">
                  <div className="truncate pr-2">
                    <h5 className="text-base font-bold text-slate-900 dark:text-white truncate">{highestExpense.title}</h5>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{highestExpense.date}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-black font-mono text-pink-600 dark:text-pink-400">
                      {formatCurrency(highestExpense.amount, currency)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Total Settlements Count */}
            <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-white/10">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
