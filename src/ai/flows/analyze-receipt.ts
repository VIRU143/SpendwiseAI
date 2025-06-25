'use server';

/**
 * @fileOverview An AI flow to analyze a receipt image and extract expense details.
 *
 * - analyzeReceipt - A function that handles the receipt analysis process.
 * - AnalyzeReceiptInput - The input type for the analyzeReceipt function.
 * - AnalyzeReceiptOutput - The return type for the analyzeReceipt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeReceiptInputSchema = z.object({
  receiptDataUri: z
    .string()
    .describe(
      "A photo of a receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeReceiptInput = z.infer<typeof AnalyzeReceiptInputSchema>;

const AnalyzeReceiptOutputSchema = z.object({
  amount: z.number().describe('The total amount of the expense.'),
  date: z.string().describe('The date of the expense in YYYY-MM-DD format.'),
  notes: z.string().describe('A brief description of the items purchased or the vendor.'),
});
export type AnalyzeReceiptOutput = z.infer<typeof AnalyzeReceiptOutputSchema>;

export async function analyzeReceipt(input: AnalyzeReceiptInput): Promise<AnalyzeReceiptOutput> {
  return analyzeReceiptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'receiptAnalysisPrompt',
  input: {schema: AnalyzeReceiptInputSchema},
  output: {schema: AnalyzeReceiptOutputSchema},
  prompt: `You are an expert receipt analyzer. Analyze the following receipt image and extract the total amount, the date, and a brief summary for the notes. The date should be in YYYY-MM-DD format. If you cannot determine a value, use a sensible default (e.g., 0 for amount, today's date, or "N/A" for notes).

Receipt: {{media url=receiptDataUri}}`,
});

const analyzeReceiptFlow = ai.defineFlow(
  {
    name: 'analyzeReceiptFlow',
    inputSchema: AnalyzeReceiptInputSchema,
    outputSchema: AnalyzeReceiptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
