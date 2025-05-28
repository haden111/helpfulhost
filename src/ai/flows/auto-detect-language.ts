'use server';

/**
 * @fileOverview Automatically detects the user's preferred language based on browser settings or IP address location.
 *
 * - autoDetectLanguage - A function that handles the language detection process.
 * - AutoDetectLanguageInput - The input type for the autoDetectLanguage function.
 * - AutoDetectLanguageOutput - The return type for the autoDetectLanguage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoDetectLanguageInputSchema = z.object({
  ipAddress: z.string().optional().describe('The IP address of the user.'),
  acceptLanguage: z.string().optional().describe('The Accept-Language header from the browser.'),
});
export type AutoDetectLanguageInput = z.infer<typeof AutoDetectLanguageInputSchema>;

const AutoDetectLanguageOutputSchema = z.object({
  languageCode: z.string().describe('The detected language code (e.g., en, es, fr).'),
});
export type AutoDetectLanguageOutput = z.infer<typeof AutoDetectLanguageOutputSchema>;

export async function autoDetectLanguage(input: AutoDetectLanguageInput): Promise<AutoDetectLanguageOutput> {
  return autoDetectLanguageFlow(input);
}

const autoDetectLanguagePrompt = ai.definePrompt({
  name: 'autoDetectLanguagePrompt',
  input: {schema: AutoDetectLanguageInputSchema},
  output: {schema: AutoDetectLanguageOutputSchema},
  prompt: `You are a helpful assistant that detects the user's preferred language.

  Given the following information, determine the most likely language code for the user.

  IP Address: {{ipAddress}}
  Accept-Language: {{acceptLanguage}}

  Return only the language code.
  `,
});

const autoDetectLanguageFlow = ai.defineFlow(
  {
    name: 'autoDetectLanguageFlow',
    inputSchema: AutoDetectLanguageInputSchema,
    outputSchema: AutoDetectLanguageOutputSchema,
  },
  async input => {
    const {output} = await autoDetectLanguagePrompt(input);
    return {
      languageCode: output!.languageCode,
    };
  }
);
