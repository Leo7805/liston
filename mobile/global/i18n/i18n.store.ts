import { create } from 'zustand';
import { AppLanguage, TranslationKey, translations } from './translations';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type I18nState = {
  appLanguage: AppLanguage;

  setAppLanguage: (language: AppLanguage) => void;
  t: (key: TranslationKey) => string;
  toggleAppLanguage: () => void;
};

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      appLanguage: 'en', // Default language

      setAppLanguage: (language: AppLanguage) => {
        set({ appLanguage: language });
      },

      t: (key: TranslationKey) => {
        const { appLanguage } = get();
        const keys = key.split('.');

        let value: unknown = translations[appLanguage];

        for (const k of keys) {
          if (typeof value !== 'object' || value === null || !(k in value)) {
            console.warn(`Missing translation key: ${key}".`);
            return key; // Return the key itself if translation is missing
          }

          value = (value as Record<string, unknown>)[k];
        }

        return typeof value === 'string' ? value : key;
      },

      toggleAppLanguage: () => {
        const { appLanguage } = get();
        set({
          appLanguage: appLanguage === 'en' ? 'zh' : 'en',
        });
      },
    }),
    {
      name: 'i18n-storage', // Name of the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage), // Use localStorage for persistence
    }
  )
);
