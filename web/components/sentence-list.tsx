'use client';

import { Button } from '@/components/ui/button';
import { SentenceItem } from '@/types/senteces';
import { SentenceRow } from './sentence-row';
import { Pause, Play, Square } from 'lucide-react';

type SentenceListProps = {
  sentences: SentenceItem[];
  isHydrated: boolean;
  isPlayingAll: boolean;
  isPaused: boolean;
  playingSentenceId: string | null;
  onPlayAll: () => void;
  onPlaySentence: (sentence: SentenceItem) => void;
  onStopPlayback: () => void;
  onTogglePausePlayback: () => void;
  onDeleteSentence: (id: string) => void;
};

export function SentenceList({
  sentences,
  isHydrated,
  isPlayingAll,
  isPaused,
  playingSentenceId,
  onPlayAll,
  onPlaySentence,
  onStopPlayback,
  onTogglePausePlayback,
  onDeleteSentence,
}: SentenceListProps) {
  const primaryPlaybackLabel = !isPlayingAll
    ? 'Play all'
    : isPaused
      ? 'Resume'
      : 'Pause';

  const PrimaryPlaybackIcon = !isPlayingAll ? Play : isPaused ? Play : Pause;

  function handlePrimaryPlayback() {
    if (!isPlayingAll) {
      onPlayAll();
      return;
    }

    onTogglePausePlayback();
  }

  return (
    <section className="rounded-lg border p4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sentences</h2>
        {/* play all button */}
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={handlePrimaryPlayback}
          disabled={
            !isHydrated || // Prevent mismatch before hydration
            sentences.length === 0 ||
            (!isPlayingAll && playingSentenceId !== null && !isPlayingAll)
          }
        >
          <PrimaryPlaybackIcon />
          {primaryPlaybackLabel}
        </Button>

        {/* pause/resume button */}
        {/* <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={onTogglePausePlayback}
          disabled={!isPlayingAll && playingSentenceId !== null}
        >
          {isPaused ? (
            <>
              <Play />
              Resume
            </>
          ) : (
            <>
              <Pause />
              Pause
            </>
          )}
        </Button> */}

        {/* stop button */}
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={onStopPlayback}
          disabled={!isPlayingAll && playingSentenceId === null}
        >
          <Square />
          Stop
        </Button>
      </div>
      {sentences.length === 0 || !isHydrated ? (
        <p className="mt-1 text-sm text-muted-foreground">No sentences yet.</p>
      ) : (
        <div className="mt-4 space-y-3">
          {sentences.map((sentence, index) => (
            // sentence
            <SentenceRow
              key={sentence.id}
              sentence={sentence}
              index={index}
              isPlaying={playingSentenceId === sentence.id}
              isPlayingAll={isPlayingAll}
              onPlaySentence={onPlaySentence}
              onDeleteSentence={onDeleteSentence}
            />
          ))}
        </div>
      )}
    </section>
  );
}
