import type { AppSettings } from './setting.types';
import { LanguageCode } from '@/global/constants/languages-codes';
import { sortMode } from '@/features/sentences/sentence-sort';

/**
 * Default application settings
 * */

export const DEFAULT_APP_SETTINGS: AppSettings = {
  sourceLanguage: LanguageCode.English,
  targetLanguage: LanguageCode.Chinese,
  uiLanguage: LanguageCode.English,

  showOriginal: true,
  showTranslation: true,

  displaySortMode: sortMode.originalOrder,
};
