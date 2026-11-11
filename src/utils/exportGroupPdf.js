import jsPDF from 'jspdf';
import { formatCurrency } from './currency';

export const exportGroupReportPDF = ({
  group,
  balances = [],
  simplifiedDebts = [],
  currency = 'INR',
}) => {
  const formatPdfAmount = (amt) => {
    return formatCurrency(amt, currency).replace(/₹/g, 'Rs. ');
  };
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Header Banner Card
  doc.setFillColor(57, 68, 93);
  doc.roundedRect(14, 12, pageWidth - 28, 28, 4, 4, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(`SPLID • ${group.name.toUpperCase()}`, 22, 24);

  doc.setTextColor(40, 200, 180);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('SPLIT SMART. PAY FAIR • OFFICIAL GROUP EXPENSE REPORT', 22, 31);

  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text(`Generated: ${dateStr}`, pageWidth - 22, 27, { align: 'right' });

  y = 48;

  // Total Summary Row
  const totalExpense = group.expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const totalSettled = (group.settlements || []).reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, pageWidth - 28, 20, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('TOTAL GROUP SPEND', 22, y + 8);
  doc.text('SETTLED DEBTS', 85, y + 8);
  doc.text('OUTSTANDING TRANSFERS', 145, y + 8);

  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(formatPdfAmount(totalExpense), 22, y + 16);
  doc.text(formatPdfAmount(totalSettled), 85, y + 16);
  doc.text(`${simplifiedDebts.length} Transfers Required`, 145, y + 16);

  y += 28;

  // 1. Settlement Instructions ("Who Pays Whom")
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. SIMPLIFIED SETTLEMENT PLAN (WHO PAYS WHOM)', 14, y);
  y += 6;

  if (simplifiedDebts.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(16, 185, 129);
    doc.text('All members are fully settled up! No outstanding balances remain.', 14, y + 4);
    y += 12;
  } else {
    simplifiedDebts.forEach((debt, idx) => {
      doc.setFillColor(243, 232, 255);
      doc.roundedRect(14, y, pageWidth - 28, 10, 2, 2, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(13, 148, 136);
      doc.text(`${idx + 1}.  ${debt.fromName}  pays  ${debt.toName}`, 20, y + 6.5);
      doc.text(formatPdfAmount(debt.amount), pageWidth - 20, y + 6.5, { align: 'right' });
      y += 13;
    });
  }

  y += 6;

  // 2. Member Balances Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. MEMBER NET BALANCES SUMMARY', 14, y);
  y += 6;

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, pageWidth - 28, 8, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('MEMBER', 20, y + 5.5);
  doc.text('TOTAL PAID OUT', 80, y + 5.5);
  doc.text('TOTAL CONSUMPTION', 125, y + 5.5);
  doc.text('NET STATUS', pageWidth - 20, y + 5.5, { align: 'right' });
  y += 10;

  balances.forEach((m) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(m.name, 20, y + 4);
    doc.text(formatPdfAmount(m.paid), 80, y + 4);
    doc.text(formatPdfAmount(m.share), 125, y + 4);

    doc.setFont('helvetica', 'bold');
    if (m.net > 0.01) {
      doc.setTextColor(5, 150, 105);
      doc.text(`+ ${formatPdfAmount(m.net)} (Gets back)`, pageWidth - 20, y + 4, { align: 'right' });
    } else if (m.net < -0.01) {
      doc.setTextColor(225, 29, 72);
      doc.text(`- ${formatPdfAmount(Math.abs(m.net))} (Owes)`, pageWidth - 20, y + 4, { align: 'right' });
    } else {
      doc.setTextColor(100, 116, 139);
      doc.text('Settled Up', pageWidth - 20, y + 4, { align: 'right' });
    }

    doc.setDrawColor(241, 245, 249);
    doc.line(14, y + 6, pageWidth - 14, y + 6);
    y += 9;
  });

  y += 6;

  // 3. Itemized Expense Log
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('3. DETAILED EXPENSE LOG', 14, y);
  y += 6;

  group.expenses.forEach((exp, idx) => {
    if (y > doc.internal.pageSize.getHeight() - 25) {
      doc.addPage();
      y = 20;
    }

    const payer = group.members.find((m) => m.id === exp.paidById)?.name || 'Unknown';

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, pageWidth - 28, 12, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`${exp.title}`, 20, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`${exp.date} • Paid by ${payer} • Split between ${exp.splitWith ? exp.splitWith.length : group.members.length} people`, 20, y + 9.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(13, 148, 136);
    doc.text(formatPdfAmount(exp.amount), pageWidth - 20, y + 7, { align: 'right' });

    y += 15;
  });

  // Footer stamp
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Splid Intelligent Debt Simplification • 100% Mathematically Balanced', pageWidth / 2, pageHeight - 8, { align: 'center' });

  doc.save(`${group.name.replace(/\s+/g, '_')}_Splid_Report.pdf`);
};

