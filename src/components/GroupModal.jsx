import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, FolderPlus } from 'lucide-react';

export const GroupModal = ({
  isOpen,
  onClose,
  onCreateGroup,
  onNotify,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🏖️');
  const [description, setDescription] = useState('');
  const [membersInput, setMembersInput] = useState('You, Friend 1, Friend 2');

  const emojis = ['🏖️', '🌲', '🛋️', '🍕', '✈️', '🎉', '🚗', '🏔️', '⛺', '🍣', '🏢', '⛵'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const memberNames = membersInput
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    onCreateGroup({
      name: name.trim(),
      emoji,
      description: description.trim(),
      initialMembers: memberNames.length > 0 ? memberNames : ['You', 'Friend 1'],
    });

    if (onNotify) onNotify(`Created group "${name}"!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative w-full max-w-md neu-raised text-slate-800 dark:text-slate-100 p-5 sm:p-7 rounded-3xl z-10 overflow-hidden"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-300/60 dark:border-white/5 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neu-icon-socket flex items-center justify-center text-teal-600 dark:text-teal-400">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Create New Group
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track a shared trip, flat, or dinner party
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="neu-btn p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Emoji Picker */}
          <div>
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block mb-2">
              Group Icon
            </label>
            <div className="flex items-center gap-2.5 overflow-x-auto py-2.5 px-2">
              {emojis.map((em) => {
                const isSelected = emoji === em;
                return (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setEmoji(em)}
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl transition-all shrink-0 ${
                      isSelected
                        ? 'neu-btn-primary'
                        : 'neu-btn opacity-80 hover:opacity-100'
                    }`}
                  >
                    <span className="leading-none select-none">{em}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Group Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
              Group / Trip Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Goa Vacation, Apartment 202"
              required
              autoFocus
              className="w-full neu-input px-3.5 py-2.5 rounded-2xl text-sm font-semibold focus:outline-none placeholder-slate-400"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
              Short Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Shared flight, hotel & dinner expenses"
              className="w-full neu-input px-3.5 py-2 rounded-xl text-xs focus:outline-none placeholder-slate-400"
            />
          </div>

          {/* Initial Members */}
          <div className="space-y-1">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold block">
              Initial Members (Comma-separated)
            </label>
            <input
              type="text"
              value={membersInput}
              onChange={(e) => setMembersInput(e.target.value)}
              placeholder="e.g. You, Alex, Sarah, Jordan"
              className="w-full neu-input px-3.5 py-2 rounded-xl text-xs focus:outline-none placeholder-slate-400"
            />
            <span className="text-[10px] text-slate-400 block">
              You can easily add or remove members anytime later.
            </span>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-300/60 dark:border-white/5 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="neu-btn px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="neu-btn-primary px-6 py-2.5 rounded-xl text-xs font-bold"
            >
              Create Group
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
