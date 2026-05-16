/**
 * Supported TTS voice names.
 *
 * Currently focused on Azure Neural voices.
 */
export const VoiceName = {
  'en-AU-Female': 'en-AU-NatashaNeural', // Australian English
  'en-AU-Male': 'en-AU-WilliamNeural',
  'en-GB-Female': 'en-GB-SoniaNeural', // British English
  'en-GB-Male': 'en-GB-RyanNeural',
  'en-US-Female': 'en-US-JennyNeural', // American English
  'en-US-Male': 'en-US-GuyNeural',
  'zh-CN-Male': 'zh-CN-XiaoxiaoNeural',
  'zh-CN-Female': 'zh-CN-YunxiNeural',
  'hk-ZH-Female': 'hk-ZH-SinJiNeural', // Cantonese (Hong Kong)
  'hk-ZH-Male': 'hk-ZH-WanLungNeural',
  'jp-JP-Female': 'jp-JP-HarukaNeural',
  'jp-JP-Male': 'jp-JP-KeitaNeural',
  'ko-KR-Female': 'ko-KR-SunHiNeural',
  'ko-KR-Male': 'ko-KR-InJoonNeural',
  'fr-FR-Female': 'fr-FR-DeniseNeural',
  'fr-FR-Male': 'fr-FR-HenriNeural',
  'de-DE-Female': 'de-DE-KatjaNeural',
  'de-DE-Male': 'de-DE-ConradNeural',
  'es-ES-Female': 'es-ES-ElviraNeural', // Spanish (Spain)
  'es-ES-Male': 'es-ES-AlvaroNeural',
  'pt-PT-Female': 'pt-PT-RaquelNeural', // Portuguese (Portugal)
  'pt-PT-Male': 'pt-PT-DuarteNeural',
  'pt-BR-Female': 'pt-BR-FranciscaNeural', // Portuguese (Brazil)
  'pt-BR-Male': 'pt-BR-AntonioNeural',
  'it-IT-Female': 'it-IT-ElsaNeural',
  'it-IT-Male': 'it-IT-CosimoNeural',
  'ru-RU-Female': 'ru-RU-SvetlanaNeural',
  'ru-RU-Male': 'ru-RU-DmitryNeural',
  'th-TH-Female': 'th-TH-SupapornNeural', // Thai
  'th-TH-Male': 'th-TH-PattaraNeural',
} as const;

/**
 * Type representing the supported TTS voice names in the app.
 * export type VoiceNameType = 'en-AU-NatashaNeural' | 'en-AU-WilliamNeural' | 'en-GB-SoniaNeural' | 'en-GB-RyanNeural' | 'en-US-AriaNeural' | 'en-US-JennyNeural' | 'en-US-GuyNeural' | 'zh-CN-XiaoxiaoNeural' | 'zh-CN-YunxiNeural';
 */
export type VoiceNameType = (typeof VoiceName)[keyof typeof VoiceName];

/**
 * Supported TTS languages.
 */
export const LanguageCode = {
  English: 'en',
  Chinese: 'zh',
  Taiwan: 'zh-TW', // Traditional Chinese (Taiwan)
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
 * Type representing the supported language codes in the app.
 * export type LanguageCodeType = 'en' | 'zh' | 'ja' | 'ko' | 'fr' | 'de' | 'es' | 'it' | 'ru' | 'th';
 */
export type LanguageCodeType = (typeof LanguageCode)[keyof typeof LanguageCode];
