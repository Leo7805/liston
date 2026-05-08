'use client';

// Renders the sentence section with playback controls and sentence rows.

import type { SentenceItem } from '@/types/sentences';
import { PlaybackControls } from './playback-controls';
import { SentenceRow } from './sentence-row';
import type { SentencePlayback } from '@/hook/useSentencePlayback';
import type { SentenceStore } from '@/hook/useStoredSentences';

type SentenceListProps = {
  sentenceStore: SentenceStore;
  isHydrated: boolean;
  playback: SentencePlayback;
};

export function SentenceList({
  sentenceStore,
  isHydrated,
  playback,
}: SentenceListProps) {
  const { sentences, deleteSentence } = sentenceStore;
  const hasSentences = sentences.length > 0;
  const shouldShowEmptyState = !isHydrated || !hasSentences;

  const playSentence: (s: SentenceItem) => void = playback.status.isPlayingAll
    ? (sentence) => playback.actions.playFromSentence(sentence.id)
    : playback.actions.playSentence;

  return (
    <section className="p4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Sentences</h2>

        {/* Playback controls */}
        <PlaybackControls
          isHydrated={isHydrated}
          hasSentences={hasSentences}
          playback={playback}
        />
      </div>

      {shouldShowEmptyState ? (
        <p className="mt-1 text-sm text-muted-foreground">No sentences yet.</p>
      ) : (
        <>
          {/* Sentence rows */}
          <div className="mt-4 space-y-3">
            {sentences.map((sentence, index) => (
              <SentenceRow
                key={sentence.id}
                sentence={sentence}
                index={index}
                isPlaying={playback.status.playingSentenceId === sentence.id}
                isPlayingAll={playback.status.isPlayingAll}
                onPlaySentence={playSentence}
                onDeleteSentence={deleteSentence}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
