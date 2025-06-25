"use client";

import { useState } from "react";
import useLocalStorage from "@/hooks/use-local-storage";
import type { Expense } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Wallet } from "lucide-react";
import ExpenseForm from "@/components/expense-form";
import ExpenseList from "@/components/expense-list";
import ExpenseChart from "@/components/expense-chart";
import { Icons } from "@/components/icons";

export default function Home() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("expenses", []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);

  const handleAddExpense = (expenseData: Omit<Expense, "id">) => {
    const newExpense = { ...expenseData, id: crypto.randomUUID() };
    setExpenses((prev) => [...prev, newExpense]);
    setIsFormOpen(false);
  };
  
  const handleUpdateExpense = (expenseData: Expense) => {
    setExpenses((prev) => prev.map(exp => exp.id === expenseData.id ? expenseData : exp));
    setEditingExpense(undefined);
    setIsFormOpen(false);
  }

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((exp) => exp.id !== id));
  };
  
  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  }

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <>
      <div className="min-h-screen w-full">
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
          <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              <Icons.logo className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">
                SpendWise AI
              </h1>
            </div>
            <Button onClick={() => {
              setEditingExpense(undefined);
              setIsFormOpen(true);
            }} size="sm" className="gap-2">
              <PlusCircle />
              <span>Add Expense</span>
            </Button>
          </div>
        </header>

        <main className="container mx-auto p-4 md:p-6 lg:p-8">
          <div className="grid gap-6">
            {expenses.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Spending Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ExpenseChart expenses={expenses} />
                  </CardContent>
                </Card>
                <Card className="flex flex-col justify-center lg:col-span-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Spending
                    </CardTitle>
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Across {expenses.length} transaction{expenses.length !== 1 && 's'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="flex h-64 flex-col items-center justify-center text-center">
                <CardHeader>
                  <CardTitle>Welcome to SpendWise AI</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    You haven't added any expenses yet.
                  </p>
                  <Button onClick={() => setIsFormOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Your First Expense
                  </Button>
                </CardContent>
              </Card>
            )}

            {expenses.length > 0 && (
                <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} onEdit={handleEdit} />
            )}
          </div>
        </main>
      </div>
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => {
            setIsFormOpen(false);
            setEditingExpense(undefined);
        }}
        onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
        expense={editingExpense}
      />
    </>
  );
}
