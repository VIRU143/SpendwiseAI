import type { LucideIcon } from "lucide-react";

export interface Expense {
  id: string;
  amount: number;
  date: string;
  category: Category["value"];
  notes: string;
}

export interface Category {
  value: string;
  label: string;
  icon: LucideIcon;
}
