"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Loader2, Sparkles, ScanLine } from "lucide-react";
import { format } from "date-fns";

import { analyzeReceipt } from "@/ai/flows/analyze-receipt";
import { suggestCategory } from "@/ai/flows/categorize-expense";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";
import type { Expense } from "@/lib/types";

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  expense?: Expense;
}

const formSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive."),
  date: z.date(),
  category: z.string().min(1, "Category is required."),
  notes: z.string().min(3, "Please add more details.").max(100),
});

type ExpenseFormValues = z.infer<typeof formSchema>;

export default function ExpenseForm({ isOpen, onClose, onSubmit, expense }: ExpenseFormProps) {
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      date: new Date(),
      category: "",
      notes: "",
    },
  });
  
  useEffect(() => {
    if (expense) {
      form.reset({
        amount: expense.amount,
        date: new Date(expense.date),
        category: expense.category,
        notes: expense.notes,
      });
    } else {
        form.reset({
            amount: 0,
            date: new Date(),
            category: "",
            notes: "",
        });
    }
  }, [expense, form, isOpen]);

  const handleAnalyzeReceipt = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const receiptDataUri = reader.result as string;
      setIsAnalyzing(true);
      try {
        const result = await analyzeReceipt({ receiptDataUri });
        
        const parsedDate = new Date(result.date + 'T00:00:00');

        form.setValue("amount", result.amount, { shouldValidate: true });
        form.setValue("date", isNaN(parsedDate.getTime()) ? new Date() : parsedDate, { shouldValidate: true });
        form.setValue("notes", result.notes, { shouldValidate: true });

        toast({
          title: "Receipt Analyzed!",
          description: "We've pre-filled the form with the extracted details.",
        });

      } catch (error) {
        console.error("AI receipt analysis error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to analyze the receipt.",
        });
      } finally {
        setIsAnalyzing(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.onerror = (error) => {
        console.error("File reading error:", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to read the file." });
    };
  };

  const handleSuggestCategory = async () => {
    const notes = form.getValues("notes");
    if (!notes || notes.length < 3) {
      toast({
        variant: "destructive",
        title: "Oh-oh!",
        description: "Please enter a more descriptive note to get a suggestion.",
      });
      return;
    }

    setIsSuggesting(true);
    try {
      const result = await suggestCategory({ description: notes });
      const suggestedCat = CATEGORIES.find(c => c.label.toLowerCase() === result.category.toLowerCase());
      if (suggestedCat) {
        form.setValue("category", suggestedCat.value, { shouldValidate: true });
        toast({
          title: "Suggestion applied!",
          description: `We've set the category to "${suggestedCat.label}".`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Suggestion unclear",
          description: "We couldn't find a matching category.",
        });
      }
    } catch (error) {
      console.error("AI suggestion error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get an AI suggestion.",
      });
    } finally {
      setIsSuggesting(false);
    }
  };
  
  const processSubmit = (data: ExpenseFormValues) => {
    onSubmit({
      ...data,
      id: expense?.id,
      date: data.date.toISOString(),
    });
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{expense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
          <DialogDescription>
            {expense ? 'Update the details of your expense.' : 'Fill in the details or scan a receipt to start.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
            <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
            >
                {isAnalyzing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <ScanLine className="mr-2 h-4 w-4" />
                )}
                <span>{isAnalyzing ? 'Analyzing...' : 'Scan Receipt with AI'}</span>
            </Button>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleAnalyzeReceipt} 
                className="hidden" 
                accept="image/*"
            />
        </div>
        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                Or fill manually
                </span>
            </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(processSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Coffee with a friend" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <div className="flex gap-2">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            <div className="flex items-center gap-2">
                              <cat.icon className="h-4 w-4" />
                              {cat.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" size="icon" onClick={handleSuggestCategory} disabled={isSuggesting}>
                        {isSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-accent-foreground" />}
                        <span className="sr-only">Suggest Category</span>
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit">{expense ? 'Save Changes' : 'Add Expense'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
