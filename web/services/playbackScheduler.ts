import type { PlaybackMode, SentenceItem } from '@/types/senteces';

function getPlayCount(sentence: SentenceItem): number {
  return sentence.playCount ?? 0;
}

function sortByLeastPlayed(sentences: SentenceItem[]): SentenceItem[] {
  return [...sentences].sort((a, b) => getPlayCount(a) - getPlayCount(b));
}

// 1. Shuffle mode (random order each time)
function shuffleSentences(sentences: SentenceItem[]): SentenceItem[] {
  const shuffled = [...sentences];

  for (let index = shuffled.length - 1; index > 0; index--) {
    const randomIndex = Math.floor(Math.random() * (index + 1));

    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

// 2. Balanced mode (default order, no shuffling)
function createBalancedQueue(sentences: SentenceItem[]): SentenceItem[] {
  const sorted = sortByLeastPlayed(sentences);
  const lowestPlayCount = getPlayCount(sorted[0]);

  // least played first, but with randomness among sentences with similar play counts to avoid always playing the same "least played" sentence first
  const candidates = sorted.filter(
    (sentence) => getPlayCount(sentence) <= lowestPlayCount + 1
  );

  const rest = sorted.filter(
    (sentence) => getPlayCount(sentence) > lowestPlayCount + 1
  );

  return [...shuffleSentences(candidates), ...rest];
}

export function createPlaybackQueue(
  sentences: SentenceItem[],
  mode: PlaybackMode
): SentenceItem[] {
  const playableSentences = sentences.filter(
    (sentence) => sentence.en.trim() || sentence.zh.trim()
  );

  if (mode === 'shuffle') {
    return shuffleSentences(playableSentences);
  }

  if (mode === 'least_played') {
    return sortByLeastPlayed(playableSentences);
  }

  if (mode === 'balanced') {
    return createBalancedQueue(playableSentences);
  }

  // default to sequential
  return playableSentences;
}
