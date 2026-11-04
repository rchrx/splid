import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Sun, 
  Moon, 
  Plus, 
  ChevronDown, 
  FolderPlus, 
  Check,
  Users2
} from 'lucide-react';
import { CURRENCIES, getCurrencyConfig } from '../utils/currency';

export const Navbar = ({
  theme,
  toggleTheme,
  currency,
  onCurrencyChange,
  groups = [],
  activeGroupId,
  onSelectGroup,
  onOpenNewGroupModal,
  onOpenAddExpenseModal,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];
  const currentCurrencyObj = getCurrencyConfig(currency);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 py-3 px-3 sm:px-6 lg:px-8">
      <div
        className={`max-w-7xl mx-auto rounded-3xl transition-all duration-300 ${
          scrolled
            ? 'glass-panel-elevated py-2.5 px-3.5 sm:px-6 shadow-2xl border-white/10 dark:border-white/10 border-slate-200/80'
            : 'glass-panel py-3 px-3.5 sm:px-6 border-white/5 dark:border-white/5 border-slate-200/60'
        } flex items-center justify-between backdrop-blur-xl`}
      >
        {/* Brand Logo & Group Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          <a
            href="#"
            className="flex items-center gap-2.5 group focus:outline-none shrink-0"
          >
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-purple-500/20 via-violet-500/10 to-cyan-500/20 border border-purple-500/30 p-1.5 shadow-neon-purple transition-transform duration-300 group-hover:scale-105 shrink-0 backdrop-blur-md">
              <img src="/logo.png" alt="Dibbl Logo" className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(168,85,247,0.5)]" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white font-sans">
                  Dib<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">bl</span>
                </span>
                <span className="hidden sm:inline-block text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20 font-bold tracking-wider">
                  PRO
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block tracking-wide font-medium mt-0.5">
                Split Smart. Pay Fair
              </span>
            </div>
          </a>

          {groups.length > 0 && (
            <>
              <div className="h-4 w-[1px] bg-slate-300 dark:bg-white/10 hidden sm:block shrink-0" />

              {/* Group Switcher Dropdown */}
              <div className="relative min-w-0">
                <button
                  onClick={() => setGroupDropdownOpen(!groupDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-2xl glass-input text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-purple-400/50 transition-all max-w-[140px] sm:max-w-[220px]"
                >
                  <span className="text-sm shrink-0">{activeGroup?.emoji || '📁'}</span>
                  <span className="truncate">{activeGroup?.name || 'Select Group'}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-0.5" />
                </button>

                {groupDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setGroupDropdownOpen(false)}
                    />
                    <div className="absolute left-0 mt-2 w-64 py-2 glass-panel-elevated bg-white dark:bg-midnight-950 rounded-2xl z-20 shadow-2xl border border-slate-200 dark:border-white/10 max-h-80 overflow-y-auto">
                      <div className="px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                        Your Groups ({groups.length})
                      </div>

                      {groups.map((grp) => (
                        <button
                          key={grp.id}
                          onClick={() => {
                            onSelectGroup(grp.id);
                            setGroupDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors ${
                            activeGroupId === grp.id
                              ? 'bg-purple-600/15 text-purple-600 dark:text-purple-300 font-bold'
                              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span className="shrink-0">{grp.emoji}</span>
                            <span className="truncate">{grp.name}</span>
                          </span>
                          {activeGroupId === grp.id && <Check className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400 shrink-0" />}
                        </button>
                      ))}

                      <div className="pt-2 mt-1 border-t border-slate-100 dark:border-white/10 px-2">
                        <button
                          onClick={() => {
                            setGroupDropdownOpen(false);
                            onOpenNewGroupModal();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-colors"
                        >
                          <FolderPlus className="w-4 h-4" />
                          <span>Create New Group</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Currency Dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl glass-input text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-purple-400/40 transition-colors"
              title="Select Currency"
            >
              <span>{currentCurrencyObj.flag}</span>
              <span className="font-mono">{currentCurrencyObj.code}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {currencyDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setCurrencyDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-52 py-2 glass-panel-elevated bg-white dark:bg-midnight-950 rounded-2xl z-20 shadow-2xl border border-slate-200 dark:border-white/10 max-h-64 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Select Currency
                  </div>
                  {CURRENCIES.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => {
                        onCurrencyChange(curr.code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors ${
                        currency === curr.code
                          ? 'bg-purple-600/15 text-purple-600 dark:text-purple-300 font-bold'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{curr.flag}</span>
                        <span>{curr.name}</span>
                      </span>
                      <span className="font-mono text-slate-400">{curr.symbol}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl glass-input text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-300 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-300 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Primary Action Button */}
          {groups.length > 0 ? (
            <button
              onClick={onOpenAddExpenseModal}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-violet-600 to-cyan-500 hover:opacity-95 shadow-glass-glow hover:shadow-neon-purple transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
          ) : (
            <button
              onClick={onOpenNewGroupModal}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-cyan-500 hover:opacity-95 shadow-glass-glow transition-all"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Create Group</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
