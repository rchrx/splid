# Dibbl — Split Smart. Pay Fair

A premier glassmorphism group expense tracker and smart debt settlement platform. Split smart, pay fair, and settle up with zero math friction.

---

## ✨ Features & Capabilities

### 1. Multi-Group & Trip Management
- **Switch Groups**: Easily switch between groups (e.g. *Lake Tahoe Weekend Trip 🌲*, *Apartment 4B Roommates 🛋️*).
- **Create Custom Groups**: Custom group names, emoji icons, descriptions, and initial member lists.
- **Persistent Local Ledger**: All groups, members, expenses, and settlements are stored securely in browser `localStorage`.

### 2. Smart Debt Simplification Algorithm ("Who Pays Whom")
- **Minimum Cash Flow Resolution**: Automatically reduces complicated, multi-party circular debts into the minimum number of direct transactions.
- **Visual Settlement Cards**:
  - Displays Debtor (*who owes*) ➡️ Creditor (*who gets*).
  - Prominent transaction amount.
  - **"Settle Up"** action: Launches the payment recording modal pre-filled with the exact amount.
  - **"Copy Reminder"** action: One-click copy of a friendly WhatsApp / iMessage payment reminder.
- **All-Settled State**: Displays a celebratory emerald badge with confetti when all members are square.

### 3. Member Net Balances Grid
- **Real-Time Balances**:
  - **Paid**: Total amount a member paid out of their own pocket for the group.
  - **Share**: Their fair consumption share of all group expenses.
  - **Net Status Badge**:
    - 🟢 `+ $X.XX` (*Gets back*)
    - 🔴 `- $Y.YY` (*Owes*)
    - ⚪ `Settled ($0.00)`
- **Add / Remove Members**: Inline member creation with custom avatar badges.

### 4. Comprehensive Expense Logging & Timeline Feed
- **Add Expense Modal**:
  - Description, Amount, Category (Food, Transport, Accommodation, Groceries, Entertainment, Utilities, Travel, General), Date.
  - **Paid By**: Select who covered the bill.
  - **Split Methods**:
    - **Equally**: Select members with auto per-person share calculations.
    - **Exact Amounts**: Input custom dollar amounts with balance validation.
    - **Percentages (%)**: Custom percentages summing to 100%.
  - Optional context and notes.
- **Expense Feed**:
  - Filter by category pills or search by keyword.
  - View individual split breakdowns per expense.
  - Delete expenses with live recalculation.

### 5. Settle Up (Recording Payments)
- Log direct member-to-member repayments (e.g. *Sarah paid Alex $25 via Venmo*).
- Immediately credits the payer and updates all net balances.
- Settlement history drawer to view or undo past payments.

### 6. Analytics & Spending Insights
- **Category Donut Chart**: Powered by Recharts with interactive hover tooltips.
- **Top Spender Callout**: Identifies who has fronted the most money.
- **Largest Expense Callout**: Highlights the biggest group bill.

### 7. Export & Sharing
- **Download PDF Statement**: Generates a professional, branded A4 statement via jsPDF with group totals, settlement plan, member balance tables, and itemized receipts.
- **One-Click WhatsApp Summary**: Formats group debts with clean emojis ready to paste into group chats.

---

## 🛠️ Technology Stack
- **Framework**: React 18+ (Vite)
- **Styling**: Tailwind CSS with custom glassmorphism utilities & CSS variables
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Data Visualizations**: Recharts
- **PDF Generation**: jsPDF
- **Micro-Interactions**: Canvas-Confetti

---

## 🚀 Development & Build

```bash
# Start local development server
npm run dev

# Build for production
npm run build
```
Live at `http://localhost:3000/`.
