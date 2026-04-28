'use client';

import { Button } from '@/components/ui/button';
import { PlaybackMode, SentenceItem } from '@/types/senteces';
import { SentenceRow } from './sentence-row';
import { Pause, Play, Square } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SentenceListProps = {
  sentences: SentenceItem[];
  isHydrated: boolean;
  isPlayingAll: boolean;
  isPaused: boolean;
  playingSentenceId: string | null;
  playbackMode: PlaybackMode;
  loopPlayback: boolean;
  onPlayAll: () => void;
  onPlaySentence: (sentence: SentenceItem) => void;
  onStopPlayback: () => void;
  onTogglePausePlayback: () => void;
  onDeleteSentence: (id: string) => void;
  onPlaybackModeChange: (mode: PlaybackMode) => void;
  onLoopPlaybackChange: (loop: boolean) => void;
};

export function SentenceList({
  sentences,
  isHydrated,
  isPlayingAll,
  isPaused,
  playingSentenceId,
  playbackMode,
  loopPlayback,
  onPlayAll,
  onPlaySentence,
  onPlaybackModeChange,
  onLoopPlaybackChange,
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
  const controlClassName =
    'h-8 rounded-lg border px-3 text-sm inline-flex items-center justify-center gap-1.5 whitespace-nowrap';

  function handlePrimaryPlayback() {
    if (!isPlayingAll) {
      onPlayAll();
      return;
    }

    onTogglePausePlayback();
  }

  return (
    <section className="p4">
      {/* <section className="rounded-lg border p4"> */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Sentences</h2>
        <div className="flex flex-wrap items-center gap-2">
          {/* playbackMode Select */}
          <Select
            value={playbackMode}
            onValueChange={(value) =>
              onPlaybackModeChange(value as PlaybackMode)
            }
          >
            <SelectTrigger
              className={`${controlClassName} cursor-pointer hover:bg-muted data-[state=open]:bg-muted`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sequential">Sequential</SelectItem>
              <SelectItem value="shuffle">Shuffle</SelectItem>
              <SelectItem value="repeat_one">Repeat One</SelectItem>
              <SelectItem value="least_played">Least Played First</SelectItem>
              <SelectItem value="balanced">Balanced</SelectItem>
            </SelectContent>
          </Select>

          {/* loop toggle */}
          <Button
            type="button"
            variant="outline"
            onClick={() => onLoopPlaybackChange(!loopPlayback)}
            className={`${controlClassName} inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${
              loopPlayback
                ? 'border-emerald-500 text-emerald-600'
                : 'border-border bg-background text-foreground hover:bg-muted'
            }`}
          >
            Loop
          </Button>
          {/* play all button */}
          <Button
            variant="outline"
            className={`${controlClassName} cursor-pointer`}
            onClick={handlePrimaryPlayback}
            disabled={
              !isHydrated || // Prevent mismatch before hydration
              sentences.length === 0 ||
              (playingSentenceId !== null && !isPlayingAll) // Disable if a sentence is playing but not in "play all" mode
            }
          >
            <PrimaryPlaybackIcon />
            {primaryPlaybackLabel}
          </Button>

          {/* stop button */}
          <Button
            variant="outline"
            className={`${controlClassName} cursor-pointer`}
            onClick={onStopPlayback}
            disabled={!isPlayingAll && playingSentenceId === null}
          >
            <Square />
            Stop
          </Button>
        </div>
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
