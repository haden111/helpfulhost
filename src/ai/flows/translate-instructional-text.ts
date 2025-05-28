// src/ai/flows/translate-instructional-text.ts
'use server';

/**
 * @fileOverview Translates instructional text to a specified language using Genkit.
 *
 * - translateInstructionalText - A function to translate text.
 * - TranslateInstructionalTextInput - The input type for the translation function.
 * - TranslateInstructionalTextOutput - The output type for the translation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateInstructionalTextInputSchema = z.object({
  text: z.string().describe('The instructional text to translate.'),
  language: z.string().describe('The target language for translation (e.g., en, es, fr).'),
});
export type TranslateInstructionalTextInput = z.infer<typeof TranslateInstructionalTextInputSchema>;

const TranslateInstructionalTextOutputSchema = z.object({
  translatedText: z.string().describe('The translated instructional text.'),
});
export type TranslateInstructionalTextOutput = z.infer<typeof TranslateInstructionalTextOutputSchema>;

export async function translateInstructionalText(
  input: TranslateInstructionalTextInput
): Promise<TranslateInstructionalTextOutput> {
  return translateInstructionalTextFlow(input);
}

const translateInstructionalTextPrompt = ai.definePrompt({
  name: 'translateInstructionalTextPrompt',
  input: {schema: TranslateInstructionalTextInputSchema},
  output: {schema: TranslateInstructionalTextOutputSchema},
  prompt: `Translate the following instructional text to {{language}}:

{{{text}}}`,
});

const translateInstructionalTextFlow = ai.defineFlow(
  {
    name: 'translateInstructionalTextFlow',
    inputSchema: TranslateInstructionalTextInputSchema,
    outputSchema: TranslateInstructionalTextOutputSchema,
  },
  async input => {
    const {output} = await translateInstructionalTextPrompt(input);
    return output!;
  }
);
