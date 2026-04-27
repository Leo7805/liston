export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL!,
  voices: {
    en: process.env.NEXT_PUBLIC_TTS_EN_VOICE!,
    zh: process.env.NEXT_PUBLIC_TTS_ZH_VOICE!,
  },
};
