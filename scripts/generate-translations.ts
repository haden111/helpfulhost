
import { config } from 'dotenv';
config(); // Load .env variables for Genkit API keys

import fs from 'fs-extra';
import path from 'path';
import { supportedLanguages } from '../src/lib/languages';
import { translateInstructionalText } from '../src/ai/flows/translate-instructional-text';
import { instructionsData as appInstructionsData } from '../src/lib/instructions-data'; // Renamed to avoid conflict

// Ensure Genkit AI is initialized (importing ai from genkit.ts handles this)
import { ai } from '../src/ai/genkit';

// Define default texts directly in the script for clarity
const WELCOME_DEFAULT_TEXTS = {
  welcomeTitle: "A Warm Welcome to Haden's Airbnb",
  guestThankYou: "Thank you for being our guest! We're delighted to have you stay.",
  guideIntro: "This digital guide is here to provide you with all the information you need for a comfortable and convenient stay. Whether you need instructions for the appliances, details about the Wi-Fi, or guidance on recycling, you'll find it here in your own language.",
  languageSelectionInfo: "Simply choose your language from the selection box at thetop of the page to view the guide in your preferred language.",
  quickAccessHeader: "Quick Access Instructions:",
};

const FOOTER_DEFAULT_TEXTS = {
  footerMessage: "If you have further questions, send a message to Haden via the Airbnb app.",
};


async function generateTranslations() {
  console.log("Starting translation generation process...");
  ai.noop(); // A simple call to ensure AI toolkit is warm if needed, or just to acknowledge its import.

  const defaultLocale = 'en';
  const localesDir = path.join(process.cwd(), 'public', 'locales');
  await fs.ensureDir(localesDir);
  console.log(`Locale directory ensured at: ${localesDir}`);

  const allDefaultTexts: Record<string, string> = {};

  // Populate from WelcomeMessage defaults
  for (const [key, value] of Object.entries(WELCOME_DEFAULT_TEXTS)) {
    allDefaultTexts[`welcome.${key}`] = value;
  }

  // Populate from FooterContent defaults
  for (const [key, value] of Object.entries(FOOTER_DEFAULT_TEXTS)) {
    allDefaultTexts[`footer.${key}`] = value;
  }

  // Populate from instructionsData
  for (const [locationCode, locationDetails] of Object.entries(appInstructionsData)) {
    allDefaultTexts[`instructions.${locationCode}.title`] = locationDetails.defaultTexts.title;
    locationDetails.defaultTexts.steps.forEach((step, index) => {
      allDefaultTexts[`instructions.${locationCode}.step.${index}`] = step;
    });
  }

  // Write default English translations
  const enFilePath = path.join(localesDir, `${defaultLocale}.json`);
  await fs.writeJson(enFilePath, allDefaultTexts, { spaces: 2 });
  console.log(`Generated English translations: ${enFilePath}`);

  const translationPromises = [];

  for (const lang of supportedLanguages) {
    if (lang.code === defaultLocale) continue; // Skip English

    console.log(`Preparing translation for ${lang.name} (${lang.code})...`);
    
    // Create a promise for each language translation
    const translationPromise = translateInstructionalText({
      textsToTranslate: { ...allDefaultTexts }, // Send a copy
      language: lang.code,
    })
    .then(async (result) => {
      if (result && result.translatedTexts) {
        // Check if any translated text is identical to the original English text
        let fallbackOccurred = false;
        for (const key in result.translatedTexts) {
          if (result.translatedTexts[key] === allDefaultTexts[key]) {
            fallbackOccurred = true;
            console.warn(`[${lang.code}] Potential fallback for key "${key}": Translation is identical to English.`);
          }
        }
        if (fallbackOccurred) {
            console.warn(`[${lang.code}] One or more translations were identical to English, indicating a possible fallback by the AI.`);
        }

        const langFilePath = path.join(localesDir, `${lang.code}.json`);
        await fs.writeJson(langFilePath, result.translatedTexts, { spaces: 2 });
        console.log(`SUCCESS: Generated translations for ${lang.name} (${lang.code}): ${langFilePath}`);
      } else {
        console.warn(`WARNING: Could not get complete translations for ${lang.name} (${lang.code}). Result was:`, JSON.stringify(result));
        // Optionally, write the original English texts as a fallback for this language file
        const langFilePath = path.join(localesDir, `${lang.code}.json`);
        await fs.writeJson(langFilePath, allDefaultTexts, { spaces: 2 });
        console.warn(`WARNING: Wrote English fallbacks to ${lang.code}.json due to missing translation result.`);
      }
    })
    .catch(async (error) => {
      console.error(`ERROR: Translating to ${lang.name} (${lang.code}) failed:`, error.message || error);
      // Write English fallbacks if an error occurs
      const langFilePath = path.join(localesDir, `${lang.code}.json`);
      await fs.writeJson(langFilePath, allDefaultTexts, { spaces: 2 });
      console.warn(`ERROR: Wrote English fallbacks to ${lang.code}.json due to error during translation.`);
    });
    
    translationPromises.push(translationPromise);
    
    // Optional: Add a delay between initiating calls if hitting immediate rate limits, though Genkit might handle some of this.
    // This delay is now less critical as we batch with Promise.all, but can be useful if the translateInstructionalText itself is internally very fast and we're starting too many "concurrent" Genkit flows.
    // For now, Promise.all will manage concurrency of these outer promises.
    // await new Promise(resolve => setTimeout(resolve, 1000)); // e.g., 1-second delay before starting the next language
  }

  // Wait for all translation promises to settle
  console.log(`Waiting for ${translationPromises.length} language translations to complete...`);
  await Promise.allSettled(translationPromises);

  console.log('Translation generation process complete.');
  console.log('Please review any warnings or errors above.');
  console.log(`Generated files are in: ${localesDir}`);
}

// Execute the script
generateTranslations()
  .then(() => {
    console.log("Script finished successfully.");
    // Genkit flows might keep the process alive. Explicitly exit.
    process.exit(0);
  })
  .catch((error) => {
    console.error("Unhandled error in generateTranslations script:", error);
    process.exit(1);
  });
