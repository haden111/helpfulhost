import { instructionsData as appInstructionsData, type InstructionLocation } from '../src/lib/instructions-data';

const WELCOME_DEFAULT_TEXTS = {
  welcomeTitle: "A Warm Welcome to Haden's Airbnb",
  guestThankYou: "Thank you for being our guest! We're delighted to have you stay.",
  guideIntro:
    "This digital guide is here to provide you with all the information you need for a comfortable and convenient stay. Whether you need instructions for the appliances, details about the Wi-Fi, or guidance on recycling, you'll find it here in your own language.",
  languageSelectionInfo:
    'Simply choose your language from the selection box at thetop of the page to view the guide in your preferred language.',
  quickAccessHeader: 'Quick Access Instructions:',
};

const FOOTER_DEFAULT_TEXTS = {
  footerMessage: 'If you have further questions, send a message to Haden via the {airbnbAppLink}.',
};

export function collectDefaultTranslationTexts(
  instructionsData: Record<string, InstructionLocation> = appInstructionsData
): Record<string, string> {
  const texts: Record<string, string> = {};

  for (const [key, value] of Object.entries(WELCOME_DEFAULT_TEXTS)) {
    texts[`welcome.${key}`] = value;
  }

  for (const [key, value] of Object.entries(FOOTER_DEFAULT_TEXTS)) {
    texts[`footer.${key}`] = value;
  }

  for (const [locationCode, locationDetails] of Object.entries(instructionsData)) {
    texts[`instructions.${locationCode}.title`] = locationDetails.defaultTexts.title;
    locationDetails.defaultTexts.steps.forEach((step, stepIndex) => {
      step.textSegments.forEach((segment, segmentIndex) => {
        texts[`instructions.${locationCode}.step.${stepIndex}.segment.${segmentIndex}`] =
          segment.content;
      });
    });
  }

  return texts;
}

function extractPlaceholders(text: string): string[] {
  return [...text.matchAll(/\{[^}]+\}/g)].map((match) => match[0]).sort();
}

export function validateTranslatedTexts(
  sourceTexts: Record<string, string>,
  translatedTexts: Record<string, string>
): string[] {
  const issues: string[] = [];

  for (const [key, sourceValue] of Object.entries(sourceTexts)) {
    const translatedValue = translatedTexts[key];
    if (typeof translatedValue !== 'string') {
      issues.push(`${key}: missing translation`);
      continue;
    }

    if (translatedValue.trim().length === 0) {
      issues.push(`${key}: empty translation`);
    }

    const expectedPlaceholders = extractPlaceholders(sourceValue);
    const actualPlaceholders = extractPlaceholders(translatedValue);
    if (expectedPlaceholders.join('|') !== actualPlaceholders.join('|')) {
      const expected = expectedPlaceholders.length > 0 ? expectedPlaceholders.join(', ') : 'none';
      const actual = actualPlaceholders.length > 0 ? actualPlaceholders.join(', ') : 'none';
      issues.push(`${key}: placeholder mismatch, expected ${expected}, got ${actual}`);
    }
  }

  return issues;
}

export function findSuspiciousUnchangedTexts(
  sourceTexts: Record<string, string>,
  translatedTexts: Record<string, string>
): string[] {
  return Object.entries(sourceTexts)
    .filter(([key, sourceValue]) => {
      const translatedValue = translatedTexts[key];
      return (
        typeof translatedValue === 'string' &&
        sourceValue.trim().length > 12 &&
        sourceValue.trim() === translatedValue.trim()
      );
    })
    .map(([key]) => key);
}
