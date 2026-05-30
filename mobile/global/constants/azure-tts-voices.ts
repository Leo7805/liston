import {
  LanguageCode,
  type LanguageCodeType,
} from '@/global/constants/languages-codes';

/**
 * Supported TTS voice names.
 * Currently focused on Azure Neural voices.
 */
export const VoiceName = {
  // English (Australia)
  AustraliaFemale: 'en-AU-NatashaNeural',
  AustraliaMale: 'en-AU-WilliamNeural',

  // English (United Kingdom)
  UKFemale: 'en-GB-SoniaNeural',
  UKMale: 'en-GB-RyanNeural',

  // English (United States)
  USFemale: 'en-US-JennyNeural',
  USMale: 'en-US-GuyNeural',

  // Chinese (Mainland)
  ChinaFemale: 'zh-CN-XiaoxiaoNeural',
  ChinaMale: 'zh-CN-YunxiNeural',

  // Chinese (Hong Kong Cantonese)
  HongKongFemale: 'zh-HK-SinJiNeural',
  HongKongMale: 'zh-HK-WanLungNeural',

  // Japanese
  JapanFemale: 'ja-JP-HarukaNeural',
  JapanMale: 'ja-JP-KeitaNeural',

  // Korean
  KoreaFemale: 'ko-KR-SunHiNeural',
  KoreaMale: 'ko-KR-InJoonNeural',

  // French
  FranceFemale: 'fr-FR-DeniseNeural',
  FranceMale: 'fr-FR-HenriNeural',

  // German
  GermanyFemale: 'de-DE-KatjaNeural',
  GermanyMale: 'de-DE-ConradNeural',

  // Spanish (Spain)
  SpainFemale: 'es-ES-ElviraNeural',
  SpainMale: 'es-ES-AlvaroNeural',

  // Portuguese (Portugal)
  PortugalFemale: 'pt-PT-RaquelNeural',
  PortugalMale: 'pt-PT-DuarteNeural',

  // Portuguese (Brazil)
  BrazilFemale: 'pt-BR-FranciscaNeural',
  BrazilMale: 'pt-BR-AntonioNeural',

  // Italian
  ItalyFemale: 'it-IT-ElsaNeural',
  ItalyMale: 'it-IT-CosimoNeural',

  // Russian
  RussiaFemale: 'ru-RU-SvetlanaNeural',
  RussiaMale: 'ru-RU-DmitryNeural',

  // Thai
  ThailandFemale: 'th-TH-SupapornNeural',
  ThailandMale: 'th-TH-PattaraNeural',
} as const;

/**
 * Type representing the supported TTS voice names in the app.
 * */
export type VoiceNameType = (typeof VoiceName)[keyof typeof VoiceName];

/**
 * Supported Azure TTS Voice Names
 */
export const DefaultAzureTtsVoiceNames: {
  [key in LanguageCodeType]: VoiceNameType;
} = {
  /** English */
  [LanguageCode.English]: VoiceName.USFemale,
  [LanguageCode.AustralianEnglish]: VoiceName.AustraliaMale,
  [LanguageCode.BritishEnglish]: VoiceName.UKFemale,
  [LanguageCode.AmericanEnglish]: VoiceName.USFemale,

  /** Chinese */
  [LanguageCode.Chinese]: VoiceName.ChinaFemale,
  [LanguageCode.SimplifiedChinese]: VoiceName.ChinaFemale,
  [LanguageCode.TraditionalChinese]: VoiceName.ChinaFemale,
  [LanguageCode.Cantonese]: VoiceName.HongKongFemale,

  /** Other languages */
  [LanguageCode.Japanese]: VoiceName.JapanFemale,
  [LanguageCode.Korean]: VoiceName.KoreaFemale,
  [LanguageCode.French]: VoiceName.FranceFemale,
  [LanguageCode.German]: VoiceName.GermanyFemale,
  [LanguageCode.Spanish]: VoiceName.SpainFemale,
  [LanguageCode.Italian]: VoiceName.ItalyFemale,
  [LanguageCode.Russian]: VoiceName.RussiaFemale,
  [LanguageCode.Thai]: VoiceName.ThailandFemale,
  [LanguageCode.Brazil]: VoiceName.BrazilFemale,
  [LanguageCode.Portugal]: VoiceName.PortugalFemale,
};
