import type { PlaybackMode, SentenceItem } from '@/types/sentences';

// Playback queue planner: filters playable sentences and orders them for the selected mode.
// Actual audio playback, pause/resume, and session state are handled by playbackSession/audioPlayer.

function getPlayCount(sentence: SentenceItem): number {
  return sentence.playCount ?? 0;
}

function sortByLeastPlayed(sentences: SentenceItem[]): SentenceItem[] {
  return [...sentences].sort((a, b) => getPlayCount(a) - getPlayCount(b));
}

// Returns a random playback order.
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

// Prioritizes less-played sentences while keeping some variety.
function createBalancedQueue(sentences: SentenceItem[]): SentenceItem[] {
  if (sentences.length === 0) {
    return [];
  }

  const sorted = sortByLeastPlayed(sentences);
  const lowestPlayCount = getPlayCount(sorted[0]);

  // Randomize near-lowest candidates so balanced mode does not always start the same way.
  const candidates = sorted.filter(
    (sentence) => getPlayCount(sentence) <= lowestPlayCount + 1
  );

  const rest = sorted.filter(
    (sentence) => getPlayCount(sentence) > lowestPlayCount + 1
  );

  return [...shuffleSentences(candidates), ...rest];
}

// Creates the playback queue based on the selected mode.
export function createPlaybackQueue(
  sentences: SentenceItem[],
  mode: PlaybackMode
): SentenceItem[] {
  const playableSentences = sentences.filter(
    (sentence) => sentence.en.trim() || sentence.zh.trim()
  );

  switch (mode) {
    case 'shuffle':
      return shuffleSentences(playableSentences);
    case 'least_played':
      return sortByLeastPlayed(playableSentences);
    case 'balanced':
      return createBalancedQueue(playableSentences);
    case 'sequential':
    default:
      return playableSentences;
  }
}
