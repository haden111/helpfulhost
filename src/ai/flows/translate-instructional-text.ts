
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
import {z}from 'genkit';

const TranslateInstructionalTextInputSchema = z.object({
  textsToTranslate: z.record(z.string().describe("A text string to be translated, associated with a key.")).describe("An object where keys are identifiers and values are the text strings to translate."),
  language: z.string().describe('The target language for translation (e.g., en, es, fr).'),
});
export type TranslateInstructionalTextInput = z.infer<typeof TranslateInstructionalTextInputSchema>;

// This is what the FLOW will ultimately return and what components expect
const TranslateInstructionalTextOutputSchema = z.object({
  translatedTexts: z.record(z.string().describe("The translated text string, corresponding to its input key.")).describe("An object where keys match the input and values are the translated text strings."),
});
export type TranslateInstructionalTextOutput = z.infer<typeof TranslateInstructionalTextOutputSchema>;

// This is what the LLM is prompted to return DIRECTLY
const LLMDirectOutputSchema = z.record(
  z.string().describe("The translated text string, corresponding to its input key.")
).describe("An object where keys match the input and values are the translated text strings. THIS IS THE DIRECT OUTPUT FROM THE LLM.");


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
  output: {schema: LLMDirectOutputSchema}, // LLM returns the inner object directly
  prompt: `You are a professional translator. Translate the values of the following JSON object from their original language into {{language}}.
Return a JSON object with the exact same keys as the input, but with the string values translated to {{language}}.
Preserve the original meaning, tone, and any special characters or placeholders (like "{variable_name}") as accurately as possible in the target language.
If a text contains what appears to be code, a placeholder, or a non-translatable entity (e.g., "1234", "Schlage button", "HDMI1"), keep it as is.

Input JSON:
{{{JSON.stringify textsToTranslate}}}

Respond ONLY with the translated JSON object. Ensure your response is a single, valid JSON object and nothing else.
`,
});

const translateInstructionalTextFlow = ai.defineFlow(
  {
    name: 'translateInstructionalTextFlow',
    inputSchema: TranslateInstructionalTextInputSchema,
    outputSchema: TranslateInstructionalTextOutputSchema, // Flow still adheres to this final output structure
  },
  async (input): Promise<TranslateInstructionalTextOutput> => {
    // This initial check is also in the exported function, but good for direct flow calls too.
    if (Object.keys(input.textsToTranslate).length === 0) {
      return { translatedTexts: {} };
    }

    const {output: llmOutput} = await translateInstructionalTextPrompt(input);

    // Validate the direct LLM output
    if (!llmOutput || typeof llmOutput !== 'object') {
        console.error("LLM translation output is missing or not an object. LLM Output:", llmOutput, "Input:", input.textsToTranslate);
        return { translatedTexts: input.textsToTranslate }; // Fallback
    }
    
    // If LLM output an empty object {} but input was not empty, it's an issue.
    // This check should come before trying to iterate over llmOutput keys if it might be empty.
    if (Object.keys(input.textsToTranslate).length > 0 && Object.keys(llmOutput).length === 0) {
        console.error("LLM translation output was an empty object when input was not empty. LLM Output:", llmOutput, "Input:", input.textsToTranslate);
        return { translatedTexts: input.textsToTranslate };
    }
    
    const resultTexts: Record<string, string> = {};
    let someKeysProblematic = false;
    for (const key in input.textsToTranslate) {
      if (Object.prototype.hasOwnProperty.call(input.textsToTranslate, key)) { // Iterate over input keys
        if (Object.prototype.hasOwnProperty.call(llmOutput, key) && typeof llmOutput[key] === 'string') {
          resultTexts[key] = llmOutput[key];
        } else {
          console.warn(`LLM translation output missing or malformed for key: "${key}". Falling back to original for this key.`);
          resultTexts[key] = input.textsToTranslate[key]; // Fallback for this specific key
          someKeysProblematic = true;
        }
      }
    }

    if (someKeysProblematic) {
      console.warn("Some keys were missing or malformed in LLM output. The final result includes fallbacks for those keys. Result:", resultTexts, "LLM Output:", llmOutput);
    }
    
    return { translatedTexts: resultTexts };
  }
);

