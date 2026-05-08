export const LanguageCode = {
  English: 'en',
  Chinese: 'zh',
  // Japanese: 'ja',
  // Korean: 'ko',
  // French: 'fr',
  // German: 'de',
  // Spanish: 'es',
  // Italian: 'it',
  // Russian: 'ru',
  // Thai: 'th',
} as const;

export type LanguageCodeType = (typeof LanguageCode)[keyof typeof LanguageCode];
