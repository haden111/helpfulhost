
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

// This is what the LLM is prompted to return DIRECTLY: a JSON string, which can be null
const LLMJsonStringOutputSchema = z.string().nullable().describe(
  "A JSON string where keys match the input and values are the translated text strings. Example: '{\"key1\":\"translated_value1\",\"key2\":\"translated_value2\"}'. Can be null if the model cannot provide a translation."
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
  output: {schema: LLMJsonStringOutputSchema}, // LLM returns a JSON string (or null)
  prompt: `You are a professional translator. Translate the values of the following JSON object from their original language into {{language}}.
Input JSON string to translate:
{{{textsToTranslateJsonString}}}

Respond ONLY with a single, valid JSON string that represents an object with the exact same keys as the input, but with the string values translated to {{language}}.
Preserve the original meaning, tone, and any special characters or placeholders (like "{variable_name}") as accurately as possible in the target language.
If a text contains what appears to be code, a placeholder, or a non-translatable entity (e.g., "1234", "Schlage button", "HDMI1"), keep it as is.

Example of expected output format if input was '{"greeting":"Hello", "farewell":"Goodbye"}' and language was 'es':
'{"greeting":"Hola", "farewell":"Adiós"}'

Ensure your response is ONLY the JSON string and nothing else. If you cannot perform the translation for any reason, respond with null.
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
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

    let llmOutputJsonString: string | null = null;
    try {
      const {output} = await translateInstructionalTextPrompt(promptInput);
      llmOutputJsonString = output; // output is already potentially null due to LLMJsonStringOutputSchema
    } catch (error) {
      console.error("Error calling translateInstructionalTextPrompt:", error);
      // Fallback to original texts if the AI call itself fails (e.g., 503, network issue)
      return { translatedTexts: input.textsToTranslate };
    }
    

    if (llmOutputJsonString === null || typeof llmOutputJsonString !== 'string') {
        console.warn("LLM translation output is null or not a string. Falling back to original. LLM Output:", llmOutputJsonString, "Input:", input.textsToTranslate);
        return { translatedTexts: input.textsToTranslate }; // Fallback
    }

    let parsedOutput: Record<string, string>;
    try {
      // Attempt to clean common LLM artifacts like backticks around JSON
      const cleanedJsonString = llmOutputJsonString.trim().replace(/^```json\s*([\s\S]*?)\s*```$/gm, '$1').trim();
      if (cleanedJsonString === "") { 
        console.warn("LLM translation output was an empty string after cleaning. Falling back. Original string:", llmOutputJsonString);
        return { translatedTexts: input.textsToTranslate }; // Fallback
      }
      parsedOutput = JSON.parse(cleanedJsonString);
      if (typeof parsedOutput !== 'object' || parsedOutput === null) { 
        console.warn("LLM output parsed to non-object or null. Falling back. Parsed:", parsedOutput, "Original string:", llmOutputJsonString, "Cleaned string:", cleanedJsonString);
        return { translatedTexts: input.textsToTranslate }; // Fallback
      }
    } catch (parseError) {
      console.warn("LLM output was a string, but failed to parse as JSON. Falling back. Error:", parseError, "Original string:", llmOutputJsonString);
      return { translatedTexts: input.textsToTranslate }; // Fallback
    }
    
    // Check if the parsed output is an empty object when the input was not empty.
    if (Object.keys(input.textsToTranslate).length > 0 && Object.keys(parsedOutput).length === 0 && llmOutputJsonString.trim() !== '{}') {
        console.warn("LLM translation output parsed to an empty object when input was not empty and original string was not '{}'. Parsed Output:", parsedOutput, "Input:", input.textsToTranslate, "Original string:", llmOutputJsonString);
        // This might be problematic, but the key-by-key fallback below will handle it by returning originals.
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

