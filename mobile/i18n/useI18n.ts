import { useState } from 'react';
import {
  type AppLanguage,
  type TranslationKey,
  translations,
} from '@/i18n/translations';

export function useI18n() {
  const [appLanguage, setAppLanguage] = useState<AppLanguage>('en');

  /**
   * Retrieves the translated string for the given nested key based on the current language.
   * Example: t('actions.play'), t('actions.play', 'zh')
   */
  function t(key: TranslationKey, overrideLanguage?: AppLanguage): string {
    const lang = overrideLanguage ?? appLanguage;

    const keys = key.split('.');

    let value: unknown = translations[lang];

    for (const k of keys) {
      if (typeof value !== 'object' || value === null || !(k in value)) {
        console.warn(`Missing translation key: ${key}".`);
        return key;
      }

      value = (value as Record<string, unknown>)[k];
    }

    return typeof value === 'string' ? value : key;
  }

  function toggleAppLanguage() {
    setAppLanguage((prev) => (prev === 'en' ? 'zh' : 'en'));
  }

  return {
    appLanguage,
    setAppLanguage,
    toggleAppLanguage,
    t,
  };
}
