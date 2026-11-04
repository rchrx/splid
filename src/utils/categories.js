import { 
  UtensilsCrossed, 
  Car, 
  Home, 
  Sparkles, 
  ShoppingBag, 
  Zap, 
  CreditCard,
  Plane,
  Coffee,
  Ticket
} from 'lucide-react';

export const EXPENSE_CATEGORIES = [
  { id: 'food', name: 'Food & Dining', icon: UtensilsCrossed, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  { id: 'transport', name: 'Transport & Rides', icon: Car, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
  { id: 'stay', name: 'Accommodation', icon: Home, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  { id: 'groceries', name: 'Groceries & Supplies', icon: ShoppingBag, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  { id: 'entertainment', name: 'Entertainment & Fun', icon: Sparkles, color: 'text-pink-400 bg-pink-500/10 border-pink-500/30' },
  { id: 'utilities', name: 'Utilities & Bills', icon: Zap, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  { id: 'travel', name: 'Flights & Travel', icon: Plane, color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
  { id: 'general', name: 'General & Other', icon: CreditCard, color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' },
];

export const getCategoryById = (id) => {
  return EXPENSE_CATEGORIES.find((c) => c.id === id) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
};

