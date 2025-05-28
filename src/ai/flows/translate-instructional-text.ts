
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

// Schema for the input to the exported function and the overall flow
const TranslateInstructionalTextFlowInputSchema = z.object({
  textsToTranslate: z.record(z.string().describe("A text string to be translated, associated with a key.")).describe("An object where keys are identifiers and values are the text strings to translate."),
  language: z.string().describe('The target language for translation (e.g., en, es, fr).'),
});
export type TranslateInstructionalTextInput = z.infer<typeof TranslateInstructionalTextFlowInputSchema>;

// Schema for the actual input to the LLM prompt (with pre-stringified JSON)
const TranslateInstructionalTextPromptInputSchema = z.object({
  textsToTranslateJsonString: z.string().describe("A JSON string representing the object of texts to translate."),
  language: z.string().describe('The target language for translation (e.g., en, es, fr).'),
});

// This is what the FLOW will ultimately return and what components expect
const TranslateInstructionalTextOutputSchema = z.object({
  translatedTexts: z.record(z.string().describe("The translated text string, corresponding to its input key.")).describe("An object where keys match the input and values are the translated text strings."),
});
export type TranslateInstructionalTextOutput = z.infer<typeof TranslateInstructionalTextOutputSchema>;

// This is what the LLM is prompted to return DIRECTLY: a JSON string
const LLMJsonStringOutputSchema = z.string().describe(
  "A JSON string where keys match the input and values are the translated text strings. Example: '{\"key1\":\"translated_value1\",\"key2\":\"translated_value2\"}'"
);


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
  input: {schema: TranslateInstructionalTextPromptInputSchema},
  output: {schema: LLMJsonStringOutputSchema}, // LLM returns a JSON string
  prompt: `You are a professional translator. Translate the values of the following JSON object from their original language into {{language}}.
Input JSON string to translate:
{{{textsToTranslateJsonString}}}

Respond ONLY with a single, valid JSON string that represents an object with the exact same keys as the input, but with the string values translated to {{language}}.
Preserve the original meaning, tone, and any special characters or placeholders (like "{variable_name}") as accurately as possible in the target language.
If a text contains what appears to be code, a placeholder, or a non-translatable entity (e.g., "1234", "Schlage button", "HDMI1"), keep it as is.

Example of expected output format if input was '{"greeting":"Hello", "farewell":"Goodbye"}' and language was 'es':
'{"greeting":"Hola", "farewell":"Adiós"}'

Ensure your response is ONLY the JSON string and nothing else.
`,
});

const translateInstructionalTextFlow = ai.defineFlow(
  {
    name: 'translateInstructionalTextFlow',
    inputSchema: TranslateInstructionalTextFlowInputSchema, // Flow input is the original object
    outputSchema: TranslateInstructionalTextOutputSchema, // Flow still adheres to this final output structure
  },
  async (input): Promise<TranslateInstructionalTextOutput> => {
    if (Object.keys(input.textsToTranslate).length === 0) {
      return { translatedTexts: {} };
    }

    const promptInput = {
      textsToTranslateJsonString: JSON.stringify(input.textsToTranslate),
      language: input.language,
    };

    const {output: llmOutputJsonString} = await translateInstructionalTextPrompt(promptInput);

    if (!llmOutputJsonString || typeof llmOutputJsonString !== 'string') {
        console.error("LLM translation output is missing or not a string. LLM Output:", llmOutputJsonString, "Input:", input.textsToTranslate);
        return { translatedTexts: input.textsToTranslate }; // Fallback
    }

    let parsedOutput: Record<string, string>;
    try {
      // Attempt to clean common LLM artifacts like backticks around JSON
      const cleanedJsonString = llmOutputJsonString.trim().replace(/^```json\s*([\s\S]*?)\s*```$/gm, '$1').trim();
      parsedOutput = JSON.parse(cleanedJsonString);
      if (typeof parsedOutput !== 'object' || parsedOutput === null) {
        console.error("LLM output parsed to non-object:", parsedOutput, "Original string:", llmOutputJsonString, "Cleaned string:", cleanedJsonString);
        return { translatedTexts: input.textsToTranslate }; // Fallback
      }
    } catch (parseError) {
      console.error("LLM output was a string, but failed to parse as JSON:", parseError, "Original string:", llmOutputJsonString);
      return { translatedTexts: input.textsToTranslate }; // Fallback
    }
    
    if (Object.keys(input.textsToTranslate).length > 0 && Object.keys(parsedOutput).length === 0 && llmOutputJsonString.trim() !== '{}' && llmOutputJsonString.trim() !== '""') {
        console.warn("LLM translation output parsed to an empty object when input was not empty. Parsed Output:", parsedOutput, "Input:", input.textsToTranslate, "Original string:", llmOutputJsonString);
        // If the original string was just empty or an empty object string, this might be fine. Otherwise, it's a problem.
        // We can be more lenient here, or strict. For now, if input wasn't empty and output became empty AND it wasn't intentional, consider fallback.
        // This case is tricky. Let's assume if the model truly intended an empty object, the string would be "{}".
        // If it's empty for other reasons, it might be a sign of a problem.
         if (Object.keys(input.textsToTranslate).length > 0 && Object.keys(parsedOutput).length === 0) {
            // This condition implies the model returned an empty JSON object string, like "{}"
            // If the input wasn't empty, this might be an issue if not all keys were optional or translated to empty.
            // However, our current logic below handles missing keys by falling back.
         }
    }
    
    const resultTexts: Record<string, string> = {};
    let someKeysProblematic = false;
    for (const key in input.textsToTranslate) {
      if (Object.prototype.hasOwnProperty.call(input.textsToTranslate, key)) { // Iterate over input keys
        if (Object.prototype.hasOwnProperty.call(parsedOutput, key) && typeof parsedOutput[key] === 'string') {
          resultTexts[key] = parsedOutput[key];
        } else {
          console.warn(`Parsed LLM translation output missing or malformed for key: "${key}". Falling back to original for this key. Parsed output for key: `, parsedOutput[key]);
          resultTexts[key] = input.textsToTranslate[key]; // Fallback for this specific key
          someKeysProblematic = true;
        }
      }
    }

    if (someKeysProblematic) {
      console.warn("Some keys were missing or malformed in parsed LLM output. The final result includes fallbacks for those keys. Result:", resultTexts, "Parsed Output:", parsedOutput, "Original string:", llmOutputJsonString);
    }
    
    return { translatedTexts: resultTexts };
  }
);
