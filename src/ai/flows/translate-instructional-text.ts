
// src/ai/flows/translate-instructional-text.ts
'use server';

/**
 * @fileOverview Translates a batch of instructional texts to a specified language using Genkit.
 *
 * - translateInstructionalText - A function to translate multiple texts.
 * - TranslateInstructionalTextInput - The input type for the translation function.
 * - TranslateInstructionalTextOutput - The output type for the translation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateInstructionalTextInputSchema = z.object({
  textsToTranslate: z.record(z.string().describe("A text string to be translated, associated with a key.")).describe("An object where keys are identifiers and values are the text strings to translate."),
  language: z.string().describe('The target language for translation (e.g., en, es, fr).'),
});
export type TranslateInstructionalTextInput = z.infer<typeof TranslateInstructionalTextInputSchema>;

const TranslateInstructionalTextOutputSchema = z.object({
  translatedTexts: z.record(z.string().describe("The translated text string, corresponding to its input key.")).describe("An object where keys match the input and values are the translated text strings."),
});
export type TranslateInstructionalTextOutput = z.infer<typeof TranslateInstructionalTextOutputSchema>;

export async function translateInstructionalText(
  input: TranslateInstructionalTextInput
): Promise<TranslateInstructionalTextOutput> {
  // Handle empty textsToTranslate to avoid unnecessary API calls
  if (Object.keys(input.textsToTranslate).length === 0) {
    return { translatedTexts: {} };
  }
  return translateInstructionalTextFlow(input);
}

const translateInstructionalTextPrompt = ai.definePrompt({
  name: 'translateInstructionalTextPrompt',
  input: {schema: TranslateInstructionalTextInputSchema},
  output: {schema: TranslateInstructionalTextOutputSchema},
  prompt: `You are a professional translator. Translate the values of the following JSON object from their original language into {{language}}.
Return a JSON object with the exact same keys as the input, but with the string values translated to {{language}}.
Preserve the original meaning, tone, and any special characters or placeholders (like "{variable_name}") as accurately as possible in the target language.
If a text contains what appears tobe code, a placeholder, or a non-translatable entity (e.g., "1234", "Schlage button", "HDMI1"), keep it as is.

Input JSON:
{{{JSON.stringify textsToTranslate}}}

Respond ONLY with the translated JSON object.
`,
});

const translateInstructionalTextFlow = ai.defineFlow(
  {
    name: 'translateInstructionalTextFlow',
    inputSchema: TranslateInstructionalTextInputSchema,
    outputSchema: TranslateInstructionalTextOutputSchema,
  },
  async input => {
    // Add a check for empty input to prevent errors with the prompt
    if (Object.keys(input.textsToTranslate).length === 0) {
      return { translatedTexts: {} };
    }
    const {output} = await translateInstructionalTextPrompt(input);
    // Ensure output is not null, and translatedTexts exists
    if (!output || !output.translatedTexts) {
        console.error("Translation output is missing or malformed", output);
        // Fallback: return original texts if translation fails critically
        return { translatedTexts: input.textsToTranslate };
    }
    return output;
  }
);
