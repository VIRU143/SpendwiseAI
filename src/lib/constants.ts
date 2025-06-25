import {
    Car,
    HeartPulse,
    Lightbulb,
    MoreHorizontal,
    ShoppingBag,
    Drama,
    Utensils,
  } from "lucide-react";
  import type { Category } from "@/lib/types";
  
  export const CATEGORIES: Category[] = [
    { value: "food", label: "Food", icon: Utensils },
    { value: "transport", label: "Transport", icon: Car },
    { value: "utilities", label: "Utilities", icon: Lightbulb },
    { value: "entertainment", label: "Entertainment", icon: Drama },
    { value: "health", label: "Health", icon: HeartPulse },
    { value: "shopping", label: "Shopping", icon: ShoppingBag },
    { value: "other", label: "Other", icon: MoreHorizontal },
  ];
  