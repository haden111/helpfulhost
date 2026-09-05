import { config } from 'dotenv';
config();

import fs from 'fs-extra';
import path from 'node:path';
import OpenAI from 'openai';
import { supportedLanguages } from '../src/lib/languages';
import {
  collectDefaultTranslationTexts,
  findSuspiciousUnchangedTexts,
  validateTranslatedTexts,
} from './translation-source';

interface CliOptions {
  languages: string[];
  model: string;
  batchSize: number;
  outputDir: string;
}

function parseCliOptions(): CliOptions {
  const args = process.argv.slice(2);
  const readValue = (name: string): string | undefined => {
    const inline = args.find((arg) => arg.startsWith(`--${name}=`));
    if (inline) return inline.slice(name.length + 3);
    const index = args.indexOf(`--${name}`);
    return index >= 0 ? args[index + 1] : undefined;
  };

  const languageValue = readValue('languages') ?? readValue('language');
  const languages = languageValue
    ? languageValue.split(',').map((code) => code.trim().toLowerCase()).filter(Boolean)
    : supportedLanguages.filter((language) => language.code !== 'en').map((language) => language.code);

  return {
    languages,
    model: readValue('model') ?? process.env.OPENAI_TRANSLATION_MODEL ?? 'gpt-5.5',
    batchSize: Number(readValue('batch-size') ?? 40),
    outputDir: readValue('output-dir') ?? path.join(process.cwd(), 'public', 'locales'),
  };
}

function getLanguageLabel(languageCode: string): string {
  const language = supportedLanguages.find((entry) => entry.code === languageCode);
  return language ? language.name : languageCode;
}

function getLocaleInstruction(languageCode: string): string {
  const specificInstructions: Record<string, string> = {
    fr: 'Translate into natural French for France. Use polite "vous" phrasing. Sound like a native host writing clear guest instructions, not a literal machine translation.',
  };

  return (
    specificInstructions[languageCode] ??
    `Translate into natural ${getLanguageLabel(languageCode)}. Sound like a native host writing clear guest instructions, not a literal machine translation.`
  );
}

function chunkEntries<T>(entries: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let index = 0; index < entries.length; index += size) {
    chunks.push(entries.slice(index, index + size));
  }
  return chunks;
}

function buildStructuredOutputSchema(keys: string[]) {
  const translatedTextProperties = Object.fromEntries(
    keys.map((key) => [key, { type: 'string' }])
  );

  return {
    type: 'object',
    additionalProperties: false,
    properties: {
      translatedTexts: {
        type: 'object',
        additionalProperties: false,
        properties: translatedTextProperties,
        required: keys,
      },
    },
    required: ['translatedTexts'],
  };
}

async function translateBatch(
  client: OpenAI,
  model: string,
  languageCode: string,
  batchTexts: Record<string, string>
): Promise<Record<string, string>> {
  const keys = Object.keys(batchTexts);
  const response = await client.responses.create({
    model,
    instructions: [
      'You are a professional hospitality translator.',
      getLocaleInstruction(languageCode),
      'Translate only the values. Keep every JSON key exactly as provided.',
      'Preserve placeholders such as {airbnbAppLink}, numbers, URLs, Wi-Fi, button names, appliance names, and brand/product names unless a native speaker would normally localize them.',
      'Keep safety-critical meaning precise. Prefer clear, idiomatic guest-facing language over word-for-word translation.',
    ].join(' '),
    input: JSON.stringify({
      targetLanguage: languageCode,
      textsToTranslate: batchTexts,
    }),
    text: {
      format: {
        type: 'json_schema',
        name: 'translation_batch',
        strict: true,
        schema: buildStructuredOutputSchema(keys),
      },
      verbosity: 'low',
    },
  });

  const rawOutput = response.output_text;
  if (!rawOutput) {
    throw new Error(`OpenAI returned no text for ${languageCode}`);
  }

  const parsed = JSON.parse(rawOutput) as { translatedTexts?: Record<string, string> };
  if (!parsed.translatedTexts || typeof parsed.translatedTexts !== 'object') {
    throw new Error(`OpenAI returned malformed translation payload for ${languageCode}`);
  }

  return parsed.translatedTexts;
}

async function main() {
  const options = parseCliOptions();
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set. Add it to .env before running this script.');
  }

  if (options.batchSize < 1) {
    throw new Error('--batch-size must be at least 1');
  }

  const sourceTexts = collectDefaultTranslationTexts();
  await fs.ensureDir(options.outputDir);
  await fs.writeJson(path.join(options.outputDir, 'en.json'), sourceTexts, { spaces: 2 });

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const entries = Object.entries(sourceTexts);
  const batches = chunkEntries(entries, options.batchSize);

  console.log(`Source keys: ${entries.length}`);
  console.log(`Model: ${options.model}`);
  console.log(`Languages: ${options.languages.join(', ')}`);

  for (const languageCode of options.languages) {
    if (languageCode === 'en') continue;

    const mergedTranslations: Record<string, string> = {};
    console.log(`Translating ${getLanguageLabel(languageCode)} (${languageCode})...`);

    for (const [batchIndex, batch] of batches.entries()) {
      const batchTexts = Object.fromEntries(batch);
      console.log(`  Batch ${batchIndex + 1}/${batches.length} (${batch.length} keys)`);
      const translatedBatch = await translateBatch(
        client,
        options.model,
        languageCode,
        batchTexts
      );
      Object.assign(mergedTranslations, translatedBatch);
    }

    const issues = validateTranslatedTexts(sourceTexts, mergedTranslations);
    if (issues.length > 0) {
      throw new Error(`Validation failed for ${languageCode}:\n${issues.join('\n')}`);
    }

    const unchangedKeys = findSuspiciousUnchangedTexts(sourceTexts, mergedTranslations);
    if (unchangedKeys.length > 0) {
      console.warn(
        `  Warning: ${unchangedKeys.length} substantial translations were unchanged: ${unchangedKeys
          .slice(0, 10)
          .join(', ')}${unchangedKeys.length > 10 ? ', ...' : ''}`
      );
    }

    const outputPath = path.join(options.outputDir, `${languageCode}.json`);
    await fs.writeJson(outputPath, mergedTranslations, { spaces: 2 });
    console.log(`  Wrote ${outputPath}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
