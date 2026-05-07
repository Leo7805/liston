'use client';

// Renders playback mode, loop, play/pause, and stop controls.

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PlaybackMode } from '@/types/sentences';
import type { SentencePlayback } from '@/hook/useSentencePlayback';
import { Pause, Play, Square } from 'lucide-react';

const PLAYBACK_MODE_OPTIONS: Array<{
  value: PlaybackMode;
  label: string;
}> = [
  { value: 'sequential', label: 'Sequential' },
  { value: 'shuffle', label: 'Shuffle' },
  { value: 'least_played', label: 'Least Played First' },
  { value: 'balanced', label: 'Balanced' },
];

type PlaybackControlsProps = {
  isHydrated: boolean;
  hasSentences: boolean;
  playback: SentencePlayback;
};

export function PlaybackControls({
  isHydrated,
  hasSentences,
  playback,
}: PlaybackControlsProps) {
  const { settings, status, actions } = playback;

  const PrimaryPlaybackIcon = !status.isPlayingAll
    ? Play
    : status.isPaused
      ? Play
      : Pause;
  const primaryPlaybackLabel = !status.isPlayingAll
    ? 'Play all'
    : status.isPaused
      ? 'Resume'
      : 'Pause';
  const controlClassName =
    'h-8 rounded-lg border px-3 text-sm inline-flex items-center justify-center gap-1.5 whitespace-nowrap';

  const isSingleSentencePlaying =
    status.playingSentenceId !== null && !status.isPlayingAll;
  const isPlayAllButtonDisabled =
    !isHydrated || !hasSentences || isSingleSentencePlaying; // Disable if a sentence is playing but not in "play all" mode
  const isStopButtonDisabled =
    !status.isPlayingAll && status.playingSentenceId === null;

  function handlePrimaryPlayback() {
    if (!status.isPlayingAll) {
      actions.playAll();
      return;
    }

    actions.togglePausePlayback();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Playback mode */}
      <Select
        value={settings.playbackMode}
        onValueChange={(value) =>
          settings.setPlaybackMode(value as PlaybackMode)
        }
      >
        <SelectTrigger
          className={`${controlClassName} cursor-pointer hover:bg-muted data-[state=open]:bg-muted`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {PLAYBACK_MODE_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Loop toggle */}
      <Button
        type="button"
        variant="outline"
        onClick={() => settings.setLoopPlayback(!settings.loopPlayback)}
        className={`${controlClassName} inline-flex cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${
          settings.loopPlayback
            ? 'border-emerald-500 text-emerald-600'
            : 'border-border bg-background text-foreground hover:bg-muted'
        }`}
      >
        Loop
      </Button>

      {/* Playall / pause */}
      <Button
        variant="outline"
        className={`${controlClassName} cursor-pointer`}
        onClick={handlePrimaryPlayback}
        disabled={isPlayAllButtonDisabled}
      >
        <PrimaryPlaybackIcon />
        {primaryPlaybackLabel}
      </Button>

      {/* Stop */}
      <Button
        variant="outline"
        className={`${controlClassName} cursor-pointer`}
        onClick={actions.stopPlayback}
        disabled={isStopButtonDisabled}
      >
        <Square />
        Stop
      </Button>
    </div>
  );
}
