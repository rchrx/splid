import jsPDF from 'jspdf';
import { formatCurrency } from './currency';

/**
 * Generates and downloads a beautifully styled PDF receipt using jsPDF
 */
export const downloadReceiptPDF = ({
  calculation,
  currency = 'INR',
  title = 'Dining Bill Split',
  participants = [],
  notes = '',
}) => {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a5', // Sleek boutique receipt size
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  // Background tint
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');

  // Header Banner Card
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(12, 12, pageWidth - 24, 28, 4, 4, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('SPLID', 20, 24);

  // Subtitle
  doc.setTextColor(192, 132, 252);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('PREMIUM BILL BREAKDOWN & RECEIPT', 20, 31);

  // Date on right
  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text(dateStr, pageWidth - 20, 27, { align: 'right' });

  y = 48;

  // Summary box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(12, y, pageWidth - 24, 52, 3, 3, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Bill Summary', 18, y + 8);

  const drawRow = (label, value, yPos, isBold = false, color = [51, 65, 85]) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFontSize(9.5);
    doc.text(label, 18, yPos);
    doc.text(value, pageWidth - 18, yPos, { align: 'right' });
  };

  drawRow('Base Bill (Subtotal)', formatCurrency(calculation.subtotal, currency), y + 17);
  drawRow(`Tip (${calculation.tipPercentage}%)`, `+ ${formatCurrency(calculation.tipAmount, currency)}`, y + 24);
  
  if (calculation.taxAmount > 0) {
    drawRow('Tax / VAT', `+ ${formatCurrency(calculation.taxAmount, currency)}`, y + 31);
  }
  
  if (calculation.additionalCharges > 0) {
    drawRow('Service & Extra Fees', `+ ${formatCurrency(calculation.additionalCharges, currency)}`, y + 37);
  }

  if (calculation.roundUpDifference > 0) {
    drawRow('Round-Up Adjustment', `+ ${formatCurrency(calculation.roundUpDifference, currency)}`, y + 43);
  }

  y += 58;

  // Hero Highlight: Amount per person
  doc.setFillColor(243, 232, 255);
  doc.setDrawColor(216, 180, 254);
  doc.roundedRect(12, y, pageWidth - 24, 24, 3, 3, 'FD');

  doc.setTextColor(107, 33, 168);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`AMOUNT PER PERSON (${calculation.numberOfPeople} ${calculation.numberOfPeople > 1 ? 'GUESTS' : 'GUEST'})`, 18, y + 8);

  doc.setFontSize(16);
  doc.setTextColor(88, 28, 135);
  doc.text(formatCurrency(calculation.amountPerPerson, currency), 18, y + 18);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Total Bill: ${formatCurrency(calculation.finalTotal, currency)}`, pageWidth - 18, y + 18, { align: 'right' });

  y += 32;

  // Participant list if unequal split
  if (participants && participants.length > 0) {
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Individual Participant Breakdown', 14, y);
    y += 5;

    participants.forEach((p, idx) => {
      if (y > doc.internal.pageSize.getHeight() - 25) {
        doc.addPage();
        y = 20;
      }
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(12, y, pageWidth - 24, 10, 2, 2, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.text(`${idx + 1}. ${p.name || `Guest ${idx + 1}`}`, 18, y + 6.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(formatCurrency(p.totalPayable, currency), pageWidth - 18, y + 6.5, { align: 'right' });
      y += 12;
    });
  }

  // Footer notes
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Calculated with Splid • 100% Mathematically Balanced & Fair', pageWidth / 2, pageHeight - 8, { align: 'center' });

  doc.save(`Splid-Bill-${new Date().toISOString().slice(0, 10)}.pdf`);
};

/**
 * Creates formatted plain text bill summary for messaging apps
 */
export const generateShareText = ({
  calculation,
  currency = 'INR',
  participants = [],
}) => {
  const symbol = '₹';
  let text = `🧾 *Splid Bill Breakdown*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `💰 *Subtotal:* ${formatCurrency(calculation.subtotal, currency)}\n`;
  text += `✨ *Tip (${calculation.tipPercentage}%):* ${formatCurrency(calculation.tipAmount, currency)}\n`;

  if (calculation.taxAmount > 0) {
    text += `🏛️ *Tax:* ${formatCurrency(calculation.taxAmount, currency)}\n`;
  }
  if (calculation.additionalCharges > 0) {
    text += `📦 *Extra Fees:* ${formatCurrency(calculation.additionalCharges, currency)}\n`;
  }

  text += `━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `💳 *Grand Total:* ${formatCurrency(calculation.finalTotal, currency)}\n`;
  text += `👥 *Number of People:* ${calculation.numberOfPeople}\n`;
  text += `🎯 *EACH PERSON PAYS: ${formatCurrency(calculation.amountPerPerson, currency)}*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━\n`;

  if (participants && participants.length > 0) {
    text += `\n📋 *Individual Shares:*\n`;
    participants.forEach((p, idx) => {
      text += `• ${p.name || `Guest ${idx + 1}`}: ${formatCurrency(p.totalPayable, currency)}\n`;
    });
    text += `\n`;
  }

  text += `⚡ Split cleanly with Splid`;
  return text;
};

/**
 * Share calculation using Web Share API or copy fallback
 */
export const shareCalculation = async (data, onCopied) => {
  const text = generateShareText(data);

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Splid Bill Breakdown',
        text: text,
      });
      return true;
    } catch (err) {
      if (err.name !== 'AbortError') {
        await copyToClipboard(text);
        if (onCopied) onCopied();
      }
      return false;
    }
  } else {
    await copyToClipboard(text);
    if (onCopied) onCopied();
    return true;
  }
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  }
};

