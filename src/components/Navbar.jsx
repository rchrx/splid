import React, { useState, useEffect } from 'react';
import logoImg from '../assets/logo.png';
import {
  Sun,
  Moon,
  Plus,
  ChevronDown,
  FolderPlus,
  Check,
  Sparkles
} from 'lucide-react';

export const Navbar = ({
  theme,
  toggleTheme,
  groups = [],
  activeGroupId,
  onSelectGroup,
  onOpenNewGroupModal,
  onOpenAddExpenseModal,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 py-3.5 px-3 sm:px-6 lg:px-8">
      <div
        className={`max-w-7xl mx-auto rounded-3xl transition-all duration-300 ${
          scrolled
            ? 'neu-raised py-2.5 px-4 sm:px-6'
            : 'neu-flat py-3 px-4 sm:px-6'
        } flex items-center justify-between`}
      >
        {/* Brand Logo & Group Switcher */}
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          <a
            href="#"
            className="flex items-center gap-2.5 group focus:outline-none shrink-0"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl neu-icon-disc p-1.5 transition-transform duration-200 group-hover:scale-105 shrink-0">
              <img
                src={logoImg}
                alt="Splid Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white font-sans lowercase">
                  spl<span className="text-cyan-500 dark:text-cyan-400">i</span>d
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block tracking-wide font-medium mt-0.5">
                Split Smart. Pay Fair
              </span>
            </div>
          </a>

          {groups.length > 0 && (
            <>
              <div className="h-5 w-[1px] bg-slate-300 dark:bg-white/10 hidden sm:block shrink-0" />

              {/* Neumorphic Group Switcher Dropdown */}
              <div className="relative min-w-0">
                <button
                  onClick={() => setGroupDropdownOpen(!groupDropdownOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-2xl neu-sunken text-xs font-semibold text-slate-800 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-300 transition-all max-w-[140px] sm:max-w-[220px]"
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
                    <div className="absolute left-0 mt-2 w-64 py-2 neu-raised rounded-2xl z-20 max-h-80 overflow-y-auto">
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
                              ? 'neu-inset text-teal-600 dark:text-teal-300 font-bold mx-1.5 rounded-xl w-[calc(100%-12px)]'
                              : 'text-slate-700 dark:text-slate-200 hover:text-teal-500'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span className="shrink-0">{grp.emoji}</span>
                            <span className="truncate">{grp.name}</span>
                          </span>
                          {activeGroupId === grp.id && (
                            <Check className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                          )}
                        </button>
                      ))}

                      <div className="pt-2 mt-2 border-t border-slate-200/60 dark:border-white/5 px-2">
                        <button
                          onClick={() => {
                            setGroupDropdownOpen(false);
                            onOpenNewGroupModal();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-teal-600 dark:text-teal-400 hover:neu-inset transition-all"
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
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          {/* Tactile Neumorphic Sliding Theme Switch */}
          <div
            onClick={toggleTheme}
            className="w-14 h-8 rounded-full neu-sunken p-1 flex items-center cursor-pointer select-none relative transition-all"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            role="button"
            aria-label="Toggle Theme"
          >
            <div
              className={`w-6 h-6 rounded-full neu-icon-disc flex items-center justify-center transform transition-transform duration-300 ease-out ${
                theme === 'dark'
                  ? 'translate-x-6 text-amber-300'
                  : 'translate-x-0 text-slate-700'
              }`}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-slate-700" />
              )}
            </div>
          </div>

          {/* Primary Action Button */}
          {groups.length > 0 ? (
            <button
              onClick={onOpenAddExpenseModal}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-bold neu-btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
          ) : (
            <button
              onClick={onOpenNewGroupModal}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-2xl text-xs font-bold neu-btn-primary"
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
