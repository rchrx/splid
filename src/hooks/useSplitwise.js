import { useState, useEffect, useMemo, useCallback } from 'react';
import { calculateMemberBalances, simplifyDebts, roundToTwo } from '../utils/debtSimplification';

const STORAGE_KEY_GROUPS = 'dibbl_custom_groups_v1';
const STORAGE_KEY_ACTIVE = 'dibbl_active_group_v1';
const STORAGE_KEY_CURRENCY = 'dibbl_global_currency_v1';

const AVATAR_COLORS = [
  'from-purple-500 to-indigo-600',
  'from-cyan-500 to-blue-600',
  'from-pink-500 to-rose-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-violet-500 to-fuchsia-600',
  'from-rose-500 to-red-600',
  'from-sky-500 to-indigo-500',
];

export const useSplitwise = () => {
  // Load groups from localStorage, default is empty array
  const [groups, setGroups] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_GROUPS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  const [activeGroupId, setActiveGroupId] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE);
      if (saved && groups.some((g) => g.id === saved)) return saved;
    } catch {}
    return groups[0]?.id || null;
  });

  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_CURRENCY) || 'USD';
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(groups));
    } catch {}
  }, [groups]);

  useEffect(() => {
    try {
      if (activeGroupId) {
        localStorage.setItem(STORAGE_KEY_ACTIVE, activeGroupId);
      } else {
        localStorage.removeItem(STORAGE_KEY_ACTIVE);
      }
    } catch {}
  }, [activeGroupId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENCY, currency);
    } catch {}
  }, [currency]);

  // Ensure activeGroupId is valid when groups change
  useEffect(() => {
    if (groups.length === 0) {
      setActiveGroupId(null);
    } else if (!groups.some((g) => g.id === activeGroupId)) {
      setActiveGroupId(groups[0].id);
    }
  }, [groups, activeGroupId]);

  // Current active group object
  const activeGroup = useMemo(() => {
    if (!groups.length) return null;
    return groups.find((g) => g.id === activeGroupId) || groups[0];
  }, [groups, activeGroupId]);

  // Synchronize currency with active group if specified
  useEffect(() => {
    if (activeGroup?.currency && activeGroup.currency !== currency) {
      setCurrency(activeGroup.currency);
    }
  }, [activeGroup?.id]);

  // Balances & Debt Calculations
  const balances = useMemo(() => {
    if (!activeGroup || !activeGroup.members) return [];
    return calculateMemberBalances(
      activeGroup.members || [],
      activeGroup.expenses || [],
      activeGroup.settlements || []
    );
  }, [activeGroup]);

  const simplifiedDebts = useMemo(() => {
    if (!balances.length) return [];
    return simplifyDebts(balances);
  }, [balances]);

  // Aggregate Stats
  const totalSpending = useMemo(() => {
    if (!activeGroup?.expenses) return 0;
    return roundToTwo(activeGroup.expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0));
  }, [activeGroup?.expenses]);

  const totalSettled = useMemo(() => {
    if (!activeGroup?.settlements) return 0;
    return roundToTwo(activeGroup.settlements.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0));
  }, [activeGroup?.settlements]);

  // Category breakdown for Donut Chart
  const categoryBreakdown = useMemo(() => {
    if (!activeGroup?.expenses) return [];
    const map = {};
    activeGroup.expenses.forEach((e) => {
      const cat = e.category || 'general';
      map[cat] = roundToTwo((map[cat] || 0) + (parseFloat(e.amount) || 0));
    });
    return Object.entries(map).map(([category, value]) => ({ category, value }));
  }, [activeGroup?.expenses]);

  // ACTIONS
  const selectGroup = useCallback((id) => {
    setActiveGroupId(id);
  }, []);

  const createGroup = useCallback(({ name, emoji = '✨', description = '', initialMembers = [] }) => {
    const id = `grp_${Date.now()}`;
    const members = initialMembers.length > 0 
      ? initialMembers.map((m, idx) => ({
          id: `m_${Date.now()}_${idx}`,
          name: m.trim(),
          avatar: ['🧑‍💻', '👩‍🎨', '🧗', '🧘‍♀️', '🚀', '🎨', '🌟', '🎧'][idx % 8],
          color: AVATAR_COLORS[idx % AVATAR_COLORS.length],
        }))
      : [
          { id: `m_${Date.now()}_0`, name: 'You', avatar: '👑', color: AVATAR_COLORS[0] },
          { id: `m_${Date.now()}_1`, name: 'Friend 1', avatar: '👨‍💻', color: AVATAR_COLORS[1] },
        ];

    const newGroup = {
      id,
      name: name || 'New Trip',
      emoji,
      description,
      currency,
      members,
      expenses: [],
      settlements: [],
    };

    setGroups((prev) => [newGroup, ...prev]);
    setActiveGroupId(id);
    return newGroup;
  }, [currency]);

  const deleteGroup = useCallback((id) => {
    setGroups((prev) => {
      const filtered = prev.filter((g) => g.id !== id);
      return filtered;
    });
    setActiveGroupId((prevId) => {
      if (prevId === id) {
        const remaining = groups.filter((g) => g.id !== id);
        return remaining[0]?.id || null;
      }
      return prevId;
    });
  }, [groups]);

  const addMember = useCallback((name) => {
    if (!name || !name.trim()) return;
    const cleanName = name.trim();
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== activeGroupId) return g;
        const nextIdx = g.members.length;
        const newMember = {
          id: `m_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          name: cleanName,
          avatar: ['🌟', '🕶️', '🎸', '🏖️', '⚡', '☕', '🎯'][nextIdx % 7],
          color: AVATAR_COLORS[nextIdx % AVATAR_COLORS.length],
        };
        return {
          ...g,
          members: [...g.members, newMember],
        };
      })
    );
  }, [activeGroupId]);

  const removeMember = useCallback((memberId) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== activeGroupId) return g;
        if (g.members.length <= 1) return g;
        return {
          ...g,
          members: g.members.filter((m) => m.id !== memberId),
          // Filter out of any expenses
          expenses: g.expenses.map((e) => ({
            ...e,
            splitWith: (e.splitWith || []).filter((id) => id !== memberId),
          })),
        };
      })
    );
  }, [activeGroupId]);

  const addExpense = useCallback((expenseData) => {
    if (!activeGroup) return null;
    const newExpense = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      title: expenseData.title.trim() || 'Untitled Expense',
      amount: parseFloat(expenseData.amount) || 0,
      category: expenseData.category || 'general',
      date: expenseData.date || new Date().toISOString().slice(0, 10),
      paidById: expenseData.paidById,
      splitType: expenseData.splitType || 'equal',
      splitWith: expenseData.splitWith || activeGroup.members.map((m) => m.id),
      splits: expenseData.splits || {},
      notes: expenseData.notes || '',
    };

    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== activeGroupId) return g;
        return {
          ...g,
          expenses: [newExpense, ...g.expenses],
        };
      })
    );
    return newExpense;
  }, [activeGroupId, activeGroup]);

  const deleteExpense = useCallback((expenseId) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== activeGroupId) return g;
        return {
          ...g,
          expenses: g.expenses.filter((e) => e.id !== expenseId),
        };
      })
    );
  }, [activeGroupId]);

  const recordSettlement = useCallback(({ fromMemberId, toMemberId, amount, date, note = '' }) => {
    const newSettlement = {
      id: `stl_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      fromMemberId,
      toMemberId,
      amount: parseFloat(amount) || 0,
      date: date || new Date().toISOString().slice(0, 10),
      note: note || 'Settled via Dibbl',
    };

    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== activeGroupId) return g;
        return {
          ...g,
          settlements: [newSettlement, ...(g.settlements || [])],
        };
      })
    );
    return newSettlement;
  }, [activeGroupId]);

  const deleteSettlement = useCallback((settlementId) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== activeGroupId) return g;
        return {
          ...g,
          settlements: (g.settlements || []).filter((s) => s.id !== settlementId),
        };
      })
    );
  }, [activeGroupId]);

  const clearAllData = useCallback(() => {
    setGroups([]);
    setActiveGroupId(null);
  }, []);

  return {
    groups,
    activeGroupId,
    activeGroup,
    currency,
    setCurrency,
    balances,
    simplifiedDebts,
    totalSpending,
    totalSettled,
    categoryBreakdown,
    selectGroup,
    createGroup,
    deleteGroup,
    addMember,
    removeMember,
    addExpense,
    deleteExpense,
    recordSettlement,
    deleteSettlement,
    clearAllData,
  };
};
