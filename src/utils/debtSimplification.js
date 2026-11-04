/**
 * Round number to 2 decimal places to avoid floating point imprecision
 */
export const roundToTwo = (num) => {
  return Math.round((num + Number.EPSILON) * 100) / 100;
};

/**
 * Calculates net balances for every member in a group based on:
 * 1. Logged expenses (who paid vs who consumed)
 * 2. Recorded settlement payments (who paid back whom)
 */
export const calculateMemberBalances = (members = [], expenses = [], settlements = []) => {
  const balanceMap = {};

  members.forEach((m) => {
    balanceMap[m.id] = {
      id: m.id,
      name: m.name,
      avatar: m.avatar,
      color: m.color,
      paid: 0,
      share: 0,
      net: 0,
    };
  });

  // 1. Process Expenses
  expenses.forEach((expense) => {
    const totalAmount = parseFloat(expense.amount) || 0;
    const payerId = expense.paidById;

    // Credit the payer
    if (balanceMap[payerId]) {
      balanceMap[payerId].paid = roundToTwo(balanceMap[payerId].paid + totalAmount);
    }

    // Debit the consumers according to split method
    const splitType = expense.splitType || 'equal';
    const splits = expense.splits || {};
    const splitMemberIds = expense.splitWith || members.map((m) => m.id);

    if (splitType === 'equal') {
      const activeIds = splitMemberIds.filter((id) => balanceMap[id]);
      if (activeIds.length > 0) {
        const splitAmount = totalAmount / activeIds.length;
        activeIds.forEach((id) => {
          balanceMap[id].share = roundToTwo(balanceMap[id].share + splitAmount);
        });
      }
    } else if (splitType === 'exact') {
      Object.entries(splits).forEach(([id, amt]) => {
        if (balanceMap[id]) {
          balanceMap[id].share = roundToTwo(balanceMap[id].share + (parseFloat(amt) || 0));
        }
      });
    } else if (splitType === 'percentage') {
      Object.entries(splits).forEach(([id, pct]) => {
        if (balanceMap[id]) {
          const share = (totalAmount * (parseFloat(pct) || 0)) / 100;
          balanceMap[id].share = roundToTwo(balanceMap[id].share + share);
        }
      });
    } else if (splitType === 'shares') {
      const totalShares = Object.values(splits).reduce((sum, s) => sum + (parseFloat(s) || 0), 0);
      if (totalShares > 0) {
        Object.entries(splits).forEach(([id, s]) => {
          if (balanceMap[id]) {
            const share = (totalAmount * (parseFloat(s) || 0)) / totalShares;
            balanceMap[id].share = roundToTwo(balanceMap[id].share + share);
          }
        });
      }
    }
  });

  // 2. Process Settlements (Payments between members)
  settlements.forEach((st) => {
    const amt = parseFloat(st.amount) || 0;
    // The person who paid reduces their debt (treated as paid out)
    if (balanceMap[st.fromMemberId]) {
      balanceMap[st.fromMemberId].paid = roundToTwo(balanceMap[st.fromMemberId].paid + amt);
    }
    // The person who received was owed money and is now reimbursed (treated as their consumption increased to cancel their credit)
    if (balanceMap[st.toMemberId]) {
      balanceMap[st.toMemberId].share = roundToTwo(balanceMap[st.toMemberId].share + amt);
    }
  });

  // 3. Compute Net Balance for each member
  return Object.values(balanceMap).map((m) => {
    const net = roundToTwo(m.paid - m.share);
    return {
      ...m,
      net,
      status: net > 0.01 ? 'owed' : net < -0.01 ? 'owes' : 'settled',
    };
  });
};

/**
 * Debt Simplification / Minimum Cash Flow Algorithm
 * Transforms complex multilateral debts into the minimum number of transactions
 */
export const simplifyDebts = (balances = []) => {
  // Separate into debtors (net < 0) and creditors (net > 0)
  const debtors = [];
  const creditors = [];

  balances.forEach((b) => {
    if (b.net < -0.01) {
      debtors.push({ id: b.id, name: b.name, color: b.color, amount: Math.abs(b.net) });
    } else if (b.net > 0.01) {
      creditors.push({ id: b.id, name: b.name, color: b.color, amount: b.net });
    }
  });

  // Sort descending by amount for efficient matching
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];

    const settledAmount = Math.min(debtor.amount, creditor.amount);

    if (settledAmount > 0.01) {
      transactions.push({
        id: `tx_${debtor.id}_${creditor.id}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        fromId: debtor.id,
        fromName: debtor.name,
        fromColor: debtor.color,
        toId: creditor.id,
        toName: creditor.name,
        toColor: creditor.color,
        amount: roundToTwo(settledAmount),
      });
    }

    debtor.amount = roundToTwo(debtor.amount - settledAmount);
    creditor.amount = roundToTwo(creditor.amount - settledAmount);

    if (debtor.amount < 0.01) dIdx++;
    if (creditor.amount < 0.01) cIdx++;
  }

  return transactions;
};

