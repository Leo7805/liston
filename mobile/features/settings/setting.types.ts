import { LanguageCodeType } from '@/global/constants/languages-codes';
import { SortMode } from '@/features/sentences/sentence-sort';

/** Application settings that can be customized by the user */
export type AppSettings = {
  // defaultRepeatCount: number; // Default number of times to repeat each sentence in a session
  // defaultPlaybackSpeed: number; // Default playback speed (e.g. 1.0 for normal speed)
  // defaultPlaybackMode: PlaybackMode; // Default playback mode (e.g. 'sequential', 'shuffle', etc.)

  // pauseBetweenSentencesMs: number; // Whether to pause briefly between sentences during playback
  // pauseBetweenOriginalAndTranslationMs: number; // Whether to pause briefly between original and translation during playback

  sourceLanguage: LanguageCodeType; // Language code for the original sentences (e.g. 'en' for English)
  targetLanguage: LanguageCodeType; // Language code for the translations (e.g. 'zh' for Chinese)
  uiLanguage: LanguageCodeType; // Language code for the app's user interface (e.g. 'en' for English)

  showOriginal: boolean; // Whether to show the original sentence text during playback
  showTranslation: boolean; // Whether to show the translation text during playback

  displaySortMode: SortMode; // Whether to display sentences in the order of the playlist or their original order
};
