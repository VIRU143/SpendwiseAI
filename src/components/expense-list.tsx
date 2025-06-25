"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { MoreHorizontal, Trash2, Edit } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Expense } from "@/lib/types";
import { CATEGORIES } from '@/lib/constants';


interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
}

const getCategory = (value: string) => {
    return CATEGORIES.find(c => c.value === value);
}

export default function ExpenseList({ expenses, onDelete, onEdit }: ExpenseListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <>
      <Card>
        <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-[40px]"></TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {sortedExpenses.map((expense) => {
                    const category = getCategory(expense.category);
                    const CategoryIcon = category?.icon;
                    return (
                        <TableRow key={expense.id}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    {CategoryIcon && <CategoryIcon className="h-5 w-5 text-muted-foreground" />}
                                    <span className="font-medium">{category?.label || 'N/A'}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{expense.notes}</TableCell>
                            <TableCell>{format(new Date(expense.date), "MMM d, yyyy")}</TableCell>
                            <TableCell className="text-right font-mono">${expense.amount.toFixed(2)}</TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onEdit(expense)}>
                                            <Edit className="mr-2 h-4 w-4" />
                                            <span>Edit</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setDeleteId(expense.id)} className="text-destructive focus:text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    )
                })}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this expense
                from your records.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
                onClick={() => {
                if(deleteId) onDelete(deleteId);
                setDeleteId(null);
                }}
                className="bg-destructive hover:bg-destructive/90"
            >
                Continue
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
