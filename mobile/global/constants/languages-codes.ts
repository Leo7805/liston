/**
 * Supported TTS languages.
 */
export const LanguageCode = {
  // English
  English: 'en',
  AustralianEnglish: 'en-AU',
  BritishEnglish: 'en-GB',
  AmericanEnglish: 'en-US',

  // Chinese
  Chinese: 'zh', // Generic Chinese (could be Mandarin or Cantonese depending on voice)
  SimplifiedChinese: 'zh-CN', // Simplified Chinese (Mainland)
  TraditionalChinese: 'zh-TW', // Traditional Chinese (Taiwan)
  Mandarin: 'zh-CN', // Mandarin Chinese (Mainland)
  Cantonese: 'zh-HK', // Cantonese (Hong Kong)
  Taiwan: 'zh-TW', // Traditional Chinese (Taiwan)

  // Other languages
  Japanese: 'ja',
  Korean: 'ko',
  French: 'fr',
  German: 'de',
  Spanish: 'es',
  Italian: 'it',
  Russian: 'ru',
  Thai: 'th',
  Brazil: 'pt-BR',
  Portugal: 'pt-PT',
} as const;

/**
 * Supported UI languages (for app interface localization).
 */
export const UiLanguageCode = {
  English: 'en',
  Chinese: 'zh',
  SimplifiedChinese: 'zh-CN',
  TraditionalChinese: 'zh-TW',
  Japanese: 'ja',
  Korean: 'ko',
  French: 'fr',
  German: 'de',
  Spanish: 'es',
  Italian: 'it',
  Russian: 'ru',
  Thai: 'th',
  Brazil: 'pt-BR',
  Portugal: 'pt-PT',
} as const;

export type LanguageCodeType = (typeof LanguageCode)[keyof typeof LanguageCode];
export type UiLanguageCodeType =
  (typeof UiLanguageCode)[keyof typeof UiLanguageCode];
