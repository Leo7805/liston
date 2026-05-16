import { VoiceName, type VoiceNameType } from '@/types/tts';

/*
 * Centralized configuration for TTS API and voice names.
 */

const defaultEnVoice: VoiceNameType = VoiceName['en-US-Female'];
const defaultZhVoice: VoiceNameType = VoiceName['zh-CN-Female'];
const defaultJpVoice: VoiceNameType = VoiceName['jp-JP-Female'];
const defaultKoVoice: VoiceNameType = VoiceName['ko-KR-Female'];
const defaultFrVoice: VoiceNameType = VoiceName['fr-FR-Female'];
const defaultDeVoice: VoiceNameType = VoiceName['de-DE-Female'];
const defaultEsVoice: VoiceNameType = VoiceName['es-ES-Female'];
const defaultItVoice: VoiceNameType = VoiceName['it-IT-Female'];
const defaultRuVoice: VoiceNameType = VoiceName['ru-RU-Female'];
const defaultThVoice: VoiceNameType = VoiceName['th-TH-Female'];
const defaultPtBrVoice: VoiceNameType = VoiceName['pt-BR-Female'];
const defaultPtPtVoice: VoiceNameType = VoiceName['pt-PT-Female'];

type ConfigType = {
  apiBaseUrl: string;
  voices: {
    en: VoiceNameType;
    zh: VoiceNameType;
    jp: VoiceNameType;
    ko: VoiceNameType;
    fr: VoiceNameType;
    de: VoiceNameType;
    es: VoiceNameType;
    it: VoiceNameType;
    ru: VoiceNameType;
    th: VoiceNameType;
    ptBr: VoiceNameType;
    ptPt: VoiceNameType;
  };
};

export const config: ConfigType = {
  apiBaseUrl:
    process.env.EXPO_PUBLIC_API_BASE_URL || 'https://tts-api.jinleo.dev', // default value if env var is not set
  voices: {
    en:
      (process.env.EXPO_PUBLIC_TTS_EN_VOICE as VoiceNameType) || defaultEnVoice,
    zh:
      (process.env.EXPO_PUBLIC_TTS_ZH_VOICE as VoiceNameType) || defaultZhVoice,
    jp:
      (process.env.EXPO_PUBLIC_TTS_JP_VOICE as VoiceNameType) || defaultJpVoice,
    ko:
      (process.env.EXPO_PUBLIC_TTS_KO_VOICE as VoiceNameType) || defaultKoVoice,
    fr:
      (process.env.EXPO_PUBLIC_TTS_FR_VOICE as VoiceNameType) || defaultFrVoice,
    de:
      (process.env.EXPO_PUBLIC_TTS_DE_VOICE as VoiceNameType) || defaultDeVoice,
    es:
      (process.env.EXPO_PUBLIC_TTS_ES_VOICE as VoiceNameType) || defaultEsVoice,
    it:
      (process.env.EXPO_PUBLIC_TTS_IT_VOICE as VoiceNameType) || defaultItVoice,
    ru:
      (process.env.EXPO_PUBLIC_TTS_RU_VOICE as VoiceNameType) || defaultRuVoice,
    th:
      (process.env.EXPO_PUBLIC_TTS_TH_VOICE as VoiceNameType) || defaultThVoice,
    ptBr:
      (process.env.EXPO_PUBLIC_TTS_PT_BR_VOICE as VoiceNameType) ||
      defaultPtBrVoice,
    ptPt:
      (process.env.EXPO_PUBLIC_TTS_PT_PT_VOICE as VoiceNameType) ||
      defaultPtPtVoice,
  },
};
