import assert from 'node:assert/strict';
import {
  collectDefaultTranslationTexts,
  validateTranslatedTexts,
} from './translation-source';
import { instructionsData } from '../src/lib/instructions-data';

const sourceTexts = collectDefaultTranslationTexts(instructionsData);

assert.equal(
  sourceTexts['welcome.welcomeTitle'],
  "A Warm Welcome to Haden's Airbnb",
  'collects welcome copy'
);

assert.ok(
  Object.keys(sourceTexts).some((key) => key.startsWith('instructions.')),
  'collects instruction copy'
);

assert.deepEqual(
  validateTranslatedTexts(
    {
      'footer.footerMessage':
        'If you have further questions, send a message via the {airbnbAppLink}.',
    },
    {
      'footer.footerMessage':
        'Si vous avez des questions, envoyez un message via {airbnbAppLink}.',
    }
  ),
  [],
  'accepts matching placeholders'
);

assert.deepEqual(
  validateTranslatedTexts(
    {
      'footer.footerMessage':
        'If you have further questions, send a message via the {airbnbAppLink}.',
    },
    {
      'footer.footerMessage': 'Si vous avez des questions, envoyez un message.',
    }
  ),
  ['footer.footerMessage: placeholder mismatch, expected {airbnbAppLink}, got none'],
  'rejects missing placeholders'
);

console.log('openai translation helper tests passed');
