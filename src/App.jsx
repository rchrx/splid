import React, { useState, useCallback } from 'react';
import { useSplitwise } from './hooks/useSplitwise';
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/Navbar';
import { WelcomeState } from './components/WelcomeState';
import { GroupHeader } from './components/GroupHeader';
import { SettlementHub } from './components/SettlementHub';
import { MembersList } from './components/MembersList';
import { ExpenseList } from './components/ExpenseList';
import { AnalyticsSection } from './components/AnalyticsSection';
import { AddExpenseModal } from './components/AddExpenseModal';
import { SettleUpModal } from './components/SettleUpModal';
import { GroupModal } from './components/GroupModal';
import { SettlementHistoryDrawer } from './components/SettlementHistoryDrawer';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { exportGroupReportPDF } from './utils/exportGroupPdf';
import { copyToClipboard } from './utils/receipt';
import { formatCurrency } from './utils/currency';

export function App() {
  const { theme, toggleTheme } = useTheme();
  const splitState = useSplitwise();

  // Modals state
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [settleUpModalOpen, setSettleUpModalOpen] = useState(false);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [selectedDebtForSettlement, setSelectedDebtForSettlement] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = 'success', title = '') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Quick Settle Action from a Debt card
  const handleSettleDebtCard = (debt) => {
    setSelectedDebtForSettlement(debt);
    setSettleUpModalOpen(true);
  };

  const handleOpenGeneralSettleUp = () => {
    setSelectedDebtForSettlement(null);
    setSettleUpModalOpen(true);
  };

  // PDF Export
  const handleExportPDF = () => {
    if (!splitState.activeGroup) return;
    try {
      exportGroupReportPDF({
        group: splitState.activeGroup,
        balances: splitState.balances,
        simplifiedDebts: splitState.simplifiedDebts,
        currency: splitState.currency,
      });
      addToast('Group expense statement PDF downloaded!', 'success');
    } catch (err) {
      console.error(err);
      addToast('Failed to generate PDF', 'error');
    }
  };

  // WhatsApp / Clipboard Summary Share
  const handleShareSummary = async () => {
    const grp = splitState.activeGroup;
    if (!grp) return;

    let text = `🧾 *Dibbl Group Summary: ${grp.name}*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💰 *Total Group Spending:* ${formatCurrency(splitState.totalSpending, splitState.currency)}\n`;
    text += `👥 *Members:* ${grp.members.map((m) => m.name).join(', ')}\n\n`;

    if (splitState.simplifiedDebts.length === 0) {
      text += `✨ *All balances are settled up! Zero debts remaining.*\n`;
    } else {
      text += `⚡ *WHO PAYS WHOM (Simplified Debts):*\n`;
      splitState.simplifiedDebts.forEach((d, idx) => {
        text += `${idx + 1}. *${d.fromName}* pays *${d.toName}*: ${formatCurrency(d.amount, splitState.currency)}\n`;
      });
    }

    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📊 *Member Net Balances:*\n`;
    splitState.balances.forEach((m) => {
      if (m.net > 0.01) {
        text += `• ${m.name}: +${formatCurrency(m.net, splitState.currency)} (gets back)\n`;
      } else if (m.net < -0.01) {
        text += `• ${m.name}: -${formatCurrency(Math.abs(m.net), splitState.currency)} (owes)\n`;
      } else {
        text += `• ${m.name}: Settled\n`;
      }
    });

    text += `\n🚀 Calculated smoothly with Dibbl`;

    await copyToClipboard(text);
    addToast('Group summary copied to clipboard for WhatsApp!', 'success');
  };

  const hasGroups = splitState.groups.length > 0 && splitState.activeGroup;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-midnight-950 text-slate-800 dark:text-slate-100 selection:bg-purple-500/30 selection:text-purple-300 relative transition-colors duration-300">
      {/* Dynamic ambient background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/10 dark:bg-purple-600/15 blur-[120px] rounded-full animate-blob" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-cyan-600/10 dark:bg-cyan-600/15 blur-[120px] rounded-full animate-blob [animation-delay:3s]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 dark:bg-indigo-600/10 blur-[130px] rounded-full animate-blob [animation-delay:6s]" />
      </div>

      {/* Floating Glass Navigation */}
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        currency={splitState.currency}
        onCurrencyChange={splitState.setCurrency}
        groups={splitState.groups}
        activeGroupId={splitState.activeGroupId}
        onSelectGroup={splitState.selectGroup}
        onOpenNewGroupModal={() => setGroupModalOpen(true)}
        onOpenAddExpenseModal={() => setAddExpenseModalOpen(true)}
      />

      <main>
        {hasGroups ? (
          <>
            {/* Group Header & Overview Stats */}
            <GroupHeader
              group={splitState.activeGroup}
              totalSpending={splitState.totalSpending}
              totalSettled={splitState.totalSettled}
              simplifiedDebts={splitState.simplifiedDebts}
              currency={splitState.currency}
              onOpenAddExpense={() => setAddExpenseModalOpen(true)}
              onOpenSettleUp={handleOpenGeneralSettleUp}
              onExportPDF={handleExportPDF}
              onShareWhatsApp={handleShareSummary}
              onDeleteGroup={splitState.deleteGroup}
            />

            {/* 1. Who Pays Whom (Simplified Settlements) */}
            <SettlementHub
              simplifiedDebts={splitState.simplifiedDebts}
              currency={splitState.currency}
              onSettleDebt={handleSettleDebtCard}
              onNotify={addToast}
            />

            {/* 2. Group Members & Net Balances */}
            <MembersList
              members={splitState.activeGroup?.members || []}
              balances={splitState.balances}
              currency={splitState.currency}
              onAddMember={splitState.addMember}
              onRemoveMember={splitState.removeMember}
              onNotify={addToast}
            />

            {/* 3. Expense History Timeline Feed */}
            <ExpenseList
              expenses={splitState.activeGroup?.expenses || []}
              members={splitState.activeGroup?.members || []}
              currency={splitState.currency}
              onDeleteExpense={splitState.deleteExpense}
              onOpenAddExpense={() => setAddExpenseModalOpen(true)}
              onNotify={addToast}
            />

            {/* 4. Category & Contribution Analytics */}
            <AnalyticsSection
              group={splitState.activeGroup}
              categoryBreakdown={splitState.categoryBreakdown}
              balances={splitState.balances}
              currency={splitState.currency}
            />
          </>
        ) : (
          <WelcomeState
            onCreateGroup={(groupData) => {
              splitState.createGroup(groupData);
              addToast(`Group "${groupData.name}" created!`, 'success');
            }}
            currency={splitState.currency}
            onCurrencyChange={splitState.setCurrency}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* MODALS */}
      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={addExpenseModalOpen}
        onClose={() => setAddExpenseModalOpen(false)}
        members={splitState.activeGroup?.members || []}
        currency={splitState.currency}
        onAddExpense={splitState.addExpense}
        onNotify={addToast}
      />

      {/* Settle Up Modal */}
      <SettleUpModal
        isOpen={settleUpModalOpen}
        onClose={() => {
          setSettleUpModalOpen(false);
          setSelectedDebtForSettlement(null);
        }}
        members={splitState.activeGroup?.members || []}
        initialDebt={selectedDebtForSettlement}
        currency={splitState.currency}
        onRecordSettlement={splitState.recordSettlement}
        onNotify={addToast}
      />

      {/* Create Group Modal */}
      <GroupModal
        isOpen={groupModalOpen}
        onClose={() => setGroupModalOpen(false)}
        onCreateGroup={splitState.createGroup}
        onNotify={addToast}
      />

      {/* Recorded Settlement Payments History Drawer */}
      <SettlementHistoryDrawer
        isOpen={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        settlements={splitState.activeGroup?.settlements || []}
        members={splitState.activeGroup?.members || []}
        currency={splitState.currency}
        onDeleteSettlement={splitState.deleteSettlement}
        onNotify={addToast}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
