/**
 * Internationalization (i18n) definitions for the application.
 *
 * This file provides:
 * - A readonly translation dictionary for all supported languages
 * - Strongly typed language codes inferred from the translation object
 * - Strongly typed translation keys inferred from the English dictionary
 *
 */

/**
 * Translation dictionary for all supported languages.
 */
export const translations = {
  en: {
    app: {
      title: 'Liston',
      switchLanguage: 'Switch to Chinese',
    },

    input: {
      sourcePlaceholder: 'Enter source text...',
      translationPlaceholder: 'Enter translated text...',
    },

    actions: {
      generate: 'Generate TTS',
      generating: 'Generating...',
      play: 'Play',
      pause: 'Pause',
    },

    settings: {
      title: 'Settings',
      language: 'Language',
    },

    playbackMode: {
      sequential: 'Sequential',
      shuffle: 'Shuffle',
      least_played: 'Least played first',
      most_played: 'Most played first',
      high_rating: 'Highest rated first',
      favorite_first: 'Favorites first',
      long_first: 'Long sentences first',
      short_first: 'Short sentences first',
      latest_first: 'Latest first',
    },
  },

  zh: {
    app: {
      title: '立听',
      switchLanguage: '切换到英文',
    },

    input: {
      sourcePlaceholder: '输入原文...',
      translationPlaceholder: '输入译文...',
    },

    actions: {
      generate: '生成音频',
      generating: '生成中...',
      play: '播放',
      pause: '暂停',
    },

    settings: {
      title: '设置',
      language: '语言',
    },

    playbackMode: {
      sequential: '顺序播放',
      shuffle: '随机播放',
      least_played: '播放少的优先',
      most_played: '播放多的优先',
      high_rating: '高评分优先',
      favorite_first: '收藏优先',
      long_first: '长句优先',
      short_first: '短句优先',
      latest_first: '最近播放优先',
    },
  },
} as const;

/**
 * Supported language codes inferred from `translations`.
 * Example: 'en' | 'zh'
 */
export type AppLanguage = keyof typeof translations;

/**
 * Recursively constructs a union type of all nested keys in the given object T.
 * @internal
 * @template T - The object type to extract nested keys from.
 */
type NestedKeyOf<T extends object> = {
  [K in keyof T & string]: T[K] extends object
    ? `${K}.${NestedKeyOf<T[K]>}`
    : K;
}[keyof T & string];

/**
 * All valid translation keys inferred from `translations.en` using `NestedKeyOf`.
 * Example: 'app.title' | 'input.sourcePlaceholder' | 'input.translationPlaceholder' | ...
 */
export type TranslationKey = NestedKeyOf<typeof translations.en>;
