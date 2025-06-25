// src/ai/flows/categorize-expense.ts
'use server';

/**
 * @fileOverview Provides AI-powered expense category suggestions based on a description.
 *
 * - suggestCategory - A function that suggests expense categories.
 * - CategorySuggestionInput - The input type for the suggestCategory function.
 * - CategorySuggestionOutput - The return type for the suggestCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorySuggestionInputSchema = z.object({
  description: z.string().describe('The description of the expense.'),
});
export type CategorySuggestionInput = z.infer<typeof CategorySuggestionInputSchema>;

const validCategories = [
    "Food",
    "Transport",
    "Utilities",
    "Entertainment",
    "Health",
    "Shopping",
    "Other",
] as const;


const CategorySuggestionOutputSchema = z.object({
  category: z.enum(validCategories).describe('The suggested category for the expense.'),
});
export type CategorySuggestionOutput = z.infer<typeof CategorySuggestionOutputSchema>;

export async function suggestCategory(input: CategorySuggestionInput): Promise<CategorySuggestionOutput> {
  return suggestCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorySuggestionPrompt',
  input: {schema: CategorySuggestionInputSchema},
  output: {schema: CategorySuggestionOutputSchema},
  prompt: `Given the following expense description, suggest an appropriate category for the expense from the available options.

Description: {{{description}}}`,
});

const suggestCategoryFlow = ai.defineFlow(
  {
    name: 'suggestCategoryFlow',
    inputSchema: CategorySuggestionInputSchema,
    outputSchema: CategorySuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
